import { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Layout = ({ children }: { children: ReactNode }) => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    {/* Navbar exposes its measured height as --nav-h so mobile menu never overlaps content */}
    <main className="flex-1" style={{ paddingTop: "var(--nav-h, 4rem)" }}>
      {children}
    </main>
    <Footer />
  </div>
);

export default Layout;
