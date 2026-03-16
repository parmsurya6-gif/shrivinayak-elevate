import Layout from "@/components/Layout";
import ScrollReveal from "@/components/ScrollReveal";
import ClientLogoScroller from "@/components/ClientLogoScroller";

const awards = [
  { img: "/images/award-real-1.jpg", title: "Best Quality Performance Award" },
  { img: "/images/award-real-2.jpg", title: "Best Quality Trophy" },
  { img: "/images/award-real-3.jpg", title: "Best Supplier Award" },
  { img: "/images/award-real-4.jpg", title: "Best Supplier Trophy" },
  { img: "/images/award-real-5.jpg", title: "Certificate of Appreciation" },
  { img: "/images/award-real-6.jpg", title: "Appreciation Certificate" },
];

const Clients = () => (
  <Layout>
    <section className="relative h-[50vh] min-h-[350px] flex items-center">
      <div className="absolute inset-0">
        <img src="/images/award-1.jpg" alt="Clients" className="image-cover" />
        <div className="absolute inset-0 overlay-gradient" />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 w-full">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-px w-12 bg-highlight" />
          <span className="text-highlight text-sm font-semibold uppercase tracking-widest">Trust & Recognition</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-display font-extrabold text-primary-foreground">Clients & Certifications</h1>
      </div>
    </section>

    {/* Certifications */}
    <section className="section-padding bg-background">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-12">
            <span className="text-accent text-sm font-semibold uppercase tracking-widest">Quality Standards</span>
            <h2 className="section-title mt-3">Certifications</h2>
          </div>
        </ScrollReveal>
        <ScrollReveal delay={0.2}>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "ISO 9001:2015", desc: "Certified Quality Management System ensuring consistent product quality." },
              { title: "VDA 6.3", desc: "Currently preparing for VDA 6.3 certification for process audits." },
              { title: "IATF 16949:2016", desc: "Preparing for IATF 16949 automotive quality management certification." },
            ].map((cert) => (
              <div key={cert.title} className="bg-card rounded-xl p-8 border border-border text-center">
                <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                  <img src="/images/logo-badge.png" alt="Certification" className="h-10 w-auto" />
                </div>
                <h3 className="font-display font-bold text-xl mb-2">{cert.title}</h3>
                <p className="text-muted-foreground text-sm">{cert.desc}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>

    {/* Awards */}
    <section className="section-padding bg-secondary">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-12">
            <span className="text-accent text-sm font-semibold uppercase tracking-widest">Recognition</span>
            <h2 className="section-title mt-3">Awards & Achievements</h2>
          </div>
        </ScrollReveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {awards.map((award, i) => (
            <ScrollReveal key={i} delay={i * 0.1}>
              <div className="card-industrial">
                <img src={award.img} alt={award.title} className="w-full h-64 object-cover" />
                <div className="p-4">
                  <p className="font-display font-semibold text-sm">{award.title}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>

    {/* Client Logos */}
    <section className="section-padding bg-background">
      <div className="max-w-7xl mx-auto text-center">
        <ScrollReveal>
          <span className="text-accent text-sm font-semibold uppercase tracking-widest">End Customers Served (Tier-1)</span>
          <h2 className="section-title mt-3 mb-12">Our Global Clients</h2>
        </ScrollReveal>
        <ScrollReveal delay={0.2}>
          <ClientLogoScroller />
        </ScrollReveal>
      </div>
    </section>
  </Layout>
);

export default Clients;
