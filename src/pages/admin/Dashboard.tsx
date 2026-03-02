import { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Inbox, Briefcase, FileText, Users } from "lucide-react";

const Dashboard = () => {
  const [stats, setStats] = useState({ inquiries: 0, applications: 0, newInquiries: 0, newApplications: 0 });

  useEffect(() => {
    const load = async () => {
      const [inq, apps, newInq, newApps] = await Promise.all([
        supabase.from("inquiries").select("id", { count: "exact", head: true }),
        supabase.from("job_applications").select("id", { count: "exact", head: true }),
        supabase.from("inquiries").select("id", { count: "exact", head: true }).eq("status", "new"),
        supabase.from("job_applications").select("id", { count: "exact", head: true }).eq("status", "new"),
      ]);
      setStats({
        inquiries: inq.count ?? 0,
        applications: apps.count ?? 0,
        newInquiries: newInq.count ?? 0,
        newApplications: newApps.count ?? 0,
      });
    };
    load();
  }, []);

  const cards = [
    { label: "Total Inquiries", value: stats.inquiries, sub: `${stats.newInquiries} new`, icon: Inbox, color: "bg-blue-500/10 text-blue-600" },
    { label: "Job Applications", value: stats.applications, sub: `${stats.newApplications} new`, icon: Briefcase, color: "bg-green-500/10 text-green-600" },
  ];

  return (
    <AdminLayout>
      <h1 className="font-display font-bold text-2xl mb-6">Dashboard</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {cards.map((c) => (
          <div key={c.label} className="bg-card rounded-xl p-6 border border-border">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-muted-foreground">{c.label}</span>
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${c.color}`}>
                <c.icon size={20} />
              </div>
            </div>
            <p className="text-3xl font-bold">{c.value}</p>
            <p className="text-sm text-muted-foreground mt-1">{c.sub}</p>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
