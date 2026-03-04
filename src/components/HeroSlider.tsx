import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const heroImages = [
  { src: "/images/hero-factory.jpg", alt: "Shrivinayak Industries Factory" },
  { src: "/images/factory-overview.jpg", alt: "Factory Overview" },
  { src: "/images/cnc-section.jpg", alt: "CNC Machining" },
];

const HeroSlider = () => {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % heroImages.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <div className="absolute inset-0">
      <AnimatePresence mode="wait">
        <motion.img
          key={current}
          src={heroImages[current].src}
          alt={heroImages[current].alt}
          className="image-cover absolute inset-0"
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
        />
      </AnimatePresence>
      <div className="absolute inset-0 overlay-gradient" />

      {/* Slide indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {heroImages.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              i === current ? "w-8 bg-highlight" : "w-4 bg-primary-foreground/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;
