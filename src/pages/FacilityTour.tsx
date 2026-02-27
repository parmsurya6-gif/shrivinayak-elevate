import Layout from "@/components/Layout";
import ScrollReveal from "@/components/ScrollReveal";

const sections = [
  {
    title: "Machining Area",
    desc: "15 CNC machines and 12 Traub machines for high-volume precision turning.",
    images: ["/images/cnc-section.jpg", "/images/traub-section.jpg"],
  },
  {
    title: "VMC Section",
    desc: "7 VMC machines (3-axis & 4-axis) for complex milling operations.",
    images: ["/images/vmc-section.jpg"],
  },
  {
    title: "Cutting Section",
    desc: "CNC circular saw, bandsaw, and oxy-profile cutting machines.",
    images: ["/images/cutting-machine.jpg", "/images/bandsaw.jpg", "/images/oxy-cutting.jpg"],
  },
  {
    title: "Welding Section",
    desc: "4 CO2 welding machines for robust welded assemblies.",
    images: ["/images/welding.jpg"],
  },
  {
    title: "Wire Cutting & Pipe Bending",
    desc: "Precision wire EDM and 3-axis pipe bending machines.",
    images: ["/images/wire-cutting.jpg", "/images/pipe-bending.jpg"],
  },
  {
    title: "Quality Lab",
    desc: "Fully equipped with Hardness Tester, Trimos Height Gauge, Vision Measuring Machine, and more.",
    images: ["/images/quality-lab.jpg", "/images/quality-lab-2.jpg", "/images/quality-lab-3.jpg"],
  },
  {
    title: "Inspection Area",
    desc: "Final inspection tables with Quality Gate 02 for 100% inspection.",
    images: ["/images/final-inspection.jpg", "/images/quality-lab-4.jpg"],
  },
  {
    title: "Power Backup",
    desc: "250 KVA DG Set ensuring uninterrupted production.",
    images: ["/images/power-backup.png"],
  },
];

const FacilityTour = () => {
  return (
    <Layout>
      <section className="relative h-[50vh] min-h-[350px] flex items-center">
        <div className="absolute inset-0">
          <img src="/images/hero-factory.jpg" alt="Facility" className="image-cover" />
          <div className="absolute inset-0 overlay-gradient" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 w-full">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-px w-12 bg-highlight" />
            <span className="text-highlight text-sm font-semibold uppercase tracking-widest">Virtual Tour</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-extrabold text-primary-foreground">Facility Tour</h1>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="max-w-7xl mx-auto space-y-20">
          {sections.map((sec, i) => (
            <ScrollReveal key={sec.title}>
              <div className={`grid lg:grid-cols-2 gap-10 items-center ${i % 2 === 1 ? "lg:direction-rtl" : ""}`}>
                <div className={i % 2 === 1 ? "lg:order-2" : ""}>
                  <span className="text-accent text-sm font-semibold uppercase tracking-widest">Section {String(i + 1).padStart(2, "0")}</span>
                  <h2 className="font-display font-bold text-2xl md:text-3xl mt-2 mb-4">{sec.title}</h2>
                  <p className="text-muted-foreground leading-relaxed">{sec.desc}</p>
                </div>
                <div className={`grid ${sec.images.length > 1 ? "grid-cols-2" : "grid-cols-1"} gap-4 ${i % 2 === 1 ? "lg:order-1" : ""}`}>
                  {sec.images.map((img, j) => (
                    <div key={j} className={`rounded-lg overflow-hidden ${sec.images.length === 3 && j === 0 ? "col-span-2" : ""}`}>
                      <img src={img} alt={sec.title} className="image-cover h-56 w-full group hover:scale-105 transition-transform duration-500" />
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>
    </Layout>
  );
};

export default FacilityTour;
