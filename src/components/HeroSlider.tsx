import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const heroImages = [
  { src: "/images/hero-factory.jpg", alt: "Shrivinayak Industries Factory" },
  { src: "/images/factory-overview.jpg", alt: "Factory Overview" },
  { src: "/images/cnc-section.jpg", alt: "CNC Machining" },
];

const DURATION = 6000;

const HeroSlider = () => {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % heroImages.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, DURATION);
    return () => clearInterval(timer);
  }, [next, current]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Cinematic Ken Burns slides */}
      <AnimatePresence mode="sync">
        <motion.div key={current} className="absolute inset-0">
          <motion.img
            src={heroImages[current].src}
            alt={heroImages[current].alt}
            className="image-cover absolute inset-0 will-change-transform"
            initial={{ opacity: 0, scale: 1.12 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.04 }}
            transition={{ opacity: { duration: 1.2, ease: "easeInOut" }, scale: { duration: 7, ease: "linear" } }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Cinematic layered overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/60 to-foreground/10" />
      <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-transparent to-foreground/30" />

      {/* Slide progress rail */}
      <div className="absolute bottom-6 md:bottom-10 right-4 md:right-10 z-20 flex items-center gap-3">
        <span className="text-primary-foreground/70 text-xs font-mono tracking-widest">
          {String(current + 1).padStart(2, "0")} / {String(heroImages.length).padStart(2, "0")}
        </span>
        <div className="flex gap-2">
          {heroImages.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => setCurrent(i)}
              className="relative h-[3px] w-10 md:w-16 overflow-hidden rounded-full bg-primary-foreground/25"
            >
              {i === current && (
                <motion.span
                  className="absolute inset-y-0 left-0 bg-highlight"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: DURATION / 1000, ease: "linear" }}
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroSlider;
