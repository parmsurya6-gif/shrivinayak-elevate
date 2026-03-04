import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface RequestQuoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const RequestQuoteDialog = ({ open, onOpenChange }: RequestQuoteDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", company: "", message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email) {
      toast.error("Please fill in name and email.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("inquiries").insert({
      name: form.name,
      email: form.email,
      phone: form.phone || null,
      company: form.company || null,
      message: form.message || null,
    });
    setLoading(false);
    if (error) {
      toast.error("Failed to submit. Please try again.");
    } else {
      toast.success("Quote request submitted successfully!");
      setForm({ name: "", email: "", phone: "", company: "", message: "" });
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Request a Quote</DialogTitle>
          <DialogDescription>Fill in your details and we'll get back to you shortly.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input placeholder="Full Name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <Input type="email" placeholder="Email *" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            <Input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <Input placeholder="Company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
          </div>
          <Textarea placeholder="Tell us about your requirements..." rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Submitting..." : "Submit Request"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RequestQuoteDialog;
