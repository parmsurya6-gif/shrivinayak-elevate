import Layout from "@/components/Layout";
import ScrollReveal from "@/components/ScrollReveal";
import { motion } from "framer-motion";
import { Briefcase, MapPin, Clock, Send, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const openings = [
  {
    title: "CNC Machine Operator",
    department: "Production",
    location: "Chakan, Pune",
    type: "Full-time",
    description:
      "Operate and maintain CNC turning and milling machines. Minimum 2 years of experience with precision machined components required.",
  },
  {
    title: "Quality Inspector",
    department: "Quality Assurance",
    location: "Chakan, Pune",
    type: "Full-time",
    description:
      "Perform dimensional inspection using CMM, profile projector, and other measuring instruments. Knowledge of IATF 16949 standards preferred.",
  },
  {
    title: "Welding Technician",
    department: "Production",
    location: "Chakan, Pune",
    type: "Full-time",
    description:
      "MIG/TIG welding of assemblies and sub-assemblies for automotive and industrial clients. Minimum 3 years of experience.",
  },
  {
    title: "Production Engineer",
    department: "Engineering",
    location: "Chakan, Pune",
    type: "Full-time",
    description:
      "Plan and optimize manufacturing processes, ensure on-time delivery, and drive continuous improvement initiatives.",
  },
];

const benefits = [
  "Competitive salary & performance bonuses",
  "Skill development & training programs",
  "Safe & modern work environment",
  "Growth opportunities in a rapidly expanding company",
  "Health & wellness support",
  "5S & Lean culture with employee involvement",
];

const Careers = () => {
  const { toast } = useToast();
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from("job_applications").insert({
      name: formData.name,
      email: formData.email,
      phone: formData.phone || null,
      position: selectedJob!,
      cover_letter: formData.message || null,
    });
    if (error) {
      toast({ title: "Error", description: "Failed to submit. Please try again.", variant: "destructive" });
    } else {
      toast({
        title: "Application Submitted!",
        description: `Thank you for applying for ${selectedJob}. We'll review your application and get back to you soon.`,
      });
      setFormData({ name: "", email: "", phone: "", message: "" });
      setSelectedJob(null);
    }
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1600&q=80"
          alt="Career at Shrivinayak"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-primary/70" />
        <div className="relative z-10 text-center text-primary-foreground px-4">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-4"
          >
            Build Your Career With Us
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto"
          >
            Join a team that engineers precision and delivers trust every day.
          </motion.p>
        </div>
      </section>

      {/* Why Join Us */}
      <section className="section-padding max-w-7xl mx-auto">
        <ScrollReveal>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4 text-center">
            Why Shrivinayak Industries?
          </h2>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">
            We're expanding from 22,000 to 70,000 sq. ft. — and we need talented people to grow with us.
          </p>
        </ScrollReveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((b, i) => (
            <ScrollReveal key={i} delay={i * 0.1}>
              <div className="flex items-start gap-3 p-5 rounded-xl bg-secondary/50 border border-border">
                <ChevronRight size={20} className="text-accent mt-0.5 flex-shrink-0" />
                <p className="text-foreground font-medium">{b}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Open Positions */}
      <section className="section-padding bg-secondary/30">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-10 text-center">
              Open Positions
            </h2>
          </ScrollReveal>
          <div className="grid gap-6">
            {openings.map((job, i) => (
              <ScrollReveal key={i} delay={i * 0.1}>
                <div className="bg-card rounded-xl border border-border p-6 md:p-8 hover:shadow-lg transition-shadow">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h3 className="font-display text-xl font-bold text-foreground mb-2">{job.title}</h3>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
                        <span className="flex items-center gap-1"><Briefcase size={14} /> {job.department}</span>
                        <span className="flex items-center gap-1"><MapPin size={14} /> {job.location}</span>
                        <span className="flex items-center gap-1"><Clock size={14} /> {job.type}</span>
                      </div>
                      <p className="text-muted-foreground">{job.description}</p>
                    </div>
                    <button
                      onClick={() => setSelectedJob(job.title)}
                      className="btn-primary whitespace-nowrap flex items-center gap-2 self-start"
                    >
                      <Send size={16} /> Apply Now
                    </button>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Application Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 p-4" onClick={() => setSelectedJob(null)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card rounded-2xl p-8 max-w-lg w-full shadow-2xl border border-border"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-display text-2xl font-bold text-foreground mb-2">Apply for {selectedJob}</h3>
            <p className="text-muted-foreground mb-6">Fill out the form below and we'll get in touch.</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                required
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-accent outline-none"
              />
              <input
                required
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-accent outline-none"
              />
              <input
                placeholder="Phone Number"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-accent outline-none"
              />
              <textarea
                rows={3}
                placeholder="Why are you a good fit?"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-accent outline-none resize-none"
              />
              <div className="flex gap-3 justify-end">
                <button type="button" onClick={() => setSelectedJob(null)} className="px-6 py-3 rounded-lg border border-border text-foreground hover:bg-secondary transition-colors">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">Submit Application</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* General Contact */}
      <section className="section-padding max-w-7xl mx-auto text-center">
        <ScrollReveal>
          <h2 className="font-display text-3xl font-bold text-foreground mb-4">Don't See Your Role?</h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Send your resume to <a href="mailto:svipune.5000@gmail.com" className="text-accent font-semibold hover:underline">svipune.5000@gmail.com</a> and we'll keep you in mind for future openings.
          </p>
        </ScrollReveal>
      </section>
    </Layout>
  );
};

export default Careers;
