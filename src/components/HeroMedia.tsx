import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Volume2, VolumeX, RotateCcw } from "lucide-react";

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
  const [videoFailed, setVideoFailed] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Reset failure state whenever the admin swaps/removes the video.
  useEffect(() => setVideoFailed(false), [video]);

  const useVideo = Boolean(video) && !videoFailed;

  useEffect(() => {
    if (useVideo || slides.length < 2) return;
    const t = setInterval(() => setCurrent((p) => (p + 1) % slides.length), DURATION);
    return () => clearInterval(t);
  }, [useVideo, slides.length]);

  if (useVideo) {
    const togglePlay = () => {
      const el = videoRef.current;
      if (!el) return;
      if (el.paused) { el.play(); setPlaying(true); } else { el.pause(); setPlaying(false); }
    };
    const toggleMute = () => {
      const el = videoRef.current;
      if (!el) return;
      el.muted = !el.muted;
      setMuted(el.muted);
    };
    const restart = () => {
      const el = videoRef.current;
      if (!el) return;
      el.currentTime = 0;
      el.play();
      setPlaying(true);
    };
    return (
      <div className="relative rounded-2xl overflow-hidden border border-border shadow-[0_24px_60px_-24px_hsl(var(--foreground)/0.35)] aspect-video bg-foreground">
        <video
          ref={videoRef}
          src={video}
          className="h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          onError={() => setVideoFailed(true)}
          onStalled={() => setVideoFailed(true)}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
        />
        <div className="absolute bottom-3 right-3 z-10 flex items-center gap-2">
          <button
            onClick={togglePlay}
            aria-label={playing ? "Pause video" : "Play video"}
            className="grid h-9 w-9 place-items-center rounded-full bg-background/80 text-foreground hover:bg-background transition-colors"
          >
            {playing ? <Pause size={16} /> : <Play size={16} />}
          </button>
          <button
            onClick={toggleMute}
            aria-label={muted ? "Unmute video" : "Mute video"}
            className="grid h-9 w-9 place-items-center rounded-full bg-background/80 text-foreground hover:bg-background transition-colors"
          >
            {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
          <button
            onClick={restart}
            aria-label="Restart video"
            className="grid h-9 w-9 place-items-center rounded-full bg-background/80 text-foreground hover:bg-background transition-colors"
          >
            <RotateCcw size={16} />
          </button>
        </div>
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
