import { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Trash2, Edit2, X, ToggleLeft, ToggleRight } from "lucide-react";

interface JobPosting {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  is_active: boolean;
  created_at: string;
}

const emptyJob = { title: "", department: "", location: "Chakan, Pune", type: "Full-time", description: "" };

const Jobs = () => {
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(emptyJob);

  const load = async () => {
    const { data } = await supabase.from("job_postings").select("*").order("created_at", { ascending: false });
    setJobs((data as JobPosting[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      await supabase.from("job_postings").update(form).eq("id", editing);
      toast.success("Job updated");
    } else {
      await supabase.from("job_postings").insert(form);
      toast.success("Job created");
    }
    setForm(emptyJob);
    setShowForm(false);
    setEditing(null);
    load();
  };

  const toggleActive = async (id: string, current: boolean) => {
    await supabase.from("job_postings").update({ is_active: !current }).eq("id", id);
    toast.success(current ? "Job deactivated" : "Job activated");
    load();
  };

  const deleteJob = async (id: string) => {
    await supabase.from("job_postings").delete().eq("id", id);
    toast.success("Job deleted");
    load();
  };

  const startEdit = (job: JobPosting) => {
    setForm({ title: job.title, department: job.department, location: job.location, type: job.type, description: job.description });
    setEditing(job.id);
    setShowForm(true);
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display font-bold text-2xl">Job Postings</h1>
        <button
          onClick={() => { setShowForm(!showForm); setEditing(null); setForm(emptyJob); }}
          className="btn-primary flex items-center gap-2 text-xs"
        >
          {showForm ? <><X size={16} /> Cancel</> : <><Plus size={16} /> Add Job</>}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-card rounded-xl border border-border p-6 mb-6 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <input required placeholder="Job Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground outline-none focus:ring-2 focus:ring-accent" />
            <input required placeholder="Department" value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground outline-none focus:ring-2 focus:ring-accent" />
            <input required placeholder="Location" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground outline-none focus:ring-2 focus:ring-accent" />
            <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground outline-none focus:ring-2 focus:ring-accent">
              <option>Full-time</option>
              <option>Part-time</option>
              <option>Contract</option>
              <option>Internship</option>
            </select>
          </div>
          <textarea required rows={3} placeholder="Job Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground outline-none focus:ring-2 focus:ring-accent resize-none" />
          <button type="submit" className="btn-primary text-xs">{editing ? "Update Job" : "Create Job"}</button>
        </form>
      )}

      {loading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : jobs.length === 0 ? (
        <p className="text-muted-foreground">No job postings yet. Click "Add Job" to create one.</p>
      ) : (
        <div className="space-y-4">
          {jobs.map(job => (
            <div key={job.id} className={`bg-card rounded-xl border border-border p-6 ${!job.is_active ? "opacity-60" : ""}`}>
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-display font-bold text-lg">{job.title}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${job.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {job.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">{job.department} · {job.location} · {job.type}</p>
                  <p className="text-sm text-muted-foreground">{job.description}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => toggleActive(job.id, job.is_active)} className="p-2 rounded hover:bg-secondary" title={job.is_active ? "Deactivate" : "Activate"}>
                    {job.is_active ? <ToggleRight size={18} className="text-green-600" /> : <ToggleLeft size={18} className="text-muted-foreground" />}
                  </button>
                  <button onClick={() => startEdit(job)} className="p-2 rounded hover:bg-secondary"><Edit2 size={16} /></button>
                  <button onClick={() => deleteJob(job.id)} className="p-2 rounded hover:bg-destructive/10 text-destructive"><Trash2 size={16} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
};

export default Jobs;
