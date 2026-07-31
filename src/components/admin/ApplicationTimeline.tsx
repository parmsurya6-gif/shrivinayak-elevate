import { useEffect, useState, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Save, Trash2, CheckCircle2, Clock, Loader2, GripVertical } from "lucide-react";

export interface TimelineItem {
  id: string;
  application_id: string;
  title: string;
  description: string | null;
  event_at: string;
  status: string;
  position: number;
}

const STATUSES = [
  { value: "pending", label: "Pending" },
  { value: "in_progress", label: "In Progress" },
  { value: "done", label: "Completed" },
];

const toLocalInput = (iso: string) => {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const nodeStyles: Record<string, string> = {
  done: "bg-accent text-accent-foreground border-accent",
  in_progress: "bg-amber-100 text-amber-700 border-amber-300",
  pending: "bg-secondary text-muted-foreground border-border",
};

const ApplicationTimeline = ({ applicationId }: { applicationId: string }) => {
  const [items, setItems] = useState<TimelineItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);
  const [dragId, setDragId] = useState<string | null>(null);
  const overId = useRef<string | null>(null);

  const load = useCallback(async () => {
    const { data } = await supabase
      .from("application_timeline")
      .select("*")
      .eq("application_id", applicationId)
      .order("position", { ascending: true });
    setItems((data as TimelineItem[]) ?? []);
    setLoading(false);
  }, [applicationId]);

  useEffect(() => { load(); }, [load]);

  const patch = (id: string, changes: Partial<TimelineItem>) =>
    setItems(prev => prev.map(i => (i.id === id ? { ...i, ...changes } : i)));

  const addMilestone = async () => {
    setAdding(true);
    const { error } = await supabase.from("application_timeline").insert({
      application_id: applicationId,
      title: "New Milestone",
      status: "pending",
      position: items.length,
      event_at: new Date().toISOString(),
    });
    setAdding(false);
    if (error) { toast.error("Could not add milestone"); return; }
    toast.success("Milestone added");
    load();
  };

  const saveMilestone = async (item: TimelineItem) => {
    setSavingId(item.id);
    const { error } = await supabase
      .from("application_timeline")
      .update({
        title: item.title,
        description: item.description,
        status: item.status,
        event_at: new Date(item.event_at).toISOString(),
      })
      .eq("id", item.id);
    setSavingId(null);
    if (error) { toast.error("Could not save milestone"); return; }
    toast.success("Milestone saved");
  };

  const deleteMilestone = async (id: string) => {
    const { error } = await supabase.from("application_timeline").delete().eq("id", id);
    if (error) { toast.error("Could not delete milestone"); return; }
    setItems(prev => prev.filter(i => i.id !== id));
    toast.success("Milestone removed");
  };

  const persistOrder = async (ordered: TimelineItem[]) => {
    await Promise.all(
      ordered.map((it, idx) =>
        supabase.from("application_timeline").update({ position: idx }).eq("id", it.id)
      )
    );
    toast.success("Order updated");
  };

  const handleDrop = () => {
    const from = items.findIndex(i => i.id === dragId);
    const to = items.findIndex(i => i.id === overId.current);
    setDragId(null);
    overId.current = null;
    if (from < 0 || to < 0 || from === to) return;
    const next = [...items];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    setItems(next.map((it, idx) => ({ ...it, position: idx })));
    persistOrder(next);
  };

  return (
    <div className="mt-6 border-t border-border pt-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="font-display font-bold text-base">Progress Flowchart</h4>
          <p className="text-xs text-muted-foreground">Drag milestones to reorder. Click a node to edit.</p>
        </div>
        <button
          onClick={addMilestone}
          disabled={adding}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent text-accent-foreground text-xs font-medium hover:bg-accent/90 disabled:opacity-50"
        >
          <Plus size={14} /> Add Milestone
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading timeline…</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-muted-foreground">No milestones yet. Add the first step of this application's journey.</p>
      ) : (
        <ol className="relative">
          <span className="absolute left-1/2 top-2 bottom-2 w-px -translate-x-1/2 bg-border" aria-hidden />
          {items.map((item, idx) => {
            const left = idx % 2 === 0;
            const open = openId === item.id;
            return (
              <li
                key={item.id}
                draggable
                onDragStart={() => setDragId(item.id)}
                onDragOver={(e) => { e.preventDefault(); overId.current = item.id; }}
                onDrop={handleDrop}
                onDragEnd={() => setDragId(null)}
                className={`relative py-3 grid grid-cols-2 gap-6 ${dragId === item.id ? "opacity-50" : ""}`}
              >
                <div className={left ? "col-start-1 pr-6 text-right" : "col-start-2 pl-6 text-left"}>
                  <button
                    onClick={() => setOpenId(open ? null : item.id)}
                    className="w-full rounded-lg border border-border bg-background p-3 text-left hover:border-accent transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <GripVertical size={14} className="text-muted-foreground cursor-grab shrink-0" />
                      <span className="font-medium text-sm truncate">{item.title || "Untitled"}</span>
                    </span>
                    <span className="block text-[11px] text-muted-foreground mt-1">
                      {new Date(item.event_at).toLocaleString()} · {STATUSES.find(s => s.value === item.status)?.label}
                    </span>
                  </button>

                  {open && (
                    <div className="mt-2 rounded-lg border border-border p-3 space-y-2 bg-card text-left">
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => patch(item.id, { title: e.target.value })}
                        placeholder="Milestone title (e.g. Interview Scheduled)"
                        className="w-full px-2.5 py-1.5 rounded-md border border-input bg-background text-sm font-medium"
                      />
                      <textarea
                        value={item.description ?? ""}
                        onChange={(e) => patch(item.id, { description: e.target.value })}
                        rows={2}
                        placeholder="Notes (optional)"
                        className="w-full px-2.5 py-1.5 rounded-md border border-input bg-background text-sm resize-none"
                      />
                      <div className="flex flex-wrap gap-2">
                        <input
                          type="datetime-local"
                          value={toLocalInput(item.event_at)}
                          onChange={(e) => patch(item.id, { event_at: e.target.value })}
                          className="px-2.5 py-1.5 rounded-md border border-input bg-background text-xs"
                        />
                        <select
                          value={item.status}
                          onChange={(e) => patch(item.id, { status: e.target.value })}
                          className="px-2.5 py-1.5 rounded-md border border-input bg-background text-xs"
                        >
                          {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                        </select>
                        <button
                          onClick={() => saveMilestone(item)}
                          disabled={savingId === item.id}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-accent/10 text-accent text-xs font-medium hover:bg-accent/20 disabled:opacity-50"
                        >
                          <Save size={13} /> Save
                        </button>
                        <button
                          onClick={() => deleteMilestone(item.id)}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-destructive text-xs font-medium hover:bg-destructive/10"
                        >
                          <Trash2 size={13} /> Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <span
                  className={`absolute left-1/2 top-6 flex h-6 w-6 -translate-x-1/2 items-center justify-center rounded-full border ${nodeStyles[item.status] ?? nodeStyles.pending}`}
                >
                  {item.status === "done" ? <CheckCircle2 size={13} /> : item.status === "in_progress" ? <Loader2 size={13} /> : <Clock size={13} />}
                </span>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
};

export default ApplicationTimeline;
