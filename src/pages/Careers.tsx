import Layout from "@/components/Layout";
import ScrollReveal from "@/components/ScrollReveal";
import { motion } from "framer-motion";
import { Briefcase, MapPin, Clock, Send, ChevronRight, Upload } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { uploadSiteImage } from "@/hooks/useSiteContent";

interface JobPosting {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
}

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
  const emptyForm = {
    name: "", email: "", phone: "", message: "",
    experience: "", qualification: "", gender: "",
    expected_salary: "", previous_salary: "", previous_company: "", current_designation: "",
  };
  const [formData, setFormData] = useState(emptyForm);
  const [openings, setOpenings] = useState<JobPosting[]>([]);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      const { data } = await supabase.from("job_postings").select("*").eq("is_active", true).order("created_at", { ascending: false });
      setOpenings((data as JobPosting[]) ?? []);
    };
    fetchJobs();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeFile) {
      toast({ title: "Resume required", description: "Please upload your resume (PDF/DOC).", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    const safeName = formData.name.replace(/[^a-z0-9]+/gi, "_").toLowerCase() || "applicant";
    const ext = resumeFile.name.split(".").pop() || "pdf";
    const path = `resumes/${Date.now()}_${safeName}.${ext}`;
    const resumeUrl = await uploadSiteImage(resumeFile, path);
    if (!resumeUrl) {
      toast({ title: "Upload failed", description: "Couldn't upload your resume. Try again.", variant: "destructive" });
      setSubmitting(false);
      return;
    }
    const { error } = await supabase.from("job_applications").insert({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      position: selectedJob!,
      cover_letter: formData.message || null,
      experience: formData.experience,
      qualification: formData.qualification || null,
      gender: formData.gender || null,
      expected_salary: formData.expected_salary,
      previous_salary: formData.previous_salary || null,
      previous_company: formData.previous_company || null,
      current_designation: formData.current_designation || null,
      resume_url: resumeUrl,
    });
    setSubmitting(false);
    if (error) {
      toast({ title: "Error", description: "Failed to submit. Please try again.", variant: "destructive" });
    } else {
      toast({
        title: "Application Submitted!",
        description: `Thank you for applying for ${selectedJob}. We'll get back to you soon.`,
      });
      setFormData(emptyForm);
      setResumeFile(null);
      setSelectedJob(null);
    }
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <img src="/images/company-building.jpg" alt="Career at Shrivinayak" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-primary/70" />
        <div className="relative z-10 text-center text-primary-foreground px-4">
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            Build Your Career With Us
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }} className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
            Join a team that engineers precision and delivers trust every day.
          </motion.p>
        </div>
      </section>

      {/* Why Join Us */}
      <section className="section-padding max-w-7xl mx-auto">
        <ScrollReveal>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4 text-center">Why Shrivinayak Industries?</h2>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">We're expanding from 22,000 to 70,000 sq. ft. — and we need talented people to grow with us.</p>
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
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-10 text-center">Open Positions</h2>
          </ScrollReveal>
          {openings.length === 0 ? (
            <p className="text-center text-muted-foreground">No open positions right now. Check back soon!</p>
          ) : (
            <div className="grid gap-6">
              {openings.map((job, i) => (
                <ScrollReveal key={job.id} delay={i * 0.1}>
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
                      <button onClick={() => setSelectedJob(job.title)} className="btn-primary whitespace-nowrap flex items-center gap-2 self-start">
                        <Send size={16} /> Apply Now
                      </button>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Application Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 p-4" onClick={() => setSelectedJob(null)}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-card rounded-2xl p-6 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-border" onClick={e => e.stopPropagation()}>
            <h3 className="font-display text-2xl font-bold text-foreground mb-2">Apply for {selectedJob}</h3>
            <p className="text-muted-foreground mb-6 text-sm">Fields marked <span className="text-destructive">*</span> are required.</p>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid sm:grid-cols-2 gap-3">
                <input required placeholder="Full Name *" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm focus:ring-2 focus:ring-accent outline-none" />
                <input required type="email" placeholder="Email Address *" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm focus:ring-2 focus:ring-accent outline-none" />
                <input required placeholder="Mobile Number *" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm focus:ring-2 focus:ring-accent outline-none" />
                <input required placeholder="Experience (years) *" value={formData.experience} onChange={e => setFormData({ ...formData, experience: e.target.value })} className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm focus:ring-2 focus:ring-accent outline-none" />
                <input placeholder="Qualification" value={formData.qualification} onChange={e => setFormData({ ...formData, qualification: e.target.value })} className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm focus:ring-2 focus:ring-accent outline-none" />
                <select value={formData.gender} onChange={e => setFormData({ ...formData, gender: e.target.value })} className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm focus:ring-2 focus:ring-accent outline-none">
                  <option value="">Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                <input required placeholder="Expected Salary *" value={formData.expected_salary} onChange={e => setFormData({ ...formData, expected_salary: e.target.value })} className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm focus:ring-2 focus:ring-accent outline-none" />
                <input placeholder="Previous Salary" value={formData.previous_salary} onChange={e => setFormData({ ...formData, previous_salary: e.target.value })} className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm focus:ring-2 focus:ring-accent outline-none" />
                <input placeholder="Previous Company" value={formData.previous_company} onChange={e => setFormData({ ...formData, previous_company: e.target.value })} className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm focus:ring-2 focus:ring-accent outline-none" />
                <input placeholder="Current Designation" value={formData.current_designation} onChange={e => setFormData({ ...formData, current_designation: e.target.value })} className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm focus:ring-2 focus:ring-accent outline-none" />
              </div>
              <textarea required rows={3} placeholder="How are you a good fit for this role? *" value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm focus:ring-2 focus:ring-accent outline-none resize-none" />
              <div>
                <label className="text-sm font-medium mb-1.5 block">Resume <span className="text-destructive">*</span></label>
                <input ref={fileRef} type="file" accept=".pdf,.doc,.docx" onChange={e => setResumeFile(e.target.files?.[0] ?? null)} className="hidden" />
                <button type="button" onClick={() => fileRef.current?.click()} className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg border border-dashed border-border bg-background text-sm hover:bg-secondary transition-colors">
                  <Upload size={16} className="text-accent" />
                  {resumeFile ? resumeFile.name : "Upload Resume (PDF / DOC / DOCX)"}
                </button>
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <button type="button" onClick={() => setSelectedJob(null)} className="px-5 py-2.5 rounded-lg border border-border text-sm hover:bg-secondary transition-colors">Cancel</button>
                <button type="submit" disabled={submitting} className="btn-primary text-sm disabled:opacity-50">{submitting ? "Submitting..." : "Submit Application"}</button>
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
