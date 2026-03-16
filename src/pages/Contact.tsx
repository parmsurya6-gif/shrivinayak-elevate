import { useState } from "react";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import ScrollReveal from "@/components/ScrollReveal";
import { Mail, Phone, MapPin, User, Building, Send } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await supabase.from("inquiries").insert({
      name: form.name,
      company: form.company || null,
      email: form.email,
      phone: form.phone || null,
      message: form.message,
    });
    if (error) {
      toast.error("Failed to submit. Please try again.");
    } else {
      toast.success("Your inquiry has been submitted! We'll get back to you soon.");
      setForm({ name: "", company: "", email: "", phone: "", message: "" });
    }
    setSubmitting(false);
  };

  const contacts = [
    { name: "Rohit Bidve", role: "Plant Head", email: "planthead@shrivinayakind.com", phone: "+91 8149159005" },
    { name: "Tushar Gaikwad", role: "Director", email: "tushar@shrivinayakind.com", phone: "+91 9273665000" },
    { name: "Prashant Biradar", role: "Director", email: "prashat@shrivinayakind.com", phone: "+91 9881196066" },
  ];

  return (
    <Layout>
      <section className="relative h-[40vh] min-h-[300px] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <motion.img
            src="/images/hero-factory.jpg"
            alt="Contact"
            className="image-cover"
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
          <div className="absolute inset-0 overlay-gradient" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 w-full">
          <motion.div
            className="flex items-center gap-2 mb-4"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="h-px w-12 bg-highlight" />
            <span className="text-highlight text-sm font-semibold uppercase tracking-widest">Get in Touch</span>
          </motion.div>
          <motion.h1
            className="text-4xl md:text-6xl font-display font-extrabold text-primary-foreground"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
          >
            Contact & RFQ
          </motion.h1>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Left - Contact Details */}
            <ScrollReveal direction="left">
              <div>
                <h2 className="font-display font-bold text-2xl mb-6">Contact Information</h2>
                <div className="space-y-6 mb-10">
                  <motion.div
                    className="flex items-start gap-4"
                    whileHover={{ x: 6 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <motion.div
                      className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0"
                      whileHover={{ rotate: 10, scale: 1.1 }}
                    >
                      <MapPin className="text-accent" size={22} />
                    </motion.div>
                    <div>
                      <p className="font-semibold mb-1">Mailing Address</p>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        GAT NO. 679/2/2, Plot No. 21-24,<br />
                        Chakan-Alandi Road, Opposite Hendrickson WC,<br />
                        Alandi Phata, Kuruli, Chakan,<br />
                        Pune, Maharashtra 411062, India
                      </p>
                    </div>
                  </motion.div>
                </div>

                <h3 className="font-display font-bold text-lg mb-4">Key Contacts</h3>
                <div className="space-y-4">
                  {contacts.map((c, i) => (
                    <motion.div
                      key={c.name}
                      className="bg-card rounded-lg p-5 border border-border"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 + i * 0.1 }}
                      whileHover={{ x: 6, boxShadow: "0 10px 30px -10px hsl(var(--accent) / 0.15)" }}
                    >
                      <p className="font-semibold">{c.name} <span className="text-muted-foreground font-normal text-sm">— {c.role}</span></p>
                      <div className="flex flex-col gap-1 mt-2">
                        <a href={`mailto:${c.email}`} className="flex items-center gap-2 text-sm text-accent hover:underline">
                          <Mail size={14} /> {c.email}
                        </a>
                        <a href={`tel:${c.phone}`} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Phone size={14} /> {c.phone}
                        </a>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-8">
                  <p className="text-sm text-muted-foreground">
                    Website: <a href="https://www.shrivinayakind.com" className="text-accent hover:underline" target="_blank" rel="noreferrer">www.shrivinayakind.com</a>
                  </p>
                </div>
              </div>
            </ScrollReveal>

            {/* Right - RFQ Form */}
            <ScrollReveal direction="right">
              <motion.div
                className="bg-card rounded-xl p-8 border border-border shadow-sm"
                whileHover={{ boxShadow: "0 20px 40px -15px hsl(var(--accent) / 0.1)" }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="font-display font-bold text-2xl mb-2">Request for Quote</h2>
                <p className="text-muted-foreground text-sm mb-8">Fill in the details and our team will get back to you within 24 hours.</p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">Name *</label>
                      <div className="relative">
                        <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input
                          required
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
                          placeholder="Your name"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">Company</label>
                      <div className="relative">
                        <Building size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input
                          value={form.company}
                          onChange={(e) => setForm({ ...form, company: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
                          placeholder="Company name"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">Email *</label>
                      <div className="relative">
                        <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input
                          required
                          type="email"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">Phone</label>
                      <div className="relative">
                        <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input
                          value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
                          placeholder="+91 XXXXXXXXXX"
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Message *</label>
                    <textarea
                      required
                      rows={5}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none transition-shadow"
                      placeholder="Describe your requirements, part details, quantities..."
                    />
                  </div>
                  <motion.button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Send size={16} />
                    {submitting ? "Submitting..." : "Submit Inquiry"}
                  </motion.button>
                </form>
              </motion.div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
