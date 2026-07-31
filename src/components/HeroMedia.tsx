import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  video?: string;
  images: string[];
  alt?: string;
}

const DURATION = 3000;

/**
 * Hero media panel: shows an admin-uploaded video when present,
 * otherwise an auto-sliding image carousel (3s per slide).
 */
const HeroMedia = ({ video, images, alt = "Shrivinayak Industries" }: Props) => {
  const slides = images.filter(Boolean);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (video || slides.length < 2) return;
    const t = setInterval(() => setCurrent((p) => (p + 1) % slides.length), DURATION);
    return () => clearInterval(t);
  }, [video, slides.length]);

  if (video) {
    return (
      <div className="relative rounded-2xl overflow-hidden border border-border shadow-[0_24px_60px_-24px_hsl(var(--foreground)/0.35)] aspect-video bg-foreground">
        <video
          src={video}
          className="h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
        />
      </div>
    );
  }

  if (slides.length === 0) return null;

  return (
    <div className="relative rounded-2xl overflow-hidden border border-border shadow-[0_24px_60px_-24px_hsl(var(--foreground)/0.35)] aspect-video bg-secondary">
      <AnimatePresence mode="sync">
        <motion.img
          key={current}
          src={slides[current]}
          alt={alt}
          className="absolute inset-0 h-full w-full object-cover"
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ opacity: { duration: 0.8 }, scale: { duration: 4, ease: "linear" } }}
        />
      </AnimatePresence>

      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-foreground/50 to-transparent" />

      <div className="absolute bottom-4 right-4 z-10 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => setCurrent(i)}
            className={`h-[3px] rounded-full transition-all ${i === current ? "w-8 bg-highlight" : "w-4 bg-primary-foreground/50"}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroMedia;
