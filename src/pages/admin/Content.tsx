import { useEffect, useState, useRef } from "react";
import AdminLayout from "@/components/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Save, Trash2, Upload, Image, Type, Eye, X, ChevronDown, ChevronRight } from "lucide-react";
import { uploadSiteImage, upsertContent, deleteContent } from "@/hooks/useSiteContent";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ContentItem {
  id: string;
  page: string;
  section: string;
  content_key: string;
  content_value: string | null;
  content_type: string;
}

// Define the page structure for the visual editor
const PAGE_STRUCTURE: Record<string, { label: string; sections: { key: string; label: string; fields: { key: string; label: string; type: "text" | "textarea" | "image" }[] }[] }> = {
  home: {
    label: "Homepage",
    sections: [
      {
        key: "hero", label: "Hero Section",
        fields: [
          { key: "title", label: "Hero Title", type: "text" },
          { key: "subtitle", label: "Hero Subtitle", type: "textarea" },
          { key: "image", label: "Hero Background Image", type: "image" },
        ],
      },
      {
        key: "about", label: "About Section",
        fields: [
          { key: "tagline", label: "Tagline", type: "text" },
          { key: "title", label: "Section Title", type: "text" },
          { key: "description", label: "Description", type: "textarea" },
          { key: "image", label: "About Image", type: "image" },
        ],
      },
      {
        key: "stats", label: "Statistics",
        fields: [
          { key: "stat_1_value", label: "Stat 1 Value", type: "text" },
          { key: "stat_1_label", label: "Stat 1 Label", type: "text" },
          { key: "stat_2_value", label: "Stat 2 Value", type: "text" },
          { key: "stat_2_label", label: "Stat 2 Label", type: "text" },
          { key: "stat_3_value", label: "Stat 3 Value", type: "text" },
          { key: "stat_3_label", label: "Stat 3 Label", type: "text" },
          { key: "stat_4_value", label: "Stat 4 Value", type: "text" },
          { key: "stat_4_label", label: "Stat 4 Label", type: "text" },
        ],
      },
      {
        key: "capabilities", label: "Capabilities Section",
        fields: [
          { key: "title", label: "Section Title", type: "text" },
          { key: "cap_1_title", label: "Capability 1 Title", type: "text" },
          { key: "cap_1_desc", label: "Capability 1 Description", type: "textarea" },
          { key: "cap_1_image", label: "Capability 1 Image", type: "image" },
          { key: "cap_2_title", label: "Capability 2 Title", type: "text" },
          { key: "cap_2_desc", label: "Capability 2 Description", type: "textarea" },
          { key: "cap_2_image", label: "Capability 2 Image", type: "image" },
          { key: "cap_3_title", label: "Capability 3 Title", type: "text" },
          { key: "cap_3_desc", label: "Capability 3 Description", type: "textarea" },
          { key: "cap_3_image", label: "Capability 3 Image", type: "image" },
        ],
      },
      {
        key: "awards", label: "Awards & Achievements",
        fields: [
          { key: "title", label: "Section Title", type: "text" },
          { key: "award_1_title", label: "Award 1 Title", type: "text" },
          { key: "award_1_image", label: "Award 1 Image", type: "image" },
          { key: "award_2_title", label: "Award 2 Title", type: "text" },
          { key: "award_2_image", label: "Award 2 Image", type: "image" },
          { key: "award_3_title", label: "Award 3 Title", type: "text" },
          { key: "award_3_image", label: "Award 3 Image", type: "image" },
          { key: "award_4_title", label: "Award 4 Title", type: "text" },
          { key: "award_4_image", label: "Award 4 Image", type: "image" },
          { key: "award_5_title", label: "Award 5 Title", type: "text" },
          { key: "award_5_image", label: "Award 5 Image", type: "image" },
          { key: "award_6_title", label: "Award 6 Title", type: "text" },
          { key: "award_6_image", label: "Award 6 Image", type: "image" },
        ],
      },
      {
        key: "cta", label: "Call to Action",
        fields: [
          { key: "title", label: "CTA Title", type: "text" },
          { key: "description", label: "CTA Description", type: "textarea" },
          { key: "image", label: "CTA Background Image", type: "image" },
        ],
      },
    ],
  },
  company: {
    label: "Company",
    sections: [
      {
        key: "hero", label: "Hero Banner",
        fields: [
          { key: "title", label: "Page Title", type: "text" },
          { key: "subtitle", label: "Subtitle", type: "text" },
          { key: "image", label: "Banner Image", type: "image" },
        ],
      },
      {
        key: "journey", label: "Our Journey",
        fields: [
          { key: "title", label: "Section Title", type: "text" },
          { key: "description", label: "Journey Description", type: "textarea" },
          { key: "image", label: "Journey Image", type: "image" },
        ],
      },
      {
        key: "vision", label: "Vision & Mission",
        fields: [
          { key: "vision_title", label: "Vision Title", type: "text" },
          { key: "vision_text", label: "Vision Text", type: "textarea" },
          { key: "vision_image", label: "Vision Image", type: "image" },
          { key: "mission_title", label: "Mission Title", type: "text" },
          { key: "mission_text", label: "Mission Text", type: "textarea" },
          { key: "mission_image", label: "Mission Image", type: "image" },
        ],
      },
      {
        key: "quality", label: "Quality Policy",
        fields: [
          { key: "title", label: "Section Title", type: "text" },
          { key: "description", label: "Quality Policy Text", type: "textarea" },
          { key: "image", label: "Quality Image", type: "image" },
        ],
      },
    ],
  },
  capabilities: {
    label: "Capabilities",
    sections: [
      {
        key: "hero", label: "Hero Banner",
        fields: [
          { key: "title", label: "Page Title", type: "text" },
          { key: "subtitle", label: "Subtitle", type: "text" },
          { key: "image", label: "Banner Image", type: "image" },
        ],
      },
      {
        key: "services", label: "Services List",
        fields: [
          { key: "service_1_title", label: "Service 1 Title", type: "text" },
          { key: "service_1_desc", label: "Service 1 Description", type: "textarea" },
          { key: "service_1_image", label: "Service 1 Image", type: "image" },
          { key: "service_2_title", label: "Service 2 Title", type: "text" },
          { key: "service_2_desc", label: "Service 2 Description", type: "textarea" },
          { key: "service_2_image", label: "Service 2 Image", type: "image" },
          { key: "service_3_title", label: "Service 3 Title", type: "text" },
          { key: "service_3_desc", label: "Service 3 Description", type: "textarea" },
          { key: "service_3_image", label: "Service 3 Image", type: "image" },
        ],
      },
    ],
  },
  products: {
    label: "Products",
    sections: [
      {
        key: "hero", label: "Hero Banner",
        fields: [
          { key: "title", label: "Page Title", type: "text" },
          { key: "subtitle", label: "Subtitle", type: "text" },
          { key: "image", label: "Banner Image", type: "image" },
        ],
      },
      {
        key: "gallery", label: "Product Gallery",
        fields: Array.from({ length: 10 }, (_, i) => ({
          key: `product_${i + 1}_image`, label: `Product ${i + 1} Image`, type: "image" as const,
        })),
      },
    ],
  },
  industries: {
    label: "Industries",
    sections: [
      {
        key: "hero", label: "Hero Banner",
        fields: [
          { key: "title", label: "Page Title", type: "text" },
          { key: "subtitle", label: "Subtitle", type: "text" },
          { key: "image", label: "Banner Image", type: "image" },
        ],
      },
      {
        key: "list", label: "Industries List",
        fields: [
          { key: "ind_1_title", label: "Industry 1 Title", type: "text" },
          { key: "ind_1_desc", label: "Industry 1 Description", type: "textarea" },
          { key: "ind_1_image", label: "Industry 1 Image", type: "image" },
          { key: "ind_2_title", label: "Industry 2 Title", type: "text" },
          { key: "ind_2_desc", label: "Industry 2 Description", type: "textarea" },
          { key: "ind_2_image", label: "Industry 2 Image", type: "image" },
          { key: "ind_3_title", label: "Industry 3 Title", type: "text" },
          { key: "ind_3_desc", label: "Industry 3 Description", type: "textarea" },
          { key: "ind_3_image", label: "Industry 3 Image", type: "image" },
        ],
      },
    ],
  },
  clients: {
    label: "Clients",
    sections: [
      {
        key: "hero", label: "Hero Banner",
        fields: [
          { key: "title", label: "Page Title", type: "text" },
          { key: "image", label: "Banner Image", type: "image" },
        ],
      },
      {
        key: "awards", label: "Awards & Achievements",
        fields: [
          { key: "award_1_title", label: "Award 1 Title", type: "text" },
          { key: "award_1_image", label: "Award 1 Image", type: "image" },
          { key: "award_2_title", label: "Award 2 Title", type: "text" },
          { key: "award_2_image", label: "Award 2 Image", type: "image" },
          { key: "award_3_title", label: "Award 3 Title", type: "text" },
          { key: "award_3_image", label: "Award 3 Image", type: "image" },
          { key: "award_4_title", label: "Award 4 Title", type: "text" },
          { key: "award_4_image", label: "Award 4 Image", type: "image" },
          { key: "award_5_title", label: "Award 5 Title", type: "text" },
          { key: "award_5_image", label: "Award 5 Image", type: "image" },
          { key: "award_6_title", label: "Award 6 Title", type: "text" },
          { key: "award_6_image", label: "Award 6 Image", type: "image" },
        ],
      },
    ],
  },
  facility: {
    label: "Facility Tour",
    sections: [
      {
        key: "hero", label: "Hero Banner",
        fields: [
          { key: "title", label: "Page Title", type: "text" },
          { key: "subtitle", label: "Subtitle", type: "text" },
          { key: "image", label: "Banner Image", type: "image" },
        ],
      },
      {
        key: "images", label: "Facility Images",
        fields: Array.from({ length: 8 }, (_, i) => ({
          key: `facility_${i + 1}_image`, label: `Facility ${i + 1} Image`, type: "image" as const,
        })),
      },
    ],
  },
  contact: {
    label: "Contact",
    sections: [
      {
        key: "hero", label: "Hero Banner",
        fields: [
          { key: "title", label: "Page Title", type: "text" },
          { key: "subtitle", label: "Subtitle", type: "text" },
          { key: "image", label: "Banner Image", type: "image" },
        ],
      },
      {
        key: "info", label: "Contact Information",
        fields: [
          { key: "address", label: "Address", type: "textarea" },
          { key: "email_1", label: "Email 1", type: "text" },
          { key: "email_2", label: "Email 2", type: "text" },
          { key: "phone_1", label: "Phone 1", type: "text" },
          { key: "phone_2", label: "Phone 2", type: "text" },
          { key: "phone_3", label: "Phone 3", type: "text" },
        ],
      },
    ],
  },
  careers: {
    label: "Careers",
    sections: [
      {
        key: "hero", label: "Hero Banner",
        fields: [
          { key: "title", label: "Page Title", type: "text" },
          { key: "subtitle", label: "Subtitle", type: "text" },
          { key: "image", label: "Banner Image", type: "image" },
        ],
      },
      {
        key: "culture", label: "Company Culture",
        fields: [
          { key: "title", label: "Section Title", type: "text" },
          { key: "description", label: "Culture Description", type: "textarea" },
        ],
      },
    ],
  },
};

const ImageUploadField = ({
  value,
  onUpload,
  label,
  page,
  section,
  fieldKey,
}: {
  value: string;
  onUpload: (url: string) => void;
  label: string;
  page: string;
  section: string;
  fieldKey: string;
}) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const path = `${page}/${section}/${fieldKey}-${Date.now()}.${file.name.split(".").pop()}`;
    const url = await uploadSiteImage(file, path);
    if (url) {
      onUpload(url);
      toast.success("Image uploaded");
    } else {
      toast.error("Upload failed");
    }
    setUploading(false);
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <div className="flex items-center gap-3">
        <div className="relative w-24 h-24 rounded-lg border border-border bg-secondary/50 overflow-hidden flex-shrink-0">
          {value ? (
            <>
              <img src={value} alt={label} className="w-full h-full object-cover" />
              <button
                onClick={() => setPreview(true)}
                className="absolute inset-0 bg-foreground/0 hover:bg-foreground/30 transition-colors flex items-center justify-center"
              >
                <Eye size={16} className="text-primary-foreground opacity-0 hover:opacity-100" />
              </button>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Image size={24} className="text-muted-foreground" />
            </div>
          )}
        </div>
        <div className="flex-1 space-y-2">
          <input
            type="text"
            value={value}
            onChange={(e) => onUpload(e.target.value)}
            placeholder="Image URL or upload..."
            className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm"
          />
          <div className="flex gap-2">
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-accent/10 text-accent text-xs font-medium hover:bg-accent/20 transition-colors disabled:opacity-50"
            >
              <Upload size={14} />
              {uploading ? "Uploading..." : "Upload"}
            </button>
            {value && (
              <button
                onClick={() => setPreview(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-secondary text-foreground text-xs font-medium hover:bg-secondary/80 transition-colors"
              >
                <Eye size={14} /> Preview
              </button>
            )}
          </div>
        </div>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
      </div>

      {/* Preview modal */}
      {preview && value && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/60 p-4" onClick={() => setPreview(false)}>
          <div className="relative max-w-3xl max-h-[80vh] bg-card rounded-xl overflow-hidden shadow-xl" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setPreview(false)} className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-foreground/50 text-primary-foreground hover:bg-foreground/70">
              <X size={16} />
            </button>
            <img src={value} alt={label} className="max-w-full max-h-[80vh] object-contain" />
          </div>
        </div>
      )}
    </div>
  );
};

const ContentManager = () => {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [localValues, setLocalValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState("home");
  const [showRawEditor, setShowRawEditor] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [newItem, setNewItem] = useState({ page: "", section: "", content_key: "", content_value: "", content_type: "text" });

  const load = async () => {
    const { data } = await supabase.from("site_content").select("*").order("page").order("section");
    const loaded = (data as ContentItem[]) ?? [];
    setItems(loaded);
    // Build local values map
    const vals: Record<string, string> = {};
    loaded.forEach((item) => {
      vals[`${item.page}|${item.section}|${item.content_key}`] = item.content_value ?? "";
    });
    setLocalValues(vals);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const getFieldValue = (page: string, section: string, key: string) => {
    const mapKey = `${page}|${section}|${key}`;
    if (mapKey in localValues) return localValues[mapKey];
    return items.find(i => i.page === page && i.section === section && i.content_key === key)?.content_value ?? "";
  };

  const setFieldValue = (page: string, section: string, key: string, value: string) => {
    setLocalValues(prev => ({ ...prev, [`${page}|${section}|${key}`]: value }));
  };

  const saveField = async (page: string, section: string, key: string, type: string = "text") => {
    const savingKey = `${page}|${section}|${key}`;
    setSaving(prev => ({ ...prev, [savingKey]: true }));
    const value = getFieldValue(page, section, key);
    const success = await upsertContent(page, section, key, value, type);
    if (success) {
      toast.success(`Saved: ${key}`);
      await load();
    } else {
      toast.error("Failed to save");
    }
    setSaving(prev => ({ ...prev, [savingKey]: false }));
  };

  const saveSection = async (page: string, sectionKey: string, fields: { key: string; type: string }[]) => {
    let allSuccess = true;
    for (const field of fields) {
      const value = getFieldValue(page, sectionKey, field.key);
      const contentType = field.type === "image" ? "image" : "text";
      const success = await upsertContent(page, sectionKey, field.key, value, contentType);
      if (!success) allSuccess = false;
    }
    if (allSuccess) {
      toast.success("Section saved successfully");
      await load();
    } else {
      toast.error("Some fields failed to save");
    }
  };

  const toggleSection = (key: string) => {
    setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const addItem = async () => {
    const { error } = await supabase.from("site_content").insert(newItem);
    if (error) { toast.error(error.message); return; }
    toast.success("Content added");
    setNewItem({ page: "", section: "", content_key: "", content_value: "", content_type: "text" });
    setShowAdd(false);
    load();
  };

  const handleDeleteItem = async (id: string) => {
    const success = await deleteContent(id);
    if (success) { toast.success("Deleted"); load(); }
    else toast.error("Failed to delete");
  };

  const pageKeys = Object.keys(PAGE_STRUCTURE);

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-bold text-2xl">Content Management</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage all website text and images from here</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowRawEditor(!showRawEditor)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${showRawEditor ? "bg-accent text-accent-foreground" : "bg-secondary text-foreground hover:bg-secondary/80"}`}
          >
            {showRawEditor ? "Visual Editor" : "Raw Editor"}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent" />
        </div>
      ) : showRawEditor ? (
        /* Raw Editor (old view) */
        <div>
          <div className="flex justify-end mb-4">
            <button onClick={() => setShowAdd(!showAdd)} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-accent-foreground text-sm font-medium hover:bg-accent/90">
              <Plus size={16} /> Add Entry
            </button>
          </div>
          {showAdd && (
            <div className="bg-card rounded-xl p-6 border border-border mb-6 space-y-4">
              <div className="grid sm:grid-cols-3 gap-4">
                <input placeholder="Page" value={newItem.page} onChange={(e) => setNewItem({ ...newItem, page: e.target.value })} className="px-3 py-2 rounded-lg border border-input bg-background text-sm" />
                <input placeholder="Section" value={newItem.section} onChange={(e) => setNewItem({ ...newItem, section: e.target.value })} className="px-3 py-2 rounded-lg border border-input bg-background text-sm" />
                <input placeholder="Key" value={newItem.content_key} onChange={(e) => setNewItem({ ...newItem, content_key: e.target.value })} className="px-3 py-2 rounded-lg border border-input bg-background text-sm" />
              </div>
              <textarea placeholder="Value" value={newItem.content_value} onChange={(e) => setNewItem({ ...newItem, content_value: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm resize-none" rows={3} />
              <div className="flex gap-2">
                <select value={newItem.content_type} onChange={(e) => setNewItem({ ...newItem, content_type: e.target.value })} className="px-3 py-2 rounded-lg border border-input bg-background text-sm">
                  <option value="text">Text</option>
                  <option value="image">Image</option>
                </select>
                <button onClick={addItem} className="px-4 py-2 rounded-lg bg-accent text-accent-foreground text-sm font-medium">Save</button>
              </div>
            </div>
          )}
          {[...new Set(items.map(i => i.page))].map(page => (
            <div key={page} className="mb-8">
              <h2 className="font-display font-bold text-lg mb-3 capitalize">{page}</h2>
              <div className="space-y-3">
                {items.filter(i => i.page === page).map(item => (
                  <div key={item.id} className="bg-card rounded-lg p-4 border border-border flex flex-col sm:flex-row gap-3 items-start">
                    <div className="flex-shrink-0 w-40">
                      <p className="text-xs text-muted-foreground">{item.section}</p>
                      <p className="font-medium text-sm">{item.content_key}</p>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-secondary text-muted-foreground">{item.content_type}</span>
                    </div>
                    {item.content_type === "image" ? (
                      <div className="flex-1 flex items-center gap-3">
                        {item.content_value && <img src={item.content_value} alt="" className="w-16 h-16 object-cover rounded" />}
                        <input
                          value={item.content_value ?? ""}
                          onChange={(e) => setItems(items.map(i => i.id === item.id ? { ...i, content_value: e.target.value } : i))}
                          className="flex-1 px-3 py-2 rounded-lg border border-input bg-background text-sm"
                        />
                      </div>
                    ) : (
                      <textarea
                        value={item.content_value ?? ""}
                        onChange={(e) => setItems(items.map(i => i.id === item.id ? { ...i, content_value: e.target.value } : i))}
                        className="flex-1 px-3 py-2 rounded-lg border border-input bg-background text-sm resize-none w-full"
                        rows={2}
                      />
                    )}
                    <div className="flex gap-2 flex-shrink-0">
                      <button onClick={async () => {
                        await supabase.from("site_content").update({ content_value: item.content_value }).eq("id", item.id);
                        toast.success("Saved");
                      }} className="p-2 rounded-lg bg-accent/10 text-accent hover:bg-accent/20"><Save size={16} /></button>
                      <button onClick={() => handleDeleteItem(item.id)} className="p-2 rounded-lg hover:bg-destructive/10 text-destructive"><Trash2 size={16} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Visual Editor */
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="flex flex-wrap gap-1 h-auto p-1 mb-6 bg-secondary">
            {pageKeys.map(key => (
              <TabsTrigger key={key} value={key} className="text-sm capitalize">
                {PAGE_STRUCTURE[key].label}
              </TabsTrigger>
            ))}
          </TabsList>

          {pageKeys.map(pageKey => (
            <TabsContent key={pageKey} value={pageKey} className="space-y-4">
              {PAGE_STRUCTURE[pageKey].sections.map(section => {
                const sectionId = `${pageKey}-${section.key}`;
                const isExpanded = expandedSections[sectionId] !== false; // default open

                return (
                  <div key={sectionId} className="bg-card rounded-xl border border-border overflow-hidden">
                    <button
                      onClick={() => toggleSection(sectionId)}
                      className="w-full flex items-center justify-between p-5 hover:bg-secondary/30 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                        <h3 className="font-display font-bold text-base">{section.label}</h3>
                        <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded">
                          {section.fields.length} fields
                        </span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          saveSection(pageKey, section.key, section.fields);
                        }}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-accent text-accent-foreground text-sm font-medium hover:bg-accent/90 transition-colors"
                      >
                        <Save size={14} /> Save Section
                      </button>
                    </button>

                    {isExpanded && (
                      <div className="px-5 pb-5 space-y-5 border-t border-border pt-5">
                        {section.fields.map(field => (
                          <div key={field.key}>
                            {field.type === "image" ? (
                              <ImageUploadField
                                value={getFieldValue(pageKey, section.key, field.key)}
                                onUpload={(url) => setFieldValue(pageKey, section.key, field.key, url)}
                                label={field.label}
                                page={pageKey}
                                section={section.key}
                                fieldKey={field.key}
                              />
                            ) : field.type === "textarea" ? (
                              <div className="space-y-1.5">
                                <label className="text-sm font-medium text-foreground">{field.label}</label>
                                <textarea
                                  value={getFieldValue(pageKey, section.key, field.key)}
                                  onChange={(e) => setFieldValue(pageKey, section.key, field.key, e.target.value)}
                                  className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm resize-none"
                                  rows={3}
                                  placeholder={`Enter ${field.label.toLowerCase()}...`}
                                />
                              </div>
                            ) : (
                              <div className="space-y-1.5">
                                <label className="text-sm font-medium text-foreground">{field.label}</label>
                                <div className="flex gap-2">
                                  <input
                                    type="text"
                                    value={getFieldValue(pageKey, section.key, field.key)}
                                    onChange={(e) => setFieldValue(pageKey, section.key, field.key, e.target.value)}
                                    className="flex-1 px-3 py-2 rounded-lg border border-input bg-background text-sm"
                                    placeholder={`Enter ${field.label.toLowerCase()}...`}
                                  />
                                  <button
                                    onClick={() => saveField(pageKey, section.key, field.key)}
                                    disabled={saving[`${pageKey}|${section.key}|${field.key}`]}
                                    className="p-2 rounded-lg bg-accent/10 text-accent hover:bg-accent/20 transition-colors disabled:opacity-50"
                                  >
                                    <Save size={16} />
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </TabsContent>
          ))}
        </Tabs>
      )}
    </AdminLayout>
  );
};

export default ContentManager;
