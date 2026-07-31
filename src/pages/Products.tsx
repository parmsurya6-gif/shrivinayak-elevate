import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import ScrollReveal from "@/components/ScrollReveal";
import { useCmsPage } from "@/hooks/useCmsPage";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const defaults: Record<string, Record<string, string>> = {
  hero: { title: "Products Gallery", image: "/images/products-1.png" },
  gallery: Object.fromEntries(
    Array.from({ length: 10 }, (_, i) => [`product_${i + 1}_image`, `/images/products-${i + 1}.png`])
  ),
};

const Products = () => {
  const { get } = useCmsPage("products", defaults);
  const [rows, setRows] = useState<Record<string, string>>({});
  const [extraImages, setExtraImages] = useState<string[]>([]);

  useEffect(() => {
    const load = () => supabase
      .from("site_content")
      .select("content_key, content_value")
      .eq("page", "products")
      .eq("section", "gallery")
      .then(({ data }) => {
        const map: Record<string, string> = {};
        (data ?? []).forEach((d) => { map[d.content_key] = d.content_value ?? ""; });
        setRows(map);
        const baseKeys = new Set(Array.from({ length: 10 }, (_, i) => `product_${i + 1}_image`));
        const extras = (data ?? [])
          .filter((d) => /^product_\d+_image$/.test(d.content_key) && !baseKeys.has(d.content_key) && d.content_value)
          .filter((d) => {
            const n = d.content_key.match(/^product_(\d+)_image$/)![1];
            return map[`product_${n}_hidden`] !== "true" && map[`product_${n}_deleted`] !== "true";
          })
          .sort((a, b) => a.content_key.localeCompare(b.content_key))
          .map((d) => d.content_value as string);
        setExtraImages(extras);
      });
    load();
  }, []);

  const baseProducts = Array.from({ length: 10 }, (_, i) => i + 1)
    .filter((n) => rows[`product_${n}_hidden`] !== "true" && rows[`product_${n}_deleted`] !== "true")
    .map((n) => get("gallery", `product_${n}_image`))
    .filter(Boolean);
  const products = [...baseProducts, ...extraImages];

  return (
    <Layout>
      <section className="relative h-[40vh] md:h-[50vh] min-h-[300px] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <motion.img src={get("hero", "image")} alt="Products" className="image-cover" initial={{ scale: 1.1 }} animate={{ scale: 1 }} transition={{ duration: 1.5, ease: "easeOut" }} />
          <div className="absolute inset-0 overlay-gradient" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 w-full">
          <motion.div className="flex items-center gap-2 mb-4" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
            <div className="h-px w-12 bg-highlight" />
            <span className="text-highlight text-sm font-semibold uppercase tracking-widest">Gallery</span>
          </motion.div>
          <motion.h1 className="text-3xl md:text-6xl font-display font-extrabold text-primary-foreground" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.5 }}>
            {get("hero", "title")}
          </motion.h1>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-12">
              <p className="section-subtitle mx-auto">Explore our range of precision machined components, welded assemblies, and fasteners manufactured for global clients.</p>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {products.map((img, i) => (
              <ScrollReveal key={i} delay={i * 0.05} direction={i % 3 === 0 ? "scale" : "up"}>
                <motion.div className="card-industrial group relative overflow-hidden cursor-pointer" whileHover={{ y: -6 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
                  <motion.img src={img} alt={`Product ${i + 1}`} className="w-full h-40 md:h-auto object-cover" whileHover={{ scale: 1.08 }} transition={{ duration: 0.5 }} />
                  <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/60 transition-all duration-300 flex items-center justify-center">
                    <Link to="/contact" className="opacity-0 group-hover:opacity-100 transition-opacity bg-highlight text-accent-foreground px-4 md:px-6 py-2 rounded-md text-xs md:text-sm font-semibold">Request Quote</Link>
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

export default Products;
