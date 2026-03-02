import { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Shield, Trash2, UserPlus } from "lucide-react";

interface Profile {
  id: string;
  user_id: string;
  email: string | null;
  display_name: string | null;
  created_at: string;
}

interface UserRole {
  id: string;
  user_id: string;
  role: string;
}

const UserManager = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSignup, setShowSignup] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const load = async () => {
    const [p, r] = await Promise.all([
      supabase.from("profiles").select("*").order("created_at", { ascending: false }),
      supabase.from("user_roles").select("*"),
    ]);
    setProfiles((p.data as Profile[]) ?? []);
    setRoles((r.data as UserRole[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const getUserRole = (userId: string) => roles.find((r) => r.user_id === userId)?.role || "user";

  const toggleAdmin = async (userId: string) => {
    const existing = roles.find((r) => r.user_id === userId && r.role === "admin");
    if (existing) {
      await supabase.from("user_roles").delete().eq("id", existing.id);
      toast.success("Admin role removed");
    } else {
      await supabase.from("user_roles").insert({ user_id: userId, role: "admin" } as any);
      toast.success("Admin role granted");
    }
    load();
  };

  const createAdmin = async () => {
    if (!newEmail || !newPassword) return;
    const { data, error } = await supabase.auth.signUp({ email: newEmail, password: newPassword });
    if (error) { toast.error(error.message); return; }
    if (data.user) {
      // Grant admin role
      await supabase.from("user_roles").insert({ user_id: data.user.id, role: "admin" } as any);
      toast.success("Admin user created! They need to verify their email first.");
    }
    setNewEmail("");
    setNewPassword("");
    setShowSignup(false);
    load();
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display font-bold text-2xl">Users & Roles</h1>
        <button onClick={() => setShowSignup(!showSignup)} className="btn-primary flex items-center gap-2 text-sm">
          <UserPlus size={16} /> Create Admin
        </button>
      </div>

      {showSignup && (
        <div className="bg-card rounded-xl p-6 border border-border mb-6 space-y-4">
          <h3 className="font-medium">Create New Admin User</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <input type="email" placeholder="Email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} className="px-3 py-2 rounded border border-input bg-background text-sm" />
            <input type="password" placeholder="Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="px-3 py-2 rounded border border-input bg-background text-sm" />
          </div>
          <button onClick={createAdmin} className="btn-primary text-sm">Create</button>
        </div>
      )}

      {loading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : profiles.length === 0 ? (
        <p className="text-muted-foreground">No users yet.</p>
      ) : (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary/50 border-b border-border">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">Email</th>
                  <th className="text-left px-4 py-3 font-medium">Role</th>
                  <th className="text-left px-4 py-3 font-medium">Joined</th>
                  <th className="text-left px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {profiles.map((p) => (
                  <tr key={p.id} className="border-b border-border last:border-0 hover:bg-secondary/20">
                    <td className="px-4 py-3 font-medium">{p.email || "—"}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${getUserRole(p.user_id) === "admin" ? "bg-accent/10 text-accent font-medium" : "bg-secondary text-muted-foreground"}`}>
                        {getUserRole(p.user_id)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{new Date(p.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleAdmin(p.user_id)}
                        className="p-1.5 rounded hover:bg-secondary flex items-center gap-1 text-xs"
                        title={getUserRole(p.user_id) === "admin" ? "Remove admin" : "Make admin"}
                      >
                        <Shield size={16} />
                        {getUserRole(p.user_id) === "admin" ? "Remove Admin" : "Make Admin"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default UserManager;
