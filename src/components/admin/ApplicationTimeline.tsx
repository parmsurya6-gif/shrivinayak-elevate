import { useEffect, useState, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Save, Trash2, CheckCircle2, Clock, Loader2, GripVertical, ZoomIn, ZoomOut, Maximize2 } from "lucide-react";

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

const MIN_ZOOM = 0.4;
const MAX_ZOOM = 2.5;
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

const ApplicationTimeline = ({ applicationId }: { applicationId: string }) => {
  const [items, setItems] = useState<TimelineItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);
  const [dragId, setDragId] = useState<string | null>(null);
  const overId = useRef<string | null>(null);
  const [filter, setFilter] = useState<string>("all");

  // ---- zoom & pan ----
  const viewportRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const viewRef = useRef({ zoom: 1, offset: { x: 0, y: 0 } });
  viewRef.current = { zoom, offset };
  const panning = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null);

  const zoomAt = useCallback((px: number, py: number, next: number) => {
    const { zoom: z, offset: o } = viewRef.current;
    const nz = clamp(next, MIN_ZOOM, MAX_ZOOM);
    const k = nz / z;
    setZoom(nz);
    setOffset({ x: px - (px - o.x) * k, y: py - (py - o.y) * k });
  }, []);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (!e.ctrlKey && !e.metaKey && Math.abs(e.deltaY) < 2) return;
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      const dy = e.deltaY * (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? 100 : 1);
      zoomAt(e.clientX - rect.left, e.clientY - rect.top, viewRef.current.zoom * Math.exp(-dy * 0.0015));
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [zoomAt]);

  const zoomByButton = (factor: number) => {
    const el = viewportRef.current;
    const rect = el?.getBoundingClientRect();
    zoomAt((rect?.width ?? 0) / 2, (rect?.height ?? 0) / 2, viewRef.current.zoom * factor);
  };
  const resetView = () => { setZoom(1); setOffset({ x: 0, y: 0 }); };

  const startPan = (e: React.PointerEvent) => {
    if (dragId) return;
    const target = e.target as HTMLElement;
    if (target.closest("[data-node]")) return;
    panning.current = { x: e.clientX, y: e.clientY, ox: offset.x, oy: offset.y };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const movePan = (e: React.PointerEvent) => {
    const p = panning.current;
    if (!p) return;
    setOffset({ x: p.ox + (e.clientX - p.x), y: p.oy + (e.clientY - p.y) });
  };
  const endPan = () => { panning.current = null; };

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

  // Touch/pointer-friendly reordering from the grip handle.
  const handlePointerDrag = (id: string) => (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragId(id);
    overId.current = id;
    const onMove = (ev: PointerEvent) => {
      const el = document.elementFromPoint(ev.clientX, ev.clientY) as HTMLElement | null;
      const li = el?.closest("[data-milestone-id]") as HTMLElement | null;
      if (li?.dataset.milestoneId) overId.current = li.dataset.milestoneId;
    };
    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      handleDrop();
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
  };

  const visible = filter === "all" ? items : items.filter(i => i.status === filter);
  const counts = STATUSES.map(s => ({ ...s, count: items.filter(i => i.status === s.value).length }));

  return (
    <div className="mt-6 border-t border-border pt-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="font-display font-bold text-base">Progress Flowchart</h4>
          <p className="text-xs text-muted-foreground">Drag milestones to reorder. Click a node to edit.</p>
        </div>
        <div className="flex items-center gap-1.5">
          <button onClick={() => zoomByButton(1 / 1.2)} aria-label="Zoom out" className="grid h-8 w-8 place-items-center rounded-lg border border-border hover:bg-secondary"><ZoomOut size={14} /></button>
          <span className="text-[11px] tabular-nums text-muted-foreground w-10 text-center">{Math.round(zoom * 100)}%</span>
          <button onClick={() => zoomByButton(1.2)} aria-label="Zoom in" className="grid h-8 w-8 place-items-center rounded-lg border border-border hover:bg-secondary"><ZoomIn size={14} /></button>
          <button onClick={resetView} aria-label="Reset view" className="grid h-8 w-8 place-items-center rounded-lg border border-border hover:bg-secondary"><Maximize2 size={14} /></button>
          <button
            onClick={addMilestone}
            disabled={adding}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent text-accent-foreground text-xs font-medium hover:bg-accent/90 disabled:opacity-50"
          >
            <Plus size={14} /> Add Milestone
          </button>
        </div>
      </div>

      {/* Status filter + legend */}
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <button
          onClick={() => setFilter("all")}
          className={`px-2.5 py-1 rounded-full border text-[11px] font-medium ${filter === "all" ? "border-accent bg-accent/10 text-accent" : "border-border text-muted-foreground hover:bg-secondary"}`}
        >
          All ({items.length})
        </button>
        {counts.map(s => (
          <button
            key={s.value}
            onClick={() => setFilter(s.value)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-medium ${filter === s.value ? "border-accent bg-accent/10 text-accent" : "border-border text-muted-foreground hover:bg-secondary"}`}
          >
            <span className={`h-2.5 w-2.5 rounded-full border ${nodeStyles[s.value]}`} />
            {s.label} ({s.count})
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading timeline…</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-muted-foreground">No milestones yet. Add the first step of this application's journey.</p>
      ) : visible.length === 0 ? (
        <p className="text-sm text-muted-foreground">No milestones with this status.</p>
      ) : (
        <div
          ref={viewportRef}
          onPointerDown={startPan}
          onPointerMove={movePan}
          onPointerUp={endPan}
          onPointerCancel={endPan}
          className="relative overflow-hidden rounded-lg border border-border bg-secondary/20 touch-none cursor-grab active:cursor-grabbing"
          style={{ height: "min(70vh, 520px)" }}
        >
        <ol
          className="relative p-3 origin-top-left"
          style={{ transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`, width: "100%" }}
        >
          <span className="absolute left-1/2 top-2 bottom-2 w-px -translate-x-1/2 bg-border" aria-hidden />
          {visible.map((item, idx) => {
            const left = idx % 2 === 0;
            const open = openId === item.id;
            return (
              <li
                key={item.id}
                data-milestone-id={item.id}
                draggable
                onDragStart={() => setDragId(item.id)}
                onDragOver={(e) => { e.preventDefault(); overId.current = item.id; }}
                onDrop={handleDrop}
                onDragEnd={() => setDragId(null)}
                className={`relative py-3 grid grid-cols-2 gap-6 transition-all ${dragId === item.id ? "opacity-50" : ""} ${dragId && overId.current === item.id && dragId !== item.id ? "ring-2 ring-accent/50 rounded-lg" : ""}`}
              >
                <div data-node className={left ? "col-start-1 pr-6 text-right" : "col-start-2 pl-6 text-left"}>
                  <button
                    onClick={() => setOpenId(open ? null : item.id)}
                    className="w-full rounded-lg border border-border bg-background p-3 text-left hover:border-accent transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <GripVertical
                        size={14}
                        onPointerDown={handlePointerDrag(item.id)}
                        className="text-muted-foreground cursor-grab shrink-0 touch-none"
                      />
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
        </div>
      )}
    </div>
  );
};

export default ApplicationTimeline;
