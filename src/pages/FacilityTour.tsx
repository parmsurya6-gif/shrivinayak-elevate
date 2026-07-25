import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import ScrollReveal from "@/components/ScrollReveal";
import { useCmsPage } from "@/hooks/useCmsPage";

const defaultSections: { title: string; desc: string; images: string[] }[] = [
  { title: "VMC", desc: "Vertical Machining Centers (3-axis & 4-axis) for complex milling operations.", images: ["/images/vmc-section.jpg"] },
  { title: "CNC", desc: "15 CNC machines for high-precision turning operations and complex component manufacturing.", images: ["/images/cnc-section.jpg"] },
  { title: "CNC Polyturn Milling Machine", desc: "CNC Polyturn milling machines for high-precision multi-axis machining.", images: ["/images/cnc-section.jpg"] },
  { title: "Wire Cutting Machine", desc: "Precision wire EDM machines for tooling and intricate component profiles.", images: ["/images/wire-cutting.jpg"] },
  { title: "CNC Circular Saw Cutting (up to 80 mm)", desc: "CNC circular saw cutting up to 80 mm for accurate raw material preparation.", images: ["/images/cutting-machine.jpg"] },
  { title: "CNC Bandsaw Cutting Machine upto 300 MM", desc: "CNC bandsaw cutting up to 300 mm for large raw material stock.", images: ["/images/bandsaw.jpg"] },
  { title: "CO₂ Welding Machines (4 units)", desc: "4 CO₂ welding machines for robust welded assemblies.", images: ["/images/welding.jpg"] },
  { title: "Oxy-Profile Cutting Machines", desc: "Dedicated oxy-profile cutting machines for clean and accurate plate cutting.", images: ["/images/oxy-cutting.jpg"] },
  { title: "Pipe Bending & 3-Axis Bending Machine", desc: "3-axis pipe bending machines for accurate and repeatable bent pipe assemblies.", images: ["/images/pipe-bending.jpg"] },
  { title: "Hydraulic Press Machine (30-ton capacity)", desc: "30-ton hydraulic press machine for pressing and forming operations.", images: [""] },
  { title: "CNC Traub Machines", desc: "CNC Traub machines for advanced multi-tool precision turning.", images: ["/images/traub-section.jpg"] },
  { title: "Traub Machines", desc: "12 Traub machines for high-volume precision turning of fasteners and small components.", images: ["/images/traub-section.jpg"] },
  { title: "Drill Cum Tapping Section (7 Nos.)", desc: "7 drill-cum-tapping machines for secondary machining operations.", images: [""] },
  { title: "Milling Machines (5 Nos.)", desc: "5 milling machines for conventional milling operations.", images: [""] },
  { title: "250 KVA DG Set Power Backup", desc: "250 KVA DG set ensuring uninterrupted production.", images: ["/images/power-backup.png"] },
  { title: "180 KVA Solar Power Backup", desc: "180 KVA solar power backup supporting our green energy commitment.", images: [""] },
];

// Support dynamic sections added via the admin CMS beyond the defaults (up to 40 total).
const MAX_SECTIONS = 40;

const defaults: Record<string, Record<string, string>> = {
  hero: { title: "Virtual Factory Tour", subtitle: "Step inside our 22,000+ sq.ft. manufacturing facility", image: "/images/hero-factory.jpg" },
  sections: Object.fromEntries(
    defaultSections.flatMap((s, i) => [
      [`sec_${i+1}_title`, s.title],
      [`sec_${i+1}_desc`, s.desc],
      [`sec_${i+1}_image_1`, s.images[0] || ""],
      [`sec_${i+1}_order`, String(i + 1)],
    ])
  ),
};

const FacilityTour = () => {
  const { get } = useCmsPage("facility", defaults);

  const sections = Array.from({ length: MAX_SECTIONS }, (_, i) => i + 1)
    .map((n) => {
      const def = defaultSections[n - 1];
      const title = get("sections", `sec_${n}_title`) || def?.title || "";
      const desc = get("sections", `sec_${n}_desc`) || def?.desc || "";
      const img = get("sections", `sec_${n}_image_1`) || def?.images[0] || "";
      const orderStr = get("sections", `sec_${n}_order`);
      const order = orderStr ? parseInt(orderStr, 10) : n;
      return { n, title, desc, img, order };
    })
    .filter((s) => s.title || s.img)
    .sort((a, b) => a.order - b.order);

  return (
    <Layout>
      <section className="relative h-[40vh] md:h-[50vh] min-h-[300px] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <motion.img src={get("hero", "image")} alt="Facility" className="image-cover" initial={{ scale: 1.1 }} animate={{ scale: 1 }} transition={{ duration: 1.5, ease: "easeOut" }} />
          <div className="absolute inset-0 overlay-gradient" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 w-full">
          <motion.div className="flex items-center gap-2 mb-4" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
            <div className="h-px w-12 bg-highlight" />
            <span className="text-highlight text-sm font-semibold uppercase tracking-widest">Virtual Tour</span>
          </motion.div>
          <motion.h1 className="text-3xl md:text-6xl font-display font-extrabold text-primary-foreground" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.5 }}>
            {get("hero", "title")}
          </motion.h1>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="max-w-7xl mx-auto space-y-12 md:space-y-20">
          {sections.map((sec, i) => (
            <div key={sec.n} className="grid lg:grid-cols-2 gap-8 lg:gap-10 items-center">
              <ScrollReveal direction={i % 2 === 0 ? "left" : "right"}>
                <div className={i % 2 === 1 ? "lg:order-2" : ""}>
                  <motion.span className="text-accent text-sm font-semibold uppercase tracking-widest inline-block" initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
                    Section {String(i + 1).padStart(2, "0")}
                  </motion.span>
                  <h2 className="font-display font-bold text-xl md:text-3xl mt-2 mb-4">{sec.title}</h2>
                  <p className="text-muted-foreground leading-relaxed">{sec.desc}</p>
                </div>
              </ScrollReveal>
              <ScrollReveal direction={i % 2 === 0 ? "right" : "left"} delay={0.15}>
                <div className={`grid grid-cols-1 gap-3 md:gap-4 ${i % 2 === 1 ? "lg:order-1" : ""}`}>
                  {sec.img && (
                    <motion.div className="rounded-lg overflow-hidden" whileHover={{ y: -6, scale: 1.02 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
                      <motion.img src={sec.img} alt={sec.title} className="image-cover h-40 md:h-56 w-full" whileHover={{ scale: 1.1 }} transition={{ duration: 0.5 }} />
                    </motion.div>
                  )}
                </div>
              </ScrollReveal>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
};

export default FacilityTour;
