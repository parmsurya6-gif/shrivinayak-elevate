import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import { useCmsPage } from "@/hooks/useCmsPage";

const navbarDefaults: Record<string, Record<string, string>> = {
  brand: {
    logo: "/images/logo.jpg",
    name_line1: "Shrivinayak",
    name_line2: "Industries",
    alt: "Shrivinayak Industries",
    description: "Precision Machined Components & Assemblies",
    name_color: "#b91c1c",
    desc_color: "#93c5fd",
  },
};

const footerDefaults: Record<string, Record<string, string>> = {
  contact: {
    address: "GAT NO. 679/2/2, Plot No. 21-24, Chakan-Alandi Road, Pune, Maharashtra 411062, India",
    phone_1: "+91 9273665000",
    phone_2: "+91 9881196066",
    email: "svipune.5000@gmail.com",
    map_url: "https://maps.google.com/?q=GAT+NO+679/2/2+Plot+No+21-24+Chakan-Alandi+Road+Pune+Maharashtra+411062+India",
    location_icon_color: "#f97316",
  },
  about: {
    tagline: "ISO 9001:2015 certified manufacturer of precision machined components, welded assemblies & fasteners.",
  },
  social: {
    facebook: "https://facebook.com",
    instagram: "https://instagram.com",
    linkedin: "https://linkedin.com",
    twitter: "https://twitter.com",
  },
  brand: {
    name_color: "",
    desc_color: "",
  },
};

const Footer = () => {
  const { get } = useCmsPage("navbar", navbarDefaults);
  const { get: getF } = useCmsPage("footer", footerDefaults);
  const companyName = `${get("brand", "name_line1")} ${get("brand", "name_line2")}`.trim();
  const locColor = getF("contact", "location_icon_color") || "#f97316";
  // Brand identity is shared with the navbar; footer may override the colors only.
  const nameColor = getF("brand", "name_color") || get("brand", "name_color") || "#fca5a5";
  const descColor = getF("brand", "desc_color") || get("brand", "desc_color") || "#93c5fd";
  return (
  <footer className="bg-primary text-primary-foreground">
    <div className="max-w-7xl mx-auto section-padding">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        <div>
          <img src={get("brand", "logo")} alt={get("brand", "alt")} className="h-16 w-auto mb-3 rounded bg-card p-1" />
          <h3
            className="font-extrabold text-xl mb-1 tracking-wide"
            style={{
              color: nameColor,
              fontFamily: "Algerian, 'Cinzel Decorative', 'Rye', 'Cinzel', Georgia, serif",
              letterSpacing: "0.05em",
            }}
          >
            {companyName}
          </h3>
          <p className="italic text-xs opacity-90 mb-2" style={{ color: descColor }}>
            {get("brand", "description")}
          </p>
          <p className="text-sm opacity-80 leading-relaxed mb-4">
            {getF("about", "tagline")}
          </p>
          <div className="flex items-center gap-3">
            <a href={getF("social", "facebook")} target="_blank" rel="noopener noreferrer" className="opacity-70 hover:opacity-100 transition-opacity"><Facebook size={20} /></a>
            <a href={getF("social", "instagram")} target="_blank" rel="noopener noreferrer" className="opacity-70 hover:opacity-100 transition-opacity"><Instagram size={20} /></a>
            <a href={getF("social", "linkedin")} target="_blank" rel="noopener noreferrer" className="opacity-70 hover:opacity-100 transition-opacity"><Linkedin size={20} /></a>
            <a href={getF("social", "twitter")} target="_blank" rel="noopener noreferrer" className="opacity-70 hover:opacity-100 transition-opacity"><Twitter size={20} /></a>
          </div>
        </div>

        <div>
          <h4 className="font-display font-bold text-lg mb-4">Quick Links</h4>
          <div className="space-y-2">
            {[
              { label: "About Us", path: "/company" },
              { label: "Capabilities", path: "/capabilities" },
              { label: "Products", path: "/products" },
              { label: "Careers", path: "/careers" },
              { label: "Contact Us", path: "/contact" },
            ].map((l) => (
              <Link key={l.path} to={l.path} className="block text-sm opacity-80 hover:opacity-100 transition-opacity">
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-display font-bold text-lg mb-4">Industries</h4>
          <div className="space-y-2">
            {["Automotive", "Agriculture", "Industrial Equipment", "Civil Machinery"].map((i) => (
              <p key={i} className="text-sm opacity-80">{i}</p>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-display font-bold text-lg mb-4">Contact</h4>
          <div className="space-y-3">
            <a href={getF("contact", "map_url")} target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 hover:opacity-100 transition-opacity">
              <MapPin size={18} className="mt-1 flex-shrink-0" style={{ color: locColor }} />
              <p className="text-sm opacity-80">{getF("contact", "address")}</p>
            </a>
            <a href={`tel:${getF("contact", "phone_1").replace(/\s+/g, "")}`} className="flex items-center gap-3 hover:opacity-100 transition-opacity">
              <Phone size={16} className="flex-shrink-0" />
              <p className="text-sm opacity-80">{getF("contact", "phone_1")}</p>
            </a>
            {getF("contact", "phone_2") && (
              <a href={`tel:${getF("contact", "phone_2").replace(/\s+/g, "")}`} className="flex items-center gap-3 hover:opacity-100 transition-opacity">
                <Phone size={16} className="flex-shrink-0" />
                <p className="text-sm opacity-80">{getF("contact", "phone_2")}</p>
              </a>
            )}
            <div className="flex items-center gap-3">
              <Mail size={16} className="flex-shrink-0" />
              <a href={`mailto:${getF("contact", "email")}`} className="text-sm opacity-80 hover:opacity-100 transition-opacity">{getF("contact", "email")}</a>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-primary-foreground/20 mt-12 pt-8 text-center">
        <p className="text-sm opacity-60">© {new Date().getFullYear()} {companyName}. All rights reserved.</p>
      </div>
    </div>
  </footer>
  );
};

export default Footer;
