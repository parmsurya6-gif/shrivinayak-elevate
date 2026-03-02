import { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Save, Trash2 } from "lucide-react";

interface ContentItem {
  id: string;
  page: string;
  section: string;
  content_key: string;
  content_value: string | null;
  content_type: string;
}

const ContentManager = () => {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newItem, setNewItem] = useState({ page: "", section: "", content_key: "", content_value: "", content_type: "text" });

  const load = async () => {
    const { data } = await supabase.from("site_content").select("*").order("page").order("section");
    setItems((data as ContentItem[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const saveItem = async (item: ContentItem) => {
    await supabase.from("site_content").update({ content_value: item.content_value }).eq("id", item.id);
    toast.success("Content saved");
  };

  const addItem = async () => {
    const { error } = await supabase.from("site_content").insert(newItem);
    if (error) { toast.error(error.message); return; }
    toast.success("Content added");
    setNewItem({ page: "", section: "", content_key: "", content_value: "", content_type: "text" });
    setShowAdd(false);
    load();
  };

  const deleteItem = async (id: string) => {
    await supabase.from("site_content").delete().eq("id", id);
    toast.success("Deleted");
    load();
  };

  const pages = [...new Set(items.map((i) => i.page))];

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display font-bold text-2xl">Content Management</h1>
        <button onClick={() => setShowAdd(!showAdd)} className="btn-primary flex items-center gap-2 text-sm">
          <Plus size={16} /> Add Content
        </button>
      </div>

      {showAdd && (
        <div className="bg-card rounded-xl p-6 border border-border mb-6 space-y-4">
          <div className="grid sm:grid-cols-3 gap-4">
            <input placeholder="Page (e.g. home)" value={newItem.page} onChange={(e) => setNewItem({ ...newItem, page: e.target.value })} className="px-3 py-2 rounded border border-input bg-background text-sm" />
            <input placeholder="Section (e.g. hero)" value={newItem.section} onChange={(e) => setNewItem({ ...newItem, section: e.target.value })} className="px-3 py-2 rounded border border-input bg-background text-sm" />
            <input placeholder="Key (e.g. title)" value={newItem.content_key} onChange={(e) => setNewItem({ ...newItem, content_key: e.target.value })} className="px-3 py-2 rounded border border-input bg-background text-sm" />
          </div>
          <textarea placeholder="Content value" value={newItem.content_value} onChange={(e) => setNewItem({ ...newItem, content_value: e.target.value })} className="w-full px-3 py-2 rounded border border-input bg-background text-sm resize-none" rows={3} />
          <button onClick={addItem} className="btn-primary text-sm">Save</button>
        </div>
      )}

      {loading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : items.length === 0 ? (
        <p className="text-muted-foreground">No content entries yet. Add some to manage your website content.</p>
      ) : (
        pages.map((page) => (
          <div key={page} className="mb-8">
            <h2 className="font-display font-bold text-lg mb-3 capitalize">{page}</h2>
            <div className="space-y-3">
              {items.filter((i) => i.page === page).map((item) => (
                <div key={item.id} className="bg-card rounded-lg p-4 border border-border flex flex-col sm:flex-row gap-3 items-start">
                  <div className="flex-shrink-0 w-40">
                    <p className="text-xs text-muted-foreground">{item.section}</p>
                    <p className="font-medium text-sm">{item.content_key}</p>
                  </div>
                  <textarea
                    value={item.content_value ?? ""}
                    onChange={(e) => setItems(items.map((i) => i.id === item.id ? { ...i, content_value: e.target.value } : i))}
                    className="flex-1 px-3 py-2 rounded border border-input bg-background text-sm resize-none w-full"
                    rows={2}
                  />
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => saveItem(item)} className="p-2 rounded bg-accent/10 text-accent hover:bg-accent/20"><Save size={16} /></button>
                    <button onClick={() => deleteItem(item.id)} className="p-2 rounded hover:bg-destructive/10 text-destructive"><Trash2 size={16} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </AdminLayout>
  );
};

export default ContentManager;
