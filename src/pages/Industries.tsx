import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import ScrollReveal from "@/components/ScrollReveal";

const industries = [
  { title: "Automotive", desc: "Components for Ducati, Volkswagen, Tata, Mahindra & more", img: "/images/industry-auto.jpg", active: true },
  { title: "Agriculture", desc: "Precision parts for agricultural machinery and equipment", img: "/images/industry-agri.jpg", active: true },
  { title: "Industrial Equipment", desc: "Heavy-duty components for industrial machines", img: "/images/industry-industrial.jpg", active: true },
  { title: "Civil Machinery", desc: "Components for construction and civil engineering equipment", img: "/images/cnc-section.jpg", active: true },
  { title: "Hospitality", desc: "Expanding into hospitality sector components", img: "/images/industry-hospitality.jpg", active: false },
  { title: "Storage", desc: "Future plans for storage solutions manufacturing", img: "/images/products-1.png", active: false },
  { title: "Lighting", desc: "Planned expansion into lighting industry components", img: "/images/industry-lighting.jpg", active: false },
];

const Industries = () => (
  <Layout>
    <section className="relative h-[50vh] min-h-[350px] flex items-center">
      <div className="absolute inset-0">
        <img src="/images/industry-auto.jpg" alt="Industries" className="image-cover" />
        <div className="absolute inset-0 overlay-gradient" />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 w-full">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-px w-12 bg-highlight" />
          <span className="text-highlight text-sm font-semibold uppercase tracking-widest">Sectors</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-display font-extrabold text-primary-foreground">Industries We Serve</h1>
      </div>
    </section>

    <section className="section-padding bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {industries.map((ind, i) => (
            <ScrollReveal key={ind.title} delay={i * 0.1}>
              <div className="relative h-80 rounded-xl overflow-hidden group card-industrial">
                <img src={ind.img} alt={ind.title} className="image-cover h-full transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 overlay-gradient-bottom" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  {!ind.active && (
                    <span className="inline-block px-3 py-1 text-xs font-semibold bg-highlight/20 text-highlight rounded-full mb-3">Coming Soon</span>
                  )}
                  <h3 className="font-display font-bold text-xl text-primary-foreground mb-1">{ind.title}</h3>
                  <p className="text-primary-foreground/70 text-sm">{ind.desc}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  </Layout>
);

export default Industries;
