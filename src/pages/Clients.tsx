import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import ScrollReveal from "@/components/ScrollReveal";
import ClientLogoScroller from "@/components/ClientLogoScroller";
import { useCmsPage } from "@/hooks/useCmsPage";

const defaults: Record<string, Record<string, string>> = {
  hero: { title: "Clients & Certifications", image: "/images/award-real-1.jpg" },
  certifications: {
    section_title: "Certifications",
    section_tagline: "Quality Standards",
    cert_1_title: "ISO 9001:2015", cert_1_desc: "Certified Quality Management System ensuring consistent product quality.", cert_1_image: "/images/logo-badge.png",
    cert_2_title: "VDA 6.3", cert_2_desc: "Currently preparing for VDA 6.3 certification for process audits.", cert_2_image: "/images/logo-badge.png",
    cert_3_title: "IATF 16949:2016", cert_3_desc: "Preparing for IATF 16949 automotive quality management certification.", cert_3_image: "/images/logo-badge.png",
    cert_4_title: "Additional Certification", cert_4_desc: "Add details about this certification in the admin panel.", cert_4_image: "/images/logo-badge.png",
  },
  awards: {
    award_1_title: "Best Quality Performance Award", award_1_image: "/images/award-real-1.jpg",
    award_2_title: "Best Quality Trophy", award_2_image: "/images/award-real-2.jpg",
    award_3_title: "Best Supplier Award", award_3_image: "/images/award-real-3.jpg",
    award_4_title: "Best Supplier Trophy", award_4_image: "/images/award-real-4.jpg",
  },
};

const Clients = () => {
  const { get } = useCmsPage("clients", defaults);
  const awards = [1, 2, 3, 4].map(i => ({
    title: get("awards", `award_${i}_title`),
    img: get("awards", `award_${i}_image`),
  }));
  const certs = [1, 2, 3, 4].map(i => ({
    title: get("certifications", `cert_${i}_title`),
    desc: get("certifications", `cert_${i}_desc`),
    img: get("certifications", `cert_${i}_image`),
  })).filter(c => c.title);

  return (
    <Layout>
      <section className="relative h-[40vh] md:h-[50vh] min-h-[300px] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <motion.img src={get("hero", "image")} alt="Clients" className="image-cover" initial={{ scale: 1.1 }} animate={{ scale: 1 }} transition={{ duration: 1.5, ease: "easeOut" }} />
          <div className="absolute inset-0 overlay-gradient" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 w-full">
          <motion.div className="flex items-center gap-2 mb-4" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
            <div className="h-px w-12 bg-highlight" />
            <span className="text-highlight text-sm font-semibold uppercase tracking-widest">Trust & Recognition</span>
          </motion.div>
          <motion.h1 className="text-3xl md:text-6xl font-display font-extrabold text-primary-foreground" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.5 }}>
            {get("hero", "title")}
          </motion.h1>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-12">
              <span className="text-accent text-sm font-semibold uppercase tracking-widest">{get("certifications", "section_tagline")}</span>
              <h2 className="section-title mt-3">{get("certifications", "section_title")}</h2>
            </div>
          </ScrollReveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {certs.map((cert, i) => (
              <ScrollReveal key={cert.title} delay={i * 0.15} direction="scale">
                <motion.div className="bg-card rounded-xl p-6 md:p-8 border border-border text-center" whileHover={{ y: -8, boxShadow: "0 20px 40px -15px hsl(var(--accent) / 0.15)" }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
                  <motion.div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4" whileHover={{ rotate: 10, scale: 1.1 }}>
                    <img src={cert.img} alt={cert.title} className="h-10 w-auto object-contain" />
                  </motion.div>
                  <h3 className="font-display font-bold text-lg md:text-xl mb-2">{cert.title}</h3>
                  <p className="text-muted-foreground text-sm">{cert.desc}</p>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-secondary">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-12">
              <span className="text-accent text-sm font-semibold uppercase tracking-widest">Recognition</span>
              <h2 className="section-title mt-3">Awards & Achievements</h2>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {awards.filter(a => a.img).map((award, i) => (
              <ScrollReveal key={i} delay={i * 0.1} direction="scale">
                <motion.div className="card-industrial" whileHover={{ y: -10, scale: 1.02, boxShadow: "0 20px 40px -15px hsl(var(--accent) / 0.2)" }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
                  <div className="overflow-hidden">
                    <motion.img src={award.img} alt={award.title} className="w-full h-40 md:h-64 object-cover" whileHover={{ scale: 1.1 }} transition={{ duration: 0.5 }} />
                  </div>
                  <div className="p-3 md:p-4">
                    <p className="font-display font-semibold text-xs md:text-sm">{award.title}</p>
                  </div>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="max-w-7xl mx-auto text-center">
          <ScrollReveal>
            <span className="text-accent text-sm font-semibold uppercase tracking-widest">End Customers Served (Tier-1)</span>
            <h2 className="section-title mt-3 mb-12">Our Global Clients</h2>
          </ScrollReveal>
          <ScrollReveal delay={0.2} direction="fade">
            <ClientLogoScroller />
          </ScrollReveal>
        </div>
      </section>
    </Layout>
  );
};

export default Clients;
