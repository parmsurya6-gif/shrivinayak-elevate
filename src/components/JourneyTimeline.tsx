import { motion } from "framer-motion";
import { useCmsPage } from "@/hooks/useCmsPage";

const MAX = 40;

const defaults: Record<string, Record<string, string>> = {
  journey: {
    tagline: "Our Journey",
    title: "Milestones That Built Us",
    ms_1_year: "2016", ms_1_title: "Company Founded", ms_1_desc: "Shrivinayak Industries established in Chakan, Pune.",
    ms_2_year: "2018", ms_2_title: "CNC Expansion", ms_2_desc: "First CNC and VMC machining lines commissioned.",
    ms_3_year: "2021", ms_3_title: "ISO 9001:2015", ms_3_desc: "Certified quality management system implemented.",
    ms_4_year: "2024", ms_4_title: "22,000+ Sq.Ft. Facility", ms_4_desc: "Fully integrated manufacturing plant with 100+ employees.",
  },
};

const JourneyTimeline = () => {
  const { get } = useCmsPage("home", defaults);

  const milestones = Array.from({ length: MAX }, (_, i) => i + 1)
    .filter(
      (n) =>
        get("journey", `ms_${n}_deleted`) !== "true" &&
        get("journey", `ms_${n}_hidden`) !== "true" &&
        (get("journey", `ms_${n}_title`) || get("journey", `ms_${n}_year`))
    )
    .map((n) => ({
      n,
      year: get("journey", `ms_${n}_year`),
      title: get("journey", `ms_${n}_title`),
      desc: get("journey", `ms_${n}_desc`),
      order: parseInt(get("journey", `ms_${n}_order`) || String(n), 10),
    }))
    .sort((a, b) => a.order - b.order);

  if (milestones.length === 0) return null;

  return (
    <section className="section-padding bg-background">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-accent text-sm font-semibold uppercase tracking-widest">{get("journey", "tagline")}</span>
          <h2 className="section-title mt-3">{get("journey", "title")}</h2>
        </div>

        <div className="relative">
          {/* spine */}
          <span className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-border md:-translate-x-1/2" aria-hidden />

          <ol className="space-y-8 md:space-y-12">
            {milestones.map((m, i) => {
              const left = i % 2 === 0;
              return (
                <li key={m.n} className="relative">
                  <div className={`md:grid md:grid-cols-2 md:gap-10 items-center ${left ? "" : "md:[&>*:first-child]:order-2"}`}>
                    <motion.div
                      className={`ml-10 md:ml-0 ${left ? "md:text-right md:pr-4" : "md:pl-4"}`}
                      initial={{ opacity: 0, x: left ? -40 : 40 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-60px" }}
                      transition={{ duration: 0.55, ease: "easeOut" }}
                    >
                      <div className="card-industrial p-5 md:p-6 inline-block w-full">
                        <p className="text-accent font-display font-extrabold text-xl md:text-2xl">{m.year}</p>
                        <h3 className="font-display font-bold text-base md:text-lg mt-1">{m.title}</h3>
                        {m.desc && <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{m.desc}</p>}
                      </div>
                    </motion.div>
                    <div className="hidden md:block" aria-hidden />
                  </div>

                  {/* node */}
                  <motion.span
                    className="absolute left-4 md:left-1/2 top-6 md:top-1/2 h-4 w-4 -translate-x-1/2 md:-translate-y-1/2 rounded-full border-2 border-accent bg-background"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: 0.1 }}
                  />
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
};

export default JourneyTimeline;
