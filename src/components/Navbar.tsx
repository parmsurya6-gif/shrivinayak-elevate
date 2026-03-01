import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

const navItems = [
  { label: "Home", path: "/" },
  { label: "Company", path: "/company" },
  { label: "Capabilities", path: "/capabilities" },
  { label: "Facility Tour", path: "/facility" },
  { label: "Industries", path: "/industries" },
  { label: "Products", path: "/products" },
  { label: "Clients", path: "/clients" },
  { label: "Careers", path: "/careers" },
  { label: "Contact", path: "/contact" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link to="/" className="flex items-center gap-3">
            <img src="/images/logo.jpg" alt="Shrivinayak Industries" className="h-10 lg:h-12 w-auto" />
            <div className="hidden sm:block">
              <p className="font-display font-bold text-foreground text-sm lg:text-base leading-tight">Shrivinayak</p>
              <p className="font-display font-bold text-accent text-xs lg:text-sm leading-tight">Industries</p>
            </div>
          </Link>

          {/* Desktop */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === item.path
                    ? "nav-link-active bg-secondary"
                    : "nav-link"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link to="/contact" className="btn-primary ml-4 text-xs">
              Request Quote
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-foreground"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="lg:hidden bg-card border-t border-border">
          <div className="px-4 py-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === item.path
                    ? "nav-link-active bg-secondary"
                    : "nav-link"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link to="/contact" onClick={() => setIsOpen(false)} className="btn-primary block text-center mt-4 text-xs">
              Request Quote
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
