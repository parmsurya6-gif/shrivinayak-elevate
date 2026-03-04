import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin, Twitter } from "lucide-react";

const Footer = () => (
  <footer className="bg-primary text-primary-foreground">
    <div className="max-w-7xl mx-auto section-padding">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        <div>
          <img src="/images/logo.jpg" alt="Shrivinayak Industries" className="h-14 w-auto mb-3 rounded bg-card p-1" />
          <h3 className="font-display font-bold text-lg mb-1">Shrivinayak Industries</h3>
          <p className="text-sm opacity-80 leading-relaxed mb-4">
            ISO 9001:2015 certified manufacturer of precision machined components, welded assemblies & fasteners.
          </p>
          <div className="flex items-center gap-3">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="opacity-70 hover:opacity-100 transition-opacity">
              <Facebook size={20} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="opacity-70 hover:opacity-100 transition-opacity">
              <Instagram size={20} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="opacity-70 hover:opacity-100 transition-opacity">
              <Linkedin size={20} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="opacity-70 hover:opacity-100 transition-opacity">
              <Twitter size={20} />
            </a>
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
            <a href="https://maps.google.com/?q=GAT+NO+679/2/2+Plot+No+21-24+Chakan-Alandi+Road+Pune+Maharashtra+411062+India" target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 hover:opacity-100 transition-opacity">
              <MapPin size={16} className="mt-1 flex-shrink-0" />
              <p className="text-sm opacity-80">
                GAT NO. 679/2/2, Plot No. 21-24, Chakan-Alandi Road, Pune, Maharashtra 411062, India
              </p>
            </a>
            <div className="flex items-center gap-3">
              <Phone size={16} className="flex-shrink-0" />
              <p className="text-sm opacity-80">+91 9273665000</p>
            </div>
            <div className="flex items-center gap-3">
              <Mail size={16} className="flex-shrink-0" />
              <a href="mailto:svipune.5000@gmail.com" className="text-sm opacity-80 hover:opacity-100 transition-opacity">svipune.5000@gmail.com</a>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-primary-foreground/20 mt-12 pt-8 text-center">
        <p className="text-sm opacity-60">© {new Date().getFullYear()} Shrivinayak Industries. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
