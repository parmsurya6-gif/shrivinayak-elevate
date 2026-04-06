import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

interface CmsItem {
  section: string;
  content_key: string;
  content_value: string | null;
}

export function useCmsPage(page: string, defaults: Record<string, Record<string, string>>) {
  const [items, setItems] = useState<CmsItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    supabase
      .from("site_content")
      .select("section, content_key, content_value")
      .eq("page", page)
      .then(({ data }) => {
        setItems((data as CmsItem[]) ?? []);
        setLoaded(true);
      });
  }, [page]);

  const get = useCallback(
    (section: string, key: string): string => {
      const found = items.find(
        (i) => i.section === section && i.content_key === key
      );
      if (found?.content_value) return found.content_value;
      return defaults[section]?.[key] ?? "";
    },
    [items, defaults]
  );

  return { get, loaded };
}
