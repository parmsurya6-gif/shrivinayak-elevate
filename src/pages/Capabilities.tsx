import { useState } from "react";
import Layout from "@/components/Layout";
import ScrollReveal from "@/components/ScrollReveal";
import { X } from "lucide-react";

const capabilities = [
  {
    title: "CNC Machining",
    desc: "15 CNC machines for precision turning with tight tolerances for automotive and industrial components.",
    detail: "Our CNC section houses 15 machines including advanced Traub machines. We handle complex geometries and tight tolerances for tier-1 automotive suppliers.",
    img: "/images/cnc-section.jpg",
  },
  {
    title: "VMC Machining",
    desc: "7 VMC machines (3-axis & 4-axis) for complex milling operations.",
    detail: "Our VMC section includes 3 three-axis and 4 four-axis machines, capable of handling complex milling, drilling, and tapping operations with high precision.",
    img: "/images/vmc-section.jpg",
  },
  {
    title: "Laser Marking",
    desc: "3 fiber laser marking machines for permanent part identification.",
    detail: "We use 3 fiber laser marking machines for traceability marking, serial numbers, logos, and QR codes on machined components.",
    img: "/images/laser-marking.jpg",
  },
  {
    title: "Welding",
    desc: "4 CO2 welding machines for robust welded assemblies.",
    detail: "Our welding section features 4 CO2 welding machines operated by certified welders, producing high-quality welded assemblies for heavy-duty applications.",
    img: "/images/welding.jpg",
  },
  {
    title: "Wire Cutting",
    desc: "Precision wire EDM cutting for intricate shapes and profiles.",
    detail: "Cormax wire cutting machines deliver ultra-precise cuts for complex profiles, dies, and tooling components with micron-level accuracy.",
    img: "/images/wire-cutting.jpg",
  },
  {
    title: "Pipe Bending",
    desc: "3-axis pipe bending for complex tube and pipe assemblies.",
    detail: "Our pipe bending section includes advanced 3-axis bending machines for automotive exhaust systems, hydraulic lines, and structural components.",
    img: "/images/pipe-bending.jpg",
  },
  {
    title: "Quality Lab",
    desc: "Fully equipped quality inspection lab with advanced measuring instruments.",
    detail: "Our quality lab includes Hardness Tester, Trimos Height Gauge, Vision Measuring Machine, 2D Height Gauge, Roughness Tester, and more. We ensure 100% quality gate inspection.",
    img: "/images/quality-lab.jpg",
  },
];

const Capabilities = () => {
  const [selected, setSelected] = useState<typeof capabilities[0] | null>(null);

  return (
    <Layout>
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[350px] flex items-center">
        <div className="absolute inset-0">
          <img src="/images/vmc-section.jpg" alt="Capabilities" className="image-cover" />
          <div className="absolute inset-0 overlay-gradient" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 w-full">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-px w-12 bg-highlight" />
            <span className="text-highlight text-sm font-semibold uppercase tracking-widest">What We Do</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-extrabold text-primary-foreground">Our Capabilities</h1>
        </div>
      </section>

      {/* Grid */}
      <section className="section-padding bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {capabilities.map((cap, i) => (
              <ScrollReveal key={cap.title} delay={i * 0.1}>
                <div className="card-industrial group cursor-pointer" onClick={() => setSelected(cap)}>
                  <div className="h-56 overflow-hidden relative">
                    <img src={cap.img} alt={cap.title} className="image-cover h-full transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/30 transition-all duration-300 flex items-center justify-center">
                      <span className="text-primary-foreground font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity">Learn More</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-display font-bold text-lg mb-2">{cap.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{cap.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/50 backdrop-blur-sm" onClick={() => setSelected(null)}>
          <div className="bg-card rounded-xl max-w-2xl w-full max-h-[90vh] overflow-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="relative">
              <img src={selected.img} alt={selected.title} className="w-full h-64 object-cover rounded-t-xl" />
              <button onClick={() => setSelected(null)} className="absolute top-4 right-4 bg-card rounded-full p-2 shadow-lg">
                <X size={20} />
              </button>
            </div>
            <div className="p-8">
              <h3 className="font-display font-bold text-2xl mb-4">{selected.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{selected.detail}</p>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Capabilities;
