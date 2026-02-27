import Layout from "@/components/Layout";
import ScrollReveal from "@/components/ScrollReveal";
import { Target, Eye, Shield, TrendingUp } from "lucide-react";

const Company = () => {
  return (
    <Layout>
      {/* Hero Banner */}
      <section className="relative h-[50vh] min-h-[350px] flex items-center">
        <div className="absolute inset-0">
          <img src="/images/company-building.jpg" alt="Shrivinayak Industries" className="image-cover" />
          <div className="absolute inset-0 overlay-gradient" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 w-full">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-px w-12 bg-highlight" />
            <span className="text-highlight text-sm font-semibold uppercase tracking-widest">About Us</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-extrabold text-primary-foreground">Our Story</h1>
        </div>
      </section>

      {/* Journey */}
      <section className="section-padding bg-background">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="text-accent text-sm font-semibold uppercase tracking-widest">Our Journey</span>
                <h2 className="section-title mt-3 mb-6">From Vision to Reality</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Established in 2016 as Shrivinayak Industries, we began with a simple vision: to become the most trusted resource in precision machined components. Founded by Mr. Tushar Gaikwad and Mr. Prashant Biradar, the company has grown from a small workshop to a 22,000 sq.ft. facility with over 100 employees.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Today, we serve tier-1 suppliers for global automotive giants including Ducati, Volkswagen, Tata Motors, Mahindra, JCB, Hyundai, Piaggio, John Deere, and Skoda.
                </p>
              </div>
              <img src="/images/factory-overview.jpg" alt="Factory" className="rounded-lg h-[400px] w-full object-cover" />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="section-padding bg-secondary">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <ScrollReveal>
              <div className="bg-card rounded-xl p-8 border border-border h-full">
                <div className="w-14 h-14 rounded-lg bg-accent/10 flex items-center justify-center mb-6">
                  <Eye className="text-accent" size={28} />
                </div>
                <h3 className="font-display font-bold text-2xl mb-4">Vision</h3>
                <p className="text-muted-foreground leading-relaxed">
                  To be the preferred and most trusted resource in machined components and welded assemblies and supply of fasteners precision fabrication Industries.
                </p>
                <img src="/images/vision.jpg" alt="Vision" className="mt-6 rounded-lg w-full h-48 object-cover" />
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.15}>
              <div className="bg-card rounded-xl p-8 border border-border h-full">
                <div className="w-14 h-14 rounded-lg bg-accent/10 flex items-center justify-center mb-6">
                  <Target className="text-accent" size={28} />
                </div>
                <h3 className="font-display font-bold text-2xl mb-4">Mission</h3>
                <p className="text-muted-foreground leading-relaxed">
                  To find the easiest and most economical way of machined components processing to fulfill the customer's requirements in terms of Quality, Delivery, Cost and Lowest lead time in development.
                </p>
                <img src="/images/mission.jpg" alt="Mission" className="mt-6 rounded-lg w-full h-48 object-cover" />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Quality Policy */}
      <section className="section-padding bg-background">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <img src="/images/quality-policy.jpg" alt="Quality Policy" className="rounded-lg h-[400px] w-full object-cover" />
              <div>
                <div className="w-14 h-14 rounded-lg bg-accent/10 flex items-center justify-center mb-6">
                  <Shield className="text-accent" size={28} />
                </div>
                <h2 className="section-title mb-6">Quality Policy</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We are committed to satisfying our valued customers through our Products and Services, Timely Delivery, Quality Products by Enhancing Customer Satisfaction.
                </p>
                <ul className="space-y-3">
                  {[
                    "Implementation of Total Quality Management System",
                    "Complying with Statutory, Regulatory and applicable requirements",
                    "Competence development programs for employees",
                    "Periodic review of organization performance",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-muted-foreground">
                      <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Lean & 5S */}
      <section className="section-padding bg-secondary">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-12">
              <span className="text-accent text-sm font-semibold uppercase tracking-widest">Continuous Improvement</span>
              <h2 className="section-title mt-3">Lean Manufacturing & 5S Programs</h2>
              <p className="section-subtitle mx-auto mt-4">
                Intense 5S trainings from MCCIA — Zoning, SMED, PM, Kaizen, Poka-Yoke, 8D methodology.
              </p>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {["/images/5s-lean-1.jpg", "/images/5s-lean-2.jpg", "/images/5s-lean-3.jpg"].map((img, i) => (
              <ScrollReveal key={i} delay={i * 0.15}>
                <img src={img} alt={`5S Program ${i + 1}`} className="rounded-lg w-full h-64 object-cover" />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Future Expansion */}
      <section className="section-padding bg-background">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="w-14 h-14 rounded-lg bg-accent/10 flex items-center justify-center mb-6">
                  <TrendingUp className="text-accent" size={28} />
                </div>
                <h2 className="section-title mb-6">Future Expansion</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Currently operating from our own 22,000 sq.ft. premises, we are planning a significant expansion to 60,000–70,000 sq.ft. with a new location to meet growing demand.
                </p>
                <div className="flex gap-8 mt-8">
                  <div>
                    <p className="stat-number text-3xl">22,000</p>
                    <p className="text-sm text-muted-foreground mt-1">Current (sq.ft.)</p>
                  </div>
                  <div className="w-px bg-border" />
                  <div>
                    <p className="stat-number text-3xl">70,000</p>
                    <p className="text-sm text-muted-foreground mt-1">Planned (sq.ft.)</p>
                  </div>
                </div>
              </div>
              <img src="/images/expansion-plan.png" alt="Expansion Plan" className="rounded-lg w-full object-contain bg-card p-4 border border-border" />
            </div>
          </ScrollReveal>
        </div>
      </section>
    </Layout>
  );
};

export default Company;
