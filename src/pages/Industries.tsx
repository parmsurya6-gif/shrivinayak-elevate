import { motion } from "framer-motion";
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
    <section className="relative h-[50vh] min-h-[350px] flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <motion.img
          src="/images/industry-auto.jpg"
          alt="Industries"
          className="image-cover"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
        <div className="absolute inset-0 overlay-gradient" />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 w-full">
        <motion.div
          className="flex items-center gap-2 mb-4"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="h-px w-12 bg-highlight" />
          <span className="text-highlight text-sm font-semibold uppercase tracking-widest">Sectors</span>
        </motion.div>
        <motion.h1
          className="text-4xl md:text-6xl font-display font-extrabold text-primary-foreground"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
        >
          Industries We Serve
        </motion.h1>
      </div>
    </section>

    <section className="section-padding bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {industries.map((ind, i) => (
            <ScrollReveal key={ind.title} delay={i * 0.1} direction={i % 2 === 0 ? "left" : "right"}>
              <motion.div
                className="relative h-80 rounded-xl overflow-hidden group card-industrial"
                whileHover={{ y: -10, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <motion.img
                  src={ind.img}
                  alt={ind.title}
                  className="image-cover h-full"
                  whileHover={{ scale: 1.15 }}
                  transition={{ duration: 0.7 }}
                />
                <div className="absolute inset-0 overlay-gradient-bottom" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  {!ind.active && (
                    <motion.span
                      className="inline-block px-3 py-1 text-xs font-semibold bg-highlight/20 text-highlight rounded-full mb-3"
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 }}
                    >
                      Coming Soon
                    </motion.span>
                  )}
                  <h3 className="font-display font-bold text-xl text-primary-foreground mb-1">{ind.title}</h3>
                  <p className="text-primary-foreground/70 text-sm">{ind.desc}</p>
                </div>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  </Layout>
);

export default Industries;
