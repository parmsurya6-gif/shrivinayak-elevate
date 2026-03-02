import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Shield, Award, Factory, Users } from "lucide-react";
import Layout from "@/components/Layout";
import ScrollReveal from "@/components/ScrollReveal";
import AnimatedCounter from "@/components/AnimatedCounter";
import ClientLogoScroller from "@/components/ClientLogoScroller";

const certifications = [
  { icon: Shield, label: "ISO 9001:2015", desc: "Certified Quality" },
  { icon: Award, label: "VDA 6.3", desc: "In Preparation" },
  { icon: Shield, label: "IATF 16949", desc: "In Preparation" },
];

const capabilities = [
  { title: "Machined Components", desc: "Precision CNC & VMC machining with tight tolerances", img: "/images/cnc-section.jpg" },
  { title: "Welded Assemblies", desc: "CO2 welding with certified operators", img: "/images/welding.jpg" },
  { title: "Fasteners Supply", desc: "Complete fastener solutions for all industries", img: "/images/products-1.png" },
];

const facilityImages = [
  "/images/cnc-section.jpg",
  "/images/vmc-section.jpg",
  "/images/welding.jpg",
  "/images/laser-marking.jpg",
  "/images/wire-cutting.jpg",
  "/images/pipe-bending.jpg",
  "/images/quality-lab.jpg",
  "/images/traub-section.jpg",
];

const Index = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative h-[90vh] min-h-[600px] flex items-center">
        <div className="absolute inset-0">
          <img src="/images/hero-factory.jpg" alt="Shrivinayak Industries Factory" className="image-cover" />
          <div className="absolute inset-0 overlay-gradient" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <div className="flex items-center gap-2 mb-6">
              <div className="h-px w-12 bg-highlight" />
              <span className="text-highlight text-sm font-semibold uppercase tracking-widest">Since 2016</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-display font-extrabold text-primary-foreground leading-tight mb-6">
              Engineering Precision.
              <br />
              <span className="text-highlight">Delivering Trust.</span>
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/80 mb-10 max-w-xl">
              Manufacturer and supplier of precision machined components, welded assemblies & fasteners for global automotive and industrial leaders.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/capabilities" className="inline-flex items-center gap-2 bg-highlight text-accent-foreground px-8 py-4 rounded-md font-semibold text-sm hover:opacity-90 transition-opacity">
                Explore Capabilities <ArrowRight size={18} />
              </Link>
              <Link to="/contact" className="inline-flex items-center gap-2 border-2 border-primary-foreground/40 text-primary-foreground px-8 py-4 rounded-md font-semibold text-sm hover:bg-primary-foreground/10 transition-all">
                Request a Quote
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          <AnimatedCounter target={100} suffix="+" label="Employees" />
          <AnimatedCounter target={22000} suffix="" label="Sq.Ft. Facility" />
          <AnimatedCounter target={15} suffix="+" label="CNC Machines" />
          <AnimatedCounter target={8} suffix="+" label="Years Experience" />
        </div>
      </section>

      {/* Company Snapshot */}
      <section className="section-padding bg-background">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-px w-12 bg-accent" />
                  <span className="text-accent text-sm font-semibold uppercase tracking-widest">About Us</span>
                </div>
                <h2 className="section-title mb-6">
                  Trusted by Global <br />Automotive Leaders
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-8">
                  Shrivinayak Industries is an ISO 9001:2015 certified organization specializing in the manufacture and supply of machined components, welded assemblies, and fasteners. Established in 2016 in Pune, we serve tier-1 suppliers for Ducati, Volkswagen, Tata, Mahindra, JCB, and more.
                </p>
                <div className="flex flex-wrap gap-3">
                  {certifications.map((cert) => (
                    <div key={cert.label} className="flex items-center gap-2 badge-cert">
                      <cert.icon size={14} />
                      <span>{cert.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative">
                <img src="/images/factory-overview.jpg" alt="Shrivinayak Factory" className="rounded-lg image-cover h-[400px] w-full object-cover" />
                <div className="absolute -bottom-6 -left-6 bg-card p-4 rounded-lg shadow-lg border border-border hidden md:block">
                  <img src="/images/logo-badge.png" alt="ISO Certified" className="h-20 w-auto" />
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Manufacturing Excellence */}
      <section className="section-padding bg-secondary">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <span className="text-accent text-sm font-semibold uppercase tracking-widest">What We Do</span>
              <h2 className="section-title mt-3">Manufacturing Excellence</h2>
            </div>
          </ScrollReveal>
          <div className="grid md:grid-cols-3 gap-8">
            {capabilities.map((cap, i) => (
              <ScrollReveal key={cap.title} delay={i * 0.15}>
                <div className="card-industrial group">
                  <div className="h-64 overflow-hidden">
                    <img
                      src={cap.img}
                      alt={cap.title}
                      className="image-cover h-full transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-display font-bold text-lg mb-2">{cap.title}</h3>
                    <p className="text-muted-foreground text-sm">{cap.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Clients */}
      <section className="section-padding bg-background">
        <div className="max-w-7xl mx-auto text-center">
          <ScrollReveal>
            <span className="text-accent text-sm font-semibold uppercase tracking-widest">Trusted Partners</span>
            <h2 className="section-title mt-3 mb-12">Our Global Clients</h2>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <ClientLogoScroller />
          </ScrollReveal>
        </div>
      </section>

      {/* Facilities Gallery */}
      <section className="section-padding bg-secondary">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-12">
              <span className="text-accent text-sm font-semibold uppercase tracking-widest">Our Infrastructure</span>
              <h2 className="section-title mt-3">State-of-the-Art Facilities</h2>
            </div>
          </ScrollReveal>
          <div className="overflow-x-auto pb-4">
            <div className="flex gap-4" style={{ minWidth: "max-content" }}>
              {facilityImages.map((img, i) => (
                <ScrollReveal key={i} delay={i * 0.1}>
                  <div className="w-72 h-48 rounded-lg overflow-hidden flex-shrink-0 group">
                    <img src={img} alt={`Facility ${i + 1}`} className="image-cover h-full transition-transform duration-500 group-hover:scale-110" />
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
          <div className="text-center mt-8">
            <Link to="/facility" className="btn-outline inline-flex items-center gap-2">
              View Full Tour <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Awards */}
      <section className="section-padding bg-background">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-12">
              <span className="text-accent text-sm font-semibold uppercase tracking-widest">Recognition</span>
              <h2 className="section-title mt-3">Awards & Achievements</h2>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {["/images/award-1.jpg", "/images/award-2.jpg", "/images/award-3.jpg", "/images/award-4.jpg"].map((img, i) => (
              <ScrollReveal key={i} delay={i * 0.1}>
                <div className="card-industrial overflow-hidden">
                  <img src={img} alt={`Award ${i + 1}`} className="image-cover h-48 md:h-56" />
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24">
        <div className="absolute inset-0">
          <img src="/images/cnc-section.jpg" alt="CNC" className="image-cover" />
          <div className="absolute inset-0 overlay-gradient" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto text-center px-4">
          <ScrollReveal>
            <h2 className="text-3xl md:text-5xl font-display font-extrabold text-primary-foreground mb-6">
              Let's Build Something Together
            </h2>
            <p className="text-primary-foreground/80 text-lg mb-10">
              Partner with us for precision-engineered components that meet the highest quality standards.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact" className="bg-highlight text-accent-foreground px-10 py-4 rounded-md font-semibold text-sm hover:opacity-90 transition-opacity">
                Get Started
              </Link>
              <Link to="/capabilities" className="border-2 border-primary-foreground/40 text-primary-foreground px-10 py-4 rounded-md font-semibold text-sm hover:bg-primary-foreground/10 transition-all">
                Our Capabilities
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
