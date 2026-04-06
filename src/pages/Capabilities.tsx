import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "@/components/Layout";
import ScrollReveal from "@/components/ScrollReveal";
import { X } from "lucide-react";
import { useCmsPage } from "@/hooks/useCmsPage";

const defaultCaps = [
  { title: "CNC Machining", desc: "15 CNC machines for precision turning with tight tolerances for automotive and industrial components.", detail: "Our CNC section houses 15 machines including advanced Traub machines. We handle complex geometries and tight tolerances for tier-1 automotive suppliers.", img: "/images/cnc-section.jpg" },
  { title: "VMC Machining", desc: "7 VMC machines (3-axis & 4-axis) for complex milling operations.", detail: "Our VMC section includes 3 three-axis and 4 four-axis machines, capable of handling complex milling, drilling, and tapping operations with high precision.", img: "/images/vmc-section.jpg" },
  { title: "Laser Marking", desc: "3 fiber laser marking machines for permanent part identification.", detail: "We use 3 fiber laser marking machines for traceability marking, serial numbers, logos, and QR codes on machined components.", img: "/images/laser-marking.jpg" },
  { title: "Welding", desc: "4 CO2 welding machines for robust welded assemblies.", detail: "Our welding section features 4 CO2 welding machines operated by certified welders, producing high-quality welded assemblies for heavy-duty applications.", img: "/images/welding.jpg" },
  { title: "Wire Cutting", desc: "Precision wire EDM cutting for intricate shapes and profiles.", detail: "Cormax wire cutting machines deliver ultra-precise cuts for complex profiles, dies, and tooling components with micron-level accuracy.", img: "/images/wire-cutting.jpg" },
  { title: "Pipe Bending", desc: "3-axis pipe bending for complex tube and pipe assemblies.", detail: "Our pipe bending section includes advanced 3-axis bending machines for automotive exhaust systems, hydraulic lines, and structural components.", img: "/images/pipe-bending.jpg" },
  { title: "Quality Lab", desc: "Fully equipped quality inspection lab with advanced measuring instruments.", detail: "Our quality lab includes Hardness Tester, Trimos Height Gauge, Vision Measuring Machine, 2D Height Gauge, Roughness Tester, and more.", img: "/images/quality-lab.jpg" },
];

const defaults: Record<string, Record<string, string>> = {
  hero: { title: "Our Capabilities", subtitle: "Advanced Manufacturing Solutions", image: "/images/vmc-section.jpg" },
  services: Object.fromEntries(
    defaultCaps.flatMap((c, i) => [
      [`service_${i+1}_title`, c.title],
      [`service_${i+1}_desc`, c.desc],
      [`service_${i+1}_detail`, c.detail],
      [`service_${i+1}_image`, c.img],
    ])
  ),
};

const Capabilities = () => {
  const { get } = useCmsPage("capabilities", defaults);
  const [selected, setSelected] = useState<{ title: string; desc: string; detail: string; img: string } | null>(null);

  const capabilities = defaultCaps.map((_, i) => ({
    title: get("services", `service_${i+1}_title`),
    desc: get("services", `service_${i+1}_desc`),
    detail: get("services", `service_${i+1}_detail`) || get("services", `service_${i+1}_desc`),
    img: get("services", `service_${i+1}_image`),
  }));

  return (
    <Layout>
      <section className="relative h-[40vh] md:h-[50vh] min-h-[300px] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <motion.img src={get("hero", "image")} alt="Capabilities" className="image-cover" initial={{ scale: 1.1 }} animate={{ scale: 1 }} transition={{ duration: 1.5, ease: "easeOut" }} />
          <div className="absolute inset-0 overlay-gradient" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 w-full">
          <motion.div className="flex items-center gap-2 mb-4" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
            <div className="h-px w-12 bg-highlight" />
            <span className="text-highlight text-sm font-semibold uppercase tracking-widest">What We Do</span>
          </motion.div>
          <motion.h1 className="text-3xl md:text-6xl font-display font-extrabold text-primary-foreground" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.5 }}>
            {get("hero", "title")}
          </motion.h1>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {capabilities.map((cap, i) => (
              <ScrollReveal key={i} delay={i * 0.1} direction={i % 3 === 0 ? "left" : i % 3 === 1 ? "up" : "right"}>
                <motion.div className="card-industrial group cursor-pointer" onClick={() => setSelected(cap)} whileHover={{ y: -10, boxShadow: "0 20px 40px -15px hsl(var(--accent) / 0.2)" }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
                  <div className="h-44 md:h-56 overflow-hidden relative">
                    <motion.img src={cap.img} alt={cap.title} className="image-cover h-full" whileHover={{ scale: 1.15, rotate: 1 }} transition={{ duration: 0.6 }} />
                    <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/30 transition-all duration-300 flex items-center justify-center">
                      <span className="text-primary-foreground font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity">Learn More</span>
                    </div>
                  </div>
                  <div className="p-4 md:p-6">
                    <h3 className="font-display font-bold text-base md:text-lg mb-2">{cap.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{cap.desc}</p>
                  </div>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {selected && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/50 backdrop-blur-sm" onClick={() => setSelected(null)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="bg-card rounded-xl max-w-2xl w-full max-h-[90vh] overflow-auto shadow-2xl" onClick={(e) => e.stopPropagation()} initial={{ opacity: 0, scale: 0.9, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 30 }} transition={{ type: "spring", stiffness: 300, damping: 25 }}>
              <div className="relative">
                <img src={selected.img} alt={selected.title} className="w-full h-48 md:h-64 object-cover rounded-t-xl" />
                <button onClick={() => setSelected(null)} className="absolute top-4 right-4 bg-card rounded-full p-2 shadow-lg hover:scale-110 transition-transform"><X size={20} /></button>
              </div>
              <div className="p-6 md:p-8">
                <h3 className="font-display font-bold text-xl md:text-2xl mb-4">{selected.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{selected.detail}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
};

export default Capabilities;
