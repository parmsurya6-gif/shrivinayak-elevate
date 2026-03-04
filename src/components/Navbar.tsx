import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import RequestQuoteDialog from "./RequestQuoteDialog";

const mainNavItems = [
  { label: "Home", path: "/" },
  { label: "About Us", path: "/company" },
  { label: "Careers", path: "/careers" },
  { label: "Contact Us", path: "/contact" },
];

const exploreItems = [
  { label: "Capabilities", path: "/capabilities" },
  { label: "Facility Tour", path: "/facility" },
  { label: "Industries", path: "/industries" },
  { label: "Products", path: "/products" },
  { label: "Clients", path: "/clients" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [exploreOpen, setExploreOpen] = useState(false);
  const [mobileExploreOpen, setMobileExploreOpen] = useState(false);
  const [quoteOpen, setQuoteOpen] = useState(false);
  const location = useLocation();

  return (
    <>
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
              {mainNavItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === item.path ? "nav-link-active bg-secondary" : "nav-link"
                  }`}
                >
                  {item.label}
                </Link>
              ))}

              {/* Explore Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setExploreOpen(true)}
                onMouseLeave={() => setExploreOpen(false)}
              >
                <button className="px-3 py-2 rounded-md text-sm font-medium nav-link flex items-center gap-1 transition-colors">
                  Explore <ChevronDown size={14} className={`transition-transform ${exploreOpen ? "rotate-180" : ""}`} />
                </button>
                {exploreOpen && (
                  <div className="absolute top-full left-0 mt-1 w-48 bg-card border border-border rounded-lg shadow-lg py-2 z-50">
                    {exploreItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`block px-4 py-2.5 text-sm transition-colors hover:bg-secondary ${
                          location.pathname === item.path ? "nav-link-active" : "nav-link"
                        }`}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <button onClick={() => setQuoteOpen(true)} className="btn-primary ml-4 text-xs">
                Request Quote
              </button>
            </div>

            {/* Mobile toggle */}
            <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden p-2 text-foreground">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="lg:hidden bg-card border-t border-border">
            <div className="px-4 py-4 space-y-1">
              {mainNavItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === item.path ? "nav-link-active bg-secondary" : "nav-link"
                  }`}
                >
                  {item.label}
                </Link>
              ))}

              {/* Mobile Explore */}
              <button
                onClick={() => setMobileExploreOpen(!mobileExploreOpen)}
                className="w-full flex items-center justify-between px-4 py-3 rounded-md text-sm font-medium nav-link"
              >
                Explore <ChevronDown size={14} className={`transition-transform ${mobileExploreOpen ? "rotate-180" : ""}`} />
              </button>
              {mobileExploreOpen && (
                <div className="pl-6 space-y-1">
                  {exploreItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => { setIsOpen(false); setMobileExploreOpen(false); }}
                      className={`block px-4 py-2.5 rounded-md text-sm transition-colors ${
                        location.pathname === item.path ? "nav-link-active bg-secondary" : "nav-link"
                      }`}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}

              <button
                onClick={() => { setQuoteOpen(true); setIsOpen(false); }}
                className="btn-primary block text-center mt-4 text-xs w-full"
              >
                Request Quote
              </button>
            </div>
          </div>
        )}
      </nav>

      <RequestQuoteDialog open={quoteOpen} onOpenChange={setQuoteOpen} />
    </>
  );
};

export default Navbar;
