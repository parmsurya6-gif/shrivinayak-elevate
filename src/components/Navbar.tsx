import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown, LogIn, LogOut, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import RequestQuoteDialog from "./RequestQuoteDialog";
import { useCmsPage } from "@/hooks/useCmsPage";

const navbarDefaults: Record<string, Record<string, string>> = {
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

const exploreItems = [
  { label: "Capabilities", path: "/capabilities" },
  { label: "Facility Tour", path: "/facility" },
  { label: "Future Expansion", path: "/industries" },
  { label: "Awards & Clients", path: "/clients" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [exploreOpen, setExploreOpen] = useState(false);
  const [mobileExploreOpen, setMobileExploreOpen] = useState(false);
  const [quoteOpen, setQuoteOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin, signOut } = useAuth();
  const { get } = useCmsPage("navbar", navbarDefaults);
  const navRef = useRef<HTMLElement>(null);

  // Auto-measure navbar height (bar + open mobile menu) and expose as --nav-h
  // so <Layout> can offset main content and the mobile menu never overlaps.
  useEffect(() => {
    const el = navRef.current;
    if (!el) return;
    const write = () => {
      const h = el.getBoundingClientRect().height;
      document.documentElement.style.setProperty("--nav-h", `${Math.ceil(h)}px`);
    };
    write();
    const ro = new ResizeObserver(write);
    ro.observe(el);
    window.addEventListener("resize", write);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", write);
    };
  }, [isOpen, mobileExploreOpen]);

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (!error) {
      navigate("/");
    }
  };

  const navItems = [
    { label: "Home", path: "/" },
    { label: "About Us", path: "/company" },
  ];

  const afterExplore = [
    { label: "Product Gallery", path: "/products" },
    { label: "Careers", path: "/careers" },
    { label: "Contact Us", path: "/contact" },
  ];

  return (
    <>
      <nav
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-50 border-b border-border shadow-sm"
        style={{
          background: `linear-gradient(180deg, ${get("brand", "bg_from") || "#dbeafe"} 0%, ${get("brand", "bg_to") || "#93c5fd"} 100%)`,
        }}
      >
        <div className="w-full mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 lg:h-24 gap-2">
            <Link to="/" className="flex items-center gap-2 min-w-0 flex-shrink">
              <img
                src={get("brand", "logo")}
                alt={get("brand", "alt")}
                className="h-10 sm:h-12 lg:h-16 w-auto max-w-[80px] object-contain flex-shrink-0 drop-shadow-sm"
              />
              <div className="hidden sm:block min-w-0">
                <p
                  className="font-display font-extrabold tracking-wide text-base lg:text-2xl leading-tight truncate"
                  style={{
                    color: get("brand", "name_color") || "#b91c1c",
                    fontFamily: "Algerian, 'Cinzel Decorative', 'Rye', 'Cinzel', Georgia, serif",
                    letterSpacing: "0.05em",
                  }}
                >
                  {`${get("brand", "name_line1")} ${get("brand", "name_line2")}`.trim()}
                </p>
                <p
                  className="italic text-[10px] lg:text-xs leading-tight truncate mt-0.5"
                  style={{ color: get("brand", "desc_color") || "#1e3a8a" }}
                >
                  {get("brand", "description")}
                </p>
              </div>
            </Link>

            {/* Desktop */}
            <div className="hidden xl:flex items-center gap-0.5 flex-wrap justify-end">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-2.5 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
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
                <button className="px-2.5 py-2 rounded-md text-sm font-medium nav-link flex items-center gap-1 whitespace-nowrap transition-colors">
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

              {afterExplore.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-2.5 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
                    location.pathname === item.path ? "nav-link-active bg-secondary" : "nav-link"
                  }`}
                >
                  {item.label}
                </Link>
              ))}

              <button onClick={() => setQuoteOpen(true)} className="btn-primary ml-2 text-xs whitespace-nowrap">
                Request Quote
              </button>

              {user ? (
                <div className="flex items-center gap-2 ml-2">
                  {isAdmin && (
                    <Link to="/admin" className="inline-flex items-center gap-1.5 px-2.5 py-2 rounded-md text-xs font-semibold bg-accent text-accent-foreground hover:opacity-90 transition-opacity whitespace-nowrap">
                      <LayoutDashboard size={14} /> Admin Dashboard
                    </Link>
                  )}
                  <button onClick={handleSignOut} className="p-2 rounded-md nav-link transition-colors" title="Sign Out">
                    <LogOut size={18} />
                  </button>
                </div>
              ) : (
                <Link to="/auth" className="ml-2 p-2 rounded-md nav-link transition-colors" title="Login / Sign Up">
                  <LogIn size={18} />
                </Link>
              )}
            </div>

            {/* Mobile toggle */}
            <button onClick={() => setIsOpen(!isOpen)} className="xl:hidden p-2 text-foreground flex-shrink-0">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="xl:hidden bg-card border-t border-border max-h-[calc(100vh-3.5rem)] overflow-y-auto">
            <div className="px-4 py-4 space-y-1">
              {navItems.map((item) => (
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

              {afterExplore.map((item) => (
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

              {user ? (
                <>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-2 px-4 py-3 rounded-md text-sm font-semibold bg-accent text-accent-foreground"
                    >
                      <LayoutDashboard size={16} /> Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => { handleSignOut(); setIsOpen(false); }}
                    className="block w-full text-left px-4 py-3 rounded-md text-sm font-medium nav-link"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  to="/auth"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 rounded-md text-sm font-medium nav-link"
                >
                  Login / Sign Up
                </Link>
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
