import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import ScrollReveal from "@/components/ScrollReveal";
import { useCmsPage } from "@/hooks/useCmsPage";

const defaults: Record<string, Record<string, string>> = {
  hero: { title: "Industries We Serve", subtitle: "Precision Manufacturing for Diverse Sectors", image: "/images/factory-overview.jpg" },
  list: {
    ind_1_title: "Automotive", ind_1_desc: "Precision components for 2-wheeler, 4-wheeler, and commercial vehicle manufacturers", ind_1_image: "/images/cnc-section.jpg",
    ind_2_title: "Construction Equipment", ind_2_desc: "Heavy-duty machined parts for earthmoving and construction machinery", ind_2_image: "/images/welding.jpg",
    ind_3_title: "Industrial Machinery", ind_3_desc: "Custom components for specialized industrial equipment", ind_3_image: "/images/vmc-section.jpg",
  },
};

const Industries = () => {
  const { get } = useCmsPage("industries", defaults);
  const industries = [1, 2, 3].map(i => ({
    title: get("list", `ind_${i}_title`),
    desc: get("list", `ind_${i}_desc`),
    img: get("list", `ind_${i}_image`),
    active: i <= 2,
  }));

  return (
    <Layout>
      <section className="relative h-[40vh] md:h-[50vh] min-h-[300px] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <motion.img src={get("hero", "image")} alt="Industries" className="image-cover" initial={{ scale: 1.1 }} animate={{ scale: 1 }} transition={{ duration: 1.5, ease: "easeOut" }} />
          <div className="absolute inset-0 overlay-gradient" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 w-full">
          <motion.div className="flex items-center gap-2 mb-4" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
            <div className="h-px w-12 bg-highlight" />
            <span className="text-highlight text-sm font-semibold uppercase tracking-widest">Sectors</span>
          </motion.div>
          <motion.h1 className="text-3xl md:text-6xl font-display font-extrabold text-primary-foreground" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.5 }}>
            {get("hero", "title")}
          </motion.h1>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            {industries.map((ind, i) => (
              <ScrollReveal key={i} delay={i * 0.15}>
                <motion.div className="card-industrial group relative overflow-hidden" whileHover={{ y: -8 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
                  <div className="h-48 md:h-64 overflow-hidden">
                    <motion.img src={ind.img} alt={ind.title} className="image-cover h-full" whileHover={{ scale: 1.1 }} transition={{ duration: 0.5 }} />
                    {!ind.active && (
                      <div className="absolute top-3 right-3 bg-highlight text-accent-foreground px-3 py-1 rounded text-xs font-semibold">Coming Soon</div>
                    )}
                  </div>
                  <div className="p-4 md:p-6">
                    <h3 className="font-display font-bold text-base md:text-lg mb-2">{ind.title}</h3>
                    <p className="text-muted-foreground text-sm">{ind.desc}</p>
                  </div>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Industries;
