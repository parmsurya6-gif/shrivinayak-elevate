import { useState } from "react";
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
      <nav className="fixed top-0 left-0 right-0 z-50 bg-card/95 border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <Link to="/" className="flex items-center gap-3">
              <img src={get("brand", "logo")} alt={get("brand", "alt")} className="h-10 lg:h-12 w-auto" />
              <div className="hidden sm:block">
                <p className="font-display font-bold text-foreground text-sm lg:text-base leading-tight">{get("brand", "name_line1")}</p>
                <p className="font-display font-bold text-accent text-xs lg:text-sm leading-tight">{get("brand", "name_line2")}</p>
              </div>
            </Link>

            {/* Desktop */}
            <div className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
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

              {afterExplore.map((item) => (
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

              <button onClick={() => setQuoteOpen(true)} className="btn-primary ml-4 text-xs">
                Request Quote
              </button>

              {user ? (
                <div className="flex items-center gap-2 ml-2">
                  {isAdmin && (
                    <Link to="/admin" className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-semibold bg-accent text-accent-foreground hover:opacity-90 transition-opacity">
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
            <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden p-2 text-foreground">
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
