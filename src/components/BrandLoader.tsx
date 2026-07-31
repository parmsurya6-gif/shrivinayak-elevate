import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCmsPage } from "@/hooks/useCmsPage";

const brandDefaults: Record<string, Record<string, string>> = {
  brand: {
    logo: "/images/logo.jpg",
    name_line1: "Shrivinayak",
    name_line2: "Industries",
    alt: "Shrivinayak Industries",
    description: "Precision Machined Components & Assemblies",
    bg_from: "#dbeafe",
    bg_to: "#93c5fd",
    name_color: "#b91c1c",
    desc_color: "#1e3a8a",
  },
};

const MIN_MS = 1600;

const BrandLoader = () => {
  const { get } = useCmsPage("navbar", brandDefaults);
  const [done, setDone] = useState(false);
  const name = `${get("brand", "name_line1")} ${get("brand", "name_line2")}`.trim();

  useEffect(() => {
    const start = performance.now();
    const finish = () => {
      const wait = Math.max(0, MIN_MS - (performance.now() - start));
      window.setTimeout(() => setDone(true), wait);
    };
    if (document.readyState === "complete") finish();
    else window.addEventListener("load", finish, { once: true });
    return () => window.removeEventListener("load", finish);
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center overflow-hidden"
          style={{
            background: `linear-gradient(180deg, ${get("brand", "bg_from") || "#dbeafe"} 0%, ${get("brand", "bg_to") || "#93c5fd"} 100%)`,
          }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(8px)" }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
        >
          {/* engineered grid backdrop */}
          <div
            className="absolute inset-0 opacity-[0.18]"
            aria-hidden
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(30,58,138,.35) 1px, transparent 1px), linear-gradient(to bottom, rgba(30,58,138,.35) 1px, transparent 1px)",
              backgroundSize: "56px 56px",
            }}
          />
          {/* sweeping light */}
          <motion.div
            className="absolute inset-y-0 w-1/3 -skew-x-12"
            aria-hidden
            style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,.55), transparent)" }}
            initial={{ x: "-60%" }}
            animate={{ x: "220%" }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />

          <div className="relative flex flex-col items-center px-6 text-center">
            <motion.div
              className="relative mb-5"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <motion.span
                className="absolute -inset-4 rounded-full border-2 border-dashed"
                style={{ borderColor: `${get("brand", "name_color") || "#b91c1c"}55` }}
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              />
              <img
                src={get("brand", "logo")}
                alt={get("brand", "alt")}
                className="relative h-20 w-20 md:h-24 md:w-24 object-contain rounded-full bg-card p-2 shadow-lg"
              />
            </motion.div>

            <h1
              className="font-extrabold text-2xl md:text-4xl tracking-wide flex flex-wrap justify-center"
              style={{
                color: get("brand", "name_color") || "#b91c1c",
                fontFamily: "Algerian, 'Cinzel Decorative', 'Rye', 'Cinzel', Georgia, serif",
                letterSpacing: "0.08em",
              }}
            >
              {name.split("").map((c, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 + i * 0.035, duration: 0.35 }}
                >
                  {c === " " ? "\u00A0" : c}
                </motion.span>
              ))}
            </h1>

            <motion.p
              className="italic text-xs md:text-sm mt-2"
              style={{ color: get("brand", "desc_color") || "#1e3a8a" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.5 }}
            >
              {get("brand", "description")}
            </motion.p>

            <div className="mt-7 h-[3px] w-48 md:w-64 rounded-full bg-foreground/10 overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: get("brand", "name_color") || "#b91c1c" }}
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: MIN_MS / 1000, ease: "easeInOut" }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BrandLoader;
