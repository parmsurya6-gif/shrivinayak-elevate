import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Shield, Award } from "lucide-react";
import Layout from "@/components/Layout";
import ScrollReveal from "@/components/ScrollReveal";
import AnimatedCounter from "@/components/AnimatedCounter";
import ClientLogoScroller from "@/components/ClientLogoScroller";
import HeroSlider from "@/components/HeroSlider";
import AnimatedText from "@/components/AnimatedText";
import { useCmsPage } from "@/hooks/useCmsPage";

const defaults: Record<string, Record<string, string>> = {
  hero: {
    tagline: "Since 2016",
    title_line1: "Engineering Precision.",
    title_line2: "Delivering Trust.",
    subtitle: "Manufacturer and supplier of precision machined components, welded assemblies & fasteners for global automotive and industrial leaders.",
    cta_1_text: "Explore Capabilities",
    cta_2_text: "Request a Quote",
  },
  stats: {
    stat_1_value: "100", stat_1_suffix: "+", stat_1_label: "Employees",
    stat_2_value: "22000", stat_2_suffix: "", stat_2_label: "Sq.Ft. Facility",
    stat_3_value: "15", stat_3_suffix: "+", stat_3_label: "CNC Machines",
    stat_4_value: "10", stat_4_suffix: "+", stat_4_label: "Years Experience",
  },
  about: {
    tagline: "About Us",
    title: "Trusted by Global Automotive Leaders",
    description: "Shrivinayak Industries is an ISO 9001:2015 certified organization specializing in the manufacture and supply of machined components, welded assemblies, and fasteners. Established in 2016 in Pune, we serve tier-1 suppliers for Ducati, Volkswagen, Tata, Mahindra, JCB, and more.",
    image: "/images/factory-overview.jpg",
    cert_1_label: "ISO 9001:2015", cert_1_desc: "Certified Quality",
    cert_2_label: "VDA 6.3", cert_2_desc: "In Preparation",
    cert_3_label: "IATF 16949", cert_3_desc: "In Preparation",
  },
  capabilities: {
    tagline: "What We Do",
    title: "Manufacturing Excellence",
    cap_1_title: "Machined Components", cap_1_desc: "Precision CNC & VMC machining with tight tolerances", cap_1_image: "/images/cnc-section.jpg",
    cap_2_title: "Welded Assemblies", cap_2_desc: "CO2 welding with certified operators", cap_2_image: "/images/welding.jpg",
    cap_3_title: "Fasteners Supply", cap_3_desc: "Complete fastener solutions for all industries", cap_3_image: "/images/products-1.png",
  },
  clients: { tagline: "Trusted Partners", title: "Our Global Clients" },
  facilities: {
    tagline: "Our Infrastructure", title: "State-of-the-Art Facilities",
    facility_1_image: "/images/cnc-section.jpg", facility_2_image: "/images/vmc-section.jpg",
    facility_3_image: "/images/welding.jpg", facility_4_image: "/images/laser-marking.jpg",
    facility_5_image: "/images/wire-cutting.jpg", facility_6_image: "/images/pipe-bending.jpg",
    facility_7_image: "/images/quality-lab.jpg", facility_8_image: "/images/traub-section.jpg",
  },
  awards: {
    tagline: "Recognition", title: "Awards & Achievements",
    award_1_title: "Best Quality Performance Award", award_1_image: "/images/award-real-1.jpg",
    award_2_title: "Best Quality Trophy", award_2_image: "/images/award-real-2.jpg",
    award_3_title: "Best Supplier Award", award_3_image: "/images/award-real-3.jpg",
    award_4_title: "Best Supplier Trophy", award_4_image: "/images/award-real-4.jpg",
    award_5_title: "Certificate of Appreciation", award_5_image: "/images/award-real-5.jpg",
    award_6_title: "Appreciation Certificate", award_6_image: "/images/award-real-6.jpg",
  },
  cta: {
    title: "Let's Build Something Together",
    description: "Partner with us for precision-engineered components that meet the highest quality standards.",
    image: "/images/cnc-section.jpg",
    cta_1_text: "Get Started", cta_2_text: "Our Capabilities",
  },
};

const Index = () => {
  const { get } = useCmsPage("home", defaults);

  const certifications = [
    { icon: Shield, label: get("about", "cert_1_label"), desc: get("about", "cert_1_desc") },
    { icon: Award, label: get("about", "cert_2_label"), desc: get("about", "cert_2_desc") },
    { icon: Shield, label: get("about", "cert_3_label"), desc: get("about", "cert_3_desc") },
  ];

  const caps = [1, 2, 3].map(i => ({
    title: get("capabilities", `cap_${i}_title`),
    desc: get("capabilities", `cap_${i}_desc`),
    img: get("capabilities", `cap_${i}_image`),
  }));

  const facilityImages = [1, 2, 3, 4, 5, 6, 7, 8].map(i => get("facilities", `facility_${i}_image`));

  const awardImages = [1, 2, 3, 4, 5, 6].map(i => ({
    img: get("awards", `award_${i}_image`),
    title: get("awards", `award_${i}_title`),
  }));

  return (
    <Layout>
      {/* Hero */}
      <section className="relative min-h-[88vh] md:min-h-[94vh] flex items-end md:items-center overflow-hidden">
        <HeroSlider />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-24 md:pb-0 pt-24 md:pt-32">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-4xl">
            <motion.div
              className="inline-flex items-center gap-2.5 mb-5 md:mb-8 rounded-full border border-primary-foreground/25 bg-primary-foreground/5 px-4 py-1.5"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-highlight opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-highlight" />
              </span>
              <span className="text-primary-foreground text-[11px] md:text-xs font-semibold uppercase tracking-[0.25em]">
                {get("hero", "tagline")}
              </span>
            </motion.div>

            <h1 className="text-[2.15rem] leading-[1.05] sm:text-5xl md:text-6xl lg:text-8xl font-display font-extrabold text-primary-foreground tracking-[-0.03em] mb-5 md:mb-8">
              <AnimatedText text={get("hero", "title_line1")} delay={0.4} />
              <br />
              <span className="bg-gradient-to-r from-highlight via-highlight to-primary-foreground bg-clip-text text-transparent">
                <AnimatedText text={get("hero", "title_line2")} delay={0.8} />
              </span>
            </h1>

            <motion.div
              className="flex items-start gap-4 md:gap-6 max-w-2xl mb-8 md:mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
            >
              <span className="hidden md:block mt-2 h-16 w-px bg-highlight/70 shrink-0" />
              <p className="text-base md:text-lg text-primary-foreground/75 leading-relaxed">
                {get("hero", "subtitle")}
              </p>
            </motion.div>

            <motion.div
              className="flex flex-col sm:flex-row gap-3 md:gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.5 }}
            >
              <Link
                to="/capabilities"
                className="group inline-flex items-center justify-center gap-2.5 bg-highlight text-accent-foreground px-7 md:px-9 py-4 rounded-full font-semibold text-sm tracking-wide hover:shadow-[0_16px_40px_-12px_hsl(var(--highlight)/0.7)] hover:-translate-y-0.5 transition-all duration-300"
              >
                {get("hero", "cta_1_text")}
                <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 border border-primary-foreground/35 text-primary-foreground px-7 md:px-9 py-4 rounded-full font-semibold text-sm tracking-wide hover:bg-primary-foreground/10 hover:border-primary-foreground/60 transition-all duration-300"
              >
                {get("hero", "cta_2_text")}
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll cue */}
        <motion.div
          className="pointer-events-none absolute bottom-6 left-1/2 hidden md:flex -translate-x-1/2 flex-col items-center gap-2 z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          <span className="text-[10px] uppercase tracking-[0.3em] text-primary-foreground/50">Scroll</span>
          <motion.span
            className="h-10 w-px bg-gradient-to-b from-highlight to-transparent"
            animate={{ scaleY: [0.3, 1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformOrigin: "top" }}
          />
        </motion.div>
      </section>

      {/* Stats Bar */}
      <section className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-8 md:py-12 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {[1, 2, 3, 4].map(i => (
            <AnimatedCounter key={i} target={parseInt(get("stats", `stat_${i}_value`)) || 0} suffix={get("stats", `stat_${i}_suffix`)} label={get("stats", `stat_${i}_label`)} />
          ))}
        </div>
      </section>

      {/* Company Snapshot */}
      <section className="section-padding bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <ScrollReveal direction="left">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <motion.div className="h-px w-12 bg-accent" initial={{ width: 0 }} whileInView={{ width: 48 }} viewport={{ once: true }} transition={{ duration: 0.8 }} />
                  <span className="text-accent text-sm font-semibold uppercase tracking-widest">{get("about", "tagline")}</span>
                </div>
                <h2 className="section-title mb-6">{get("about", "title")}</h2>
                <p className="text-muted-foreground leading-relaxed mb-8">{get("about", "description")}</p>
                <div className="flex flex-wrap gap-3">
                  {certifications.map((cert, i) => (
                    <motion.div key={cert.label} className="flex items-center gap-2 badge-cert" initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 + i * 0.15, duration: 0.4 }} whileHover={{ scale: 1.1 }}>
                      <cert.icon size={14} />
                      <span>{cert.label}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
            <ScrollReveal direction="right">
              <div className="relative">
                <motion.img src={get("about", "image")} alt="Shrivinayak Factory" className="rounded-lg image-cover h-[300px] md:h-[400px] w-full object-cover" whileHover={{ scale: 1.03 }} transition={{ duration: 0.5 }} />
                <motion.div className="absolute -bottom-4 -left-4 w-24 h-24 rounded-lg bg-accent/20 -z-10" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.5 }} />
                <motion.div className="absolute -top-4 -right-4 w-32 h-32 rounded-lg bg-highlight/10 -z-10" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.7 }} />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Manufacturing Excellence */}
      <section className="section-padding bg-secondary">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-12 md:mb-16">
              <span className="text-accent text-sm font-semibold uppercase tracking-widest">{get("capabilities", "tagline")}</span>
              <h2 className="section-title mt-3">{get("capabilities", "title")}</h2>
            </div>
          </ScrollReveal>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            {caps.map((cap, i) => (
              <ScrollReveal key={cap.title} delay={i * 0.15} direction="scale">
                <motion.div className="card-industrial group" whileHover={{ y: -12, boxShadow: "0 20px 40px -15px hsl(var(--accent) / 0.2)" }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
                  <div className="h-48 md:h-64 overflow-hidden">
                    <motion.img src={cap.img} alt={cap.title} className="image-cover h-full" whileHover={{ scale: 1.15, rotate: 1 }} transition={{ duration: 0.6 }} />
                  </div>
                  <div className="p-4 md:p-6">
                    <h3 className="font-display font-bold text-base md:text-lg mb-2">{cap.title}</h3>
                    <p className="text-muted-foreground text-sm">{cap.desc}</p>
                  </div>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Clients */}
      <section className="section-padding bg-background">
        <div className="max-w-7xl mx-auto text-center">
          <ScrollReveal>
            <span className="text-accent text-sm font-semibold uppercase tracking-widest">{get("clients", "tagline")}</span>
            <h2 className="section-title mt-3 mb-12">{get("clients", "title")}</h2>
          </ScrollReveal>
          <ScrollReveal delay={0.2} direction="fade">
            <ClientLogoScroller />
          </ScrollReveal>
        </div>
      </section>

      {/* Facilities Gallery */}
      <section className="section-padding bg-secondary">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-12">
              <span className="text-accent text-sm font-semibold uppercase tracking-widest">{get("facilities", "tagline")}</span>
              <h2 className="section-title mt-3">{get("facilities", "title")}</h2>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {facilityImages.filter(Boolean).map((img, i) => (
              <ScrollReveal key={i} delay={i * 0.08} direction={i % 2 === 0 ? "up" : "scale"}>
                <motion.div className="relative rounded-lg overflow-hidden group cursor-pointer" whileHover={{ y: -8 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
                  <div className="h-36 md:h-56 overflow-hidden">
                    <motion.img src={img} alt={`Facility ${i + 1}`} className="image-cover h-full" whileHover={{ scale: 1.15, rotate: 1 }} transition={{ duration: 0.6, ease: "easeOut" }} />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                    <span className="text-primary-foreground text-xs font-semibold uppercase tracking-wider">View Details</span>
                  </div>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/facility" className="btn-outline inline-flex items-center gap-2">View Full Tour <ArrowRight size={16} /></Link>
          </div>
        </div>
      </section>

      {/* Awards */}
      <section className="section-padding bg-background">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-12">
              <span className="text-accent text-sm font-semibold uppercase tracking-widest">{get("awards", "tagline")}</span>
              <h2 className="section-title mt-3">{get("awards", "title")}</h2>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {awardImages.filter(a => a.img).map((award, i) => (
              <ScrollReveal key={i} delay={i * 0.1} direction="scale">
                <motion.div className="card-industrial overflow-hidden group cursor-pointer" whileHover={{ y: -8, scale: 1.02 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
                  <div className="h-36 md:h-56 overflow-hidden">
                    <motion.img src={award.img} alt={award.title} className="image-cover h-full" whileHover={{ scale: 1.1 }} transition={{ duration: 0.5 }} />
                  </div>
                  <div className="p-2 md:p-3 text-center">
                    <p className="text-xs md:text-sm font-semibold text-foreground">{award.title}</p>
                  </div>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0">
          <img src={get("cta", "image")} alt="CNC" className="image-cover" />
          <div className="absolute inset-0 overlay-gradient" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto text-center px-4">
          <ScrollReveal direction="scale">
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-display font-extrabold text-primary-foreground mb-4 md:mb-6">{get("cta", "title")}</h2>
            <p className="text-primary-foreground/80 text-base md:text-lg mb-8 md:mb-10">{get("cta", "description")}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                <Link to="/contact" className="bg-highlight text-accent-foreground px-8 md:px-10 py-3 md:py-4 rounded-md font-semibold text-sm hover:opacity-90 transition-opacity inline-block">{get("cta", "cta_1_text")}</Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                <Link to="/capabilities" className="border-2 border-primary-foreground/40 text-primary-foreground px-8 md:px-10 py-3 md:py-4 rounded-md font-semibold text-sm hover:bg-primary-foreground/10 transition-all inline-block">{get("cta", "cta_2_text")}</Link>
              </motion.div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
