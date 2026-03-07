import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Company from "./pages/Company";
import Capabilities from "./pages/Capabilities";
import FacilityTour from "./pages/FacilityTour";
import Industries from "./pages/Industries";
import Products from "./pages/Products";
import Clients from "./pages/Clients";
import Contact from "./pages/Contact";
import Careers from "./pages/Careers";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import AdminLogin from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import Inquiries from "./pages/admin/Inquiries";
import Applications from "./pages/admin/Applications";
import ContentManager from "./pages/admin/Content";
import UserManager from "./pages/admin/Users";
import AdminJobs from "./pages/admin/Jobs";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/company" element={<Company />} />
            <Route path="/capabilities" element={<Capabilities />} />
            <Route path="/facility" element={<FacilityTour />} />
            <Route path="/industries" element={<Industries />} />
            <Route path="/products" element={<Products />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<Dashboard />} />
            <Route path="/admin/inquiries" element={<Inquiries />} />
            <Route path="/admin/applications" element={<Applications />} />
            <Route path="/admin/jobs" element={<AdminJobs />} />
            <Route path="/admin/content" element={<ContentManager />} />
            <Route path="/admin/users" element={<UserManager />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
