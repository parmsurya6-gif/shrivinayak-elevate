import { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Trash2, Eye } from "lucide-react";

interface Application {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  position: string;
  experience: string | null;
  cover_letter: string | null;
  status: string;
  created_at: string;
  qualification?: string | null;
  gender?: string | null;
  expected_salary?: string | null;
  previous_salary?: string | null;
  previous_company?: string | null;
  current_designation?: string | null;
  resume_url?: string | null;
}

const Applications = () => {
  const [items, setItems] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Application | null>(null);

  const load = async () => {
    const { data } = await supabase.from("job_applications").select("*").order("created_at", { ascending: false });
    setItems((data as Application[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id: string, status: string) => {
    await supabase.from("job_applications").update({ status }).eq("id", id);
    toast.success("Status updated");
    load();
  };

  const deleteItem = async (id: string) => {
    await supabase.from("job_applications").delete().eq("id", id);
    toast.success("Application deleted");
    load();
  };

  return (
    <AdminLayout>
      <h1 className="font-display font-bold text-2xl mb-6">Job Applications</h1>
      {loading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : items.length === 0 ? (
        <p className="text-muted-foreground">No applications yet.</p>
      ) : (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary/50 border-b border-border">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">Name</th>
                  <th className="text-left px-4 py-3 font-medium">Position</th>
                  <th className="text-left px-4 py-3 font-medium">Email</th>
                  <th className="text-left px-4 py-3 font-medium">Status</th>
                  <th className="text-left px-4 py-3 font-medium">Date</th>
                  <th className="text-left px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-b border-border last:border-0 hover:bg-secondary/20">
                    <td className="px-4 py-3 font-medium">{item.name}</td>
                    <td className="px-4 py-3">{item.position}</td>
                    <td className="px-4 py-3 text-muted-foreground">{item.email}</td>
                    <td className="px-4 py-3">
                      <select
                        value={item.status}
                        onChange={(e) => updateStatus(item.id, e.target.value)}
                        className="text-xs px-2 py-1 rounded border border-input bg-background"
                      >
                        <option value="new">New</option>
                        <option value="reviewed">Reviewed</option>
                        <option value="shortlisted">Shortlisted</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{new Date(item.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => setSelected(item)} className="p-1.5 rounded hover:bg-secondary"><Eye size={16} /></button>
                        <button onClick={() => deleteItem(item.id)} className="p-1.5 rounded hover:bg-destructive/10 text-destructive"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 p-4" onClick={() => setSelected(null)}>
          <div className="bg-card rounded-xl p-6 max-w-lg w-full border border-border shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-display font-bold text-xl mb-4">{selected.name}</h3>
            <div className="space-y-3 text-sm">
              <p><span className="font-medium">Position:</span> {selected.position}</p>
              <p><span className="font-medium">Email:</span> {selected.email}</p>
              <p><span className="font-medium">Phone:</span> {selected.phone || "N/A"}</p>
              <p><span className="font-medium">Experience:</span> {selected.experience || "N/A"}</p>
              <p><span className="font-medium">Qualification:</span> {selected.qualification || "N/A"}</p>
              <p><span className="font-medium">Gender:</span> {selected.gender || "N/A"}</p>
              <p><span className="font-medium">Expected Salary:</span> {selected.expected_salary || "N/A"}</p>
              <p><span className="font-medium">Previous Salary:</span> {selected.previous_salary || "N/A"}</p>
              <p><span className="font-medium">Previous Company:</span> {selected.previous_company || "N/A"}</p>
              <p><span className="font-medium">Current Designation:</span> {selected.current_designation || "N/A"}</p>
              {selected.resume_url && (
                <p>
                  <span className="font-medium">Resume:</span>{" "}
                  <a href={selected.resume_url} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">Download / View</a>
                </p>
              )}
              <p><span className="font-medium">Cover Letter:</span></p>
              <p className="text-muted-foreground bg-secondary/50 rounded-lg p-3">{selected.cover_letter || "None provided"}</p>
            </div>
            <button onClick={() => setSelected(null)} className="mt-6 btn-primary">Close</button>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default Applications;
