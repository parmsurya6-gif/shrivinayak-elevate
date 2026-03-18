import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface SiteContentItem {
  id: string;
  page: string;
  section: string;
  content_key: string;
  content_value: string | null;
  content_type: string;
}

export function useSiteContent(page?: string) {
  const [items, setItems] = useState<SiteContentItem[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    let query = supabase.from("site_content").select("*").order("section").order("content_key");
    if (page) query = query.eq("page", page);
    const { data } = await query;
    setItems((data as SiteContentItem[]) ?? []);
    setLoading(false);
  }, [page]);

  useEffect(() => { load(); }, [load]);

  const getValue = useCallback((section: string, key: string) => {
    return items.find(i => i.section === section && i.content_key === key)?.content_value ?? "";
  }, [items]);

  return { items, loading, reload: load, getValue };
}

export async function uploadSiteImage(file: File, path: string): Promise<string | null> {
  const { data, error } = await supabase.storage
    .from("site-images")
    .upload(path, file, { upsert: true });
  if (error) return null;
  const { data: urlData } = supabase.storage.from("site-images").getPublicUrl(data.path);
  return urlData.publicUrl;
}

export async function upsertContent(
  page: string, section: string, key: string, value: string, type: string = "text"
): Promise<boolean> {
  // Try to find existing
  const { data: existing } = await supabase
    .from("site_content")
    .select("id")
    .eq("page", page)
    .eq("section", section)
    .eq("content_key", key)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase.from("site_content")
      .update({ content_value: value, content_type: type })
      .eq("id", existing.id);
    return !error;
  } else {
    const { error } = await supabase.from("site_content")
      .insert({ page, section, content_key: key, content_value: value, content_type: type });
    return !error;
  }
}

export async function deleteContent(id: string): Promise<boolean> {
  const { error } = await supabase.from("site_content").delete().eq("id", id);
  return !error;
}
