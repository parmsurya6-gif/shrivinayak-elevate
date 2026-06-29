import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import ScrollReveal from "@/components/ScrollReveal";
import { useCmsPage } from "@/hooks/useCmsPage";

const defaultSections = [
  { title: "CNC Machining Section", desc: "15 CNC machines for high-precision turning operations and complex component manufacturing.", images: ["/images/cnc-section.jpg"] },
  { title: "Traub Machines", desc: "12 Traub machines for high-volume precision turning of fasteners and small components.", images: ["/images/traub-section.jpg"] },
  { title: "VMC Section", desc: "7 VMC machines (3-axis & 4-axis) for complex milling operations.", images: ["/images/vmc-section.jpg"] },
  { title: "Cutting Section", desc: "CNC circular saw and bandsaw machines for accurate raw material cutting.", images: ["/images/cutting-machine.jpg", "/images/bandsaw.jpg"] },
  { title: "Oxy-Profile Cutting Machines", desc: "Dedicated oxy-profile cutting machines for clean and accurate plate cutting.", images: ["/images/oxy-cutting.jpg"] },
  { title: "Welding Section", desc: "4 CO2 welding machines for robust welded assemblies.", images: ["/images/welding.jpg"] },
  { title: "Wire Cutting Section", desc: "Precision wire EDM machines for tooling and intricate component profiles.", images: ["/images/wire-cutting.jpg"] },
  { title: "3-Axis Pipe Bending Machines", desc: "3-axis pipe bending machines for accurate and repeatable bent pipe assemblies.", images: ["/images/pipe-bending.jpg"] },
  { title: "Quality Lab", desc: "Fully equipped with Hardness Tester, Trimos Height Gauge, Vision Measuring Machine, and more.", images: ["/images/quality-lab.jpg", "/images/quality-lab-2.jpg", "/images/quality-lab-3.jpg"] },
  { title: "Inspection Area", desc: "Final inspection tables with Quality Gate 02 for 100% inspection.", images: ["/images/final-inspection.jpg", "/images/quality-lab-4.jpg"] },
  { title: "Power Backup", desc: "250 KVA DG Set ensuring uninterrupted production.", images: ["/images/power-backup.png"] },
];

const defaults: Record<string, Record<string, string>> = {
  hero: { title: "Virtual Factory Tour", subtitle: "Step inside our 22,000+ sq.ft. manufacturing facility", image: "/images/hero-factory.jpg" },
  sections: Object.fromEntries(
    defaultSections.flatMap((s, i) => [
      [`sec_${i+1}_title`, s.title],
      [`sec_${i+1}_desc`, s.desc],
      [`sec_${i+1}_image_1`, s.images[0] || ""],
    ])
  ),
};

const FacilityTour = () => {
  const { get } = useCmsPage("facility", defaults);

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
          {defaultSections.map((sec, i) => (
            <div key={i} className="grid lg:grid-cols-2 gap-8 lg:gap-10 items-center">
              <ScrollReveal direction={i % 2 === 0 ? "left" : "right"}>
                <div className={i % 2 === 1 ? "lg:order-2" : ""}>
                  <motion.span className="text-accent text-sm font-semibold uppercase tracking-widest inline-block" initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
                    Section {String(i + 1).padStart(2, "0")}
                  </motion.span>
                  <h2 className="font-display font-bold text-xl md:text-3xl mt-2 mb-4">{get("sections", `sec_${i+1}_title`) || sec.title}</h2>
                  <p className="text-muted-foreground leading-relaxed">{get("sections", `sec_${i+1}_desc`) || sec.desc}</p>
                </div>
              </ScrollReveal>
              <ScrollReveal direction={i % 2 === 0 ? "right" : "left"} delay={0.15}>
                <div className={`grid ${sec.images.length > 1 ? "grid-cols-2" : "grid-cols-1"} gap-3 md:gap-4 ${i % 2 === 1 ? "lg:order-1" : ""}`}>
                  {sec.images.map((img, j) => (
                    <motion.div key={j} className={`rounded-lg overflow-hidden ${sec.images.length === 3 && j === 0 ? "col-span-2" : ""}`} whileHover={{ y: -6, scale: 1.02 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
                      <motion.img src={img} alt={sec.title} className="image-cover h-40 md:h-56 w-full" whileHover={{ scale: 1.1 }} transition={{ duration: 0.5 }} />
                    </motion.div>
                  ))}
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
