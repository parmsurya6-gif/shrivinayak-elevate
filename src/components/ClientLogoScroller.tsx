const clientLogos = [
  { src: "/images/client-volkswagen.png", name: "Volkswagen" },
  { src: "/images/client-tata.png", name: "Tata Motors" },
  { src: "/images/client-skoda.png", name: "Škoda" },
  { src: "/images/client-mahindra.png", name: "Mahindra" },
  { src: "/images/client-john-deere.png", name: "John Deere" },
  { src: "/images/client-jcb.png", name: "JCB" },
  { src: "/images/client-hyundai.png", name: "Hyundai" },
  { src: "/images/client-ducati.png", name: "Ducati" },
  { src: "/images/client-piaggio.png", name: "Piaggio" },
];

const ClientLogoScroller = () => {
  // Duplicate the list for seamless infinite scroll
  const logos = [...clientLogos, ...clientLogos];

  return (
    <div className="overflow-hidden relative">
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

      <div className="flex items-center gap-16 animate-scroll-left">
        {logos.map((logo, i) => (
          <div
            key={`${logo.name}-${i}`}
            className="flex-shrink-0 h-16 md:h-20 w-32 md:w-40 flex items-center justify-center hover:scale-110 transition-transform duration-300"
          >
            <img
              src={logo.src}
              alt={logo.name}
              className="max-h-full max-w-full object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClientLogoScroller;
