import { useEffect, useState, useRef } from "react";
import AdminLayout from "@/components/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Save, Trash2, Upload, Image, Eye, X, ChevronDown, ChevronRight, Database } from "lucide-react";
import { uploadSiteImage, upsertContent, deleteContent } from "@/hooks/useSiteContent";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LogoCropperDialog from "@/components/admin/LogoCropperDialog";

interface ContentItem {
  id: string;
  page: string;
  section: string;
  content_key: string;
  content_value: string | null;
  content_type: string;
}

interface FieldDef {
  key: string;
  label: string;
  type: "text" | "textarea" | "image";
  default?: string;
}

interface SectionDef {
  key: string;
  label: string;
  fields: FieldDef[];
}

// Define the page structure with DEFAULT values from current hardcoded content
const PAGE_STRUCTURE: Record<string, { label: string; sections: SectionDef[] }> = {
  navbar: {
    label: "Navbar / Brand",
    sections: [
      {
        key: "brand", label: "Logo & Company Name",
        fields: [
          { key: "logo", label: "Logo Image", type: "image", default: "/images/logo.jpg" },
          { key: "name_line1", label: "Company Name (Line 1)", type: "text", default: "Shrivinayak" },
          { key: "name_line2", label: "Company Name (Line 2)", type: "text", default: "Industries" },
          { key: "alt", label: "Logo Alt Text", type: "text", default: "Shrivinayak Industries" },
        ],
      },
    ],
  },
  home: {
    label: "Homepage",
    sections: [
      {
        key: "hero", label: "Hero Section",
        fields: [
          { key: "tagline", label: "Tagline", type: "text", default: "Since 2016" },
          { key: "title_line1", label: "Hero Title Line 1", type: "text", default: "Engineering Precision." },
          { key: "title_line2", label: "Hero Title Line 2", type: "text", default: "Delivering Trust." },
          { key: "subtitle", label: "Hero Subtitle", type: "textarea", default: "Manufacturer and supplier of precision machined components, welded assemblies & fasteners for global automotive and industrial leaders." },
          { key: "cta_1_text", label: "CTA Button 1 Text", type: "text", default: "Explore Capabilities" },
          { key: "cta_2_text", label: "CTA Button 2 Text", type: "text", default: "Request a Quote" },
        ],
      },
      {
        key: "stats", label: "Statistics",
        fields: [
          { key: "stat_1_value", label: "Stat 1 Value", type: "text", default: "100" },
          { key: "stat_1_suffix", label: "Stat 1 Suffix", type: "text", default: "+" },
          { key: "stat_1_label", label: "Stat 1 Label", type: "text", default: "Employees" },
          { key: "stat_2_value", label: "Stat 2 Value", type: "text", default: "22000" },
          { key: "stat_2_suffix", label: "Stat 2 Suffix", type: "text", default: "" },
          { key: "stat_2_label", label: "Stat 2 Label", type: "text", default: "Sq.Ft. Facility" },
          { key: "stat_3_value", label: "Stat 3 Value", type: "text", default: "15" },
          { key: "stat_3_suffix", label: "Stat 3 Suffix", type: "text", default: "+" },
          { key: "stat_3_label", label: "Stat 3 Label", type: "text", default: "CNC Machines" },
          { key: "stat_4_value", label: "Stat 4 Value", type: "text", default: "10" },
          { key: "stat_4_suffix", label: "Stat 4 Suffix", type: "text", default: "+" },
          { key: "stat_4_label", label: "Stat 4 Label", type: "text", default: "Years Experience" },
        ],
      },
      {
        key: "about", label: "About Section",
        fields: [
          { key: "tagline", label: "Tagline", type: "text", default: "About Us" },
          { key: "title", label: "Section Title", type: "text", default: "Trusted by Global Automotive Leaders" },
          { key: "description", label: "Description", type: "textarea", default: "Shrivinayak Industries is an ISO 9001:2015 certified organization specializing in the manufacture and supply of machined components, welded assemblies, and fasteners. Established in 2016 in Pune, we serve tier-1 suppliers for Ducati, Volkswagen, Tata, Mahindra, JCB, and more." },
          { key: "image", label: "About Image", type: "image", default: "/images/factory-overview.jpg" },
          { key: "cert_1_label", label: "Certification 1", type: "text", default: "ISO 9001:2015" },
          { key: "cert_1_desc", label: "Certification 1 Desc", type: "text", default: "Certified Quality" },
          { key: "cert_2_label", label: "Certification 2", type: "text", default: "VDA 6.3" },
          { key: "cert_2_desc", label: "Certification 2 Desc", type: "text", default: "In Preparation" },
          { key: "cert_3_label", label: "Certification 3", type: "text", default: "IATF 16949" },
          { key: "cert_3_desc", label: "Certification 3 Desc", type: "text", default: "In Preparation" },
        ],
      },
      {
        key: "capabilities", label: "Capabilities Section",
        fields: [
          { key: "tagline", label: "Tagline", type: "text", default: "What We Do" },
          { key: "title", label: "Section Title", type: "text", default: "Manufacturing Excellence" },
          { key: "cap_1_title", label: "Capability 1 Title", type: "text", default: "Machined Components" },
          { key: "cap_1_desc", label: "Capability 1 Description", type: "textarea", default: "Precision CNC & VMC machining with tight tolerances" },
          { key: "cap_1_image", label: "Capability 1 Image", type: "image", default: "/images/cnc-section.jpg" },
          { key: "cap_2_title", label: "Capability 2 Title", type: "text", default: "Welded Assemblies" },
          { key: "cap_2_desc", label: "Capability 2 Description", type: "textarea", default: "CO2 welding with certified operators" },
          { key: "cap_2_image", label: "Capability 2 Image", type: "image", default: "/images/welding.jpg" },
          { key: "cap_3_title", label: "Capability 3 Title", type: "text", default: "Fasteners Supply" },
          { key: "cap_3_desc", label: "Capability 3 Description", type: "textarea", default: "Complete fastener solutions for all industries" },
          { key: "cap_3_image", label: "Capability 3 Image", type: "image", default: "/images/products-1.png" },
        ],
      },
      {
        key: "clients", label: "Clients Section",
        fields: [
          { key: "tagline", label: "Tagline", type: "text", default: "Trusted Partners" },
          { key: "title", label: "Section Title", type: "text", default: "Our Global Clients" },
        ],
      },
      {
        key: "facilities", label: "Facilities Gallery",
        fields: [
          { key: "tagline", label: "Tagline", type: "text", default: "Our Infrastructure" },
          { key: "title", label: "Section Title", type: "text", default: "State-of-the-Art Facilities" },
          { key: "facility_1_image", label: "Facility 1 Image", type: "image", default: "/images/cnc-section.jpg" },
          { key: "facility_2_image", label: "Facility 2 Image", type: "image", default: "/images/vmc-section.jpg" },
          { key: "facility_3_image", label: "Facility 3 Image", type: "image", default: "/images/welding.jpg" },
          { key: "facility_4_image", label: "Facility 4 Image", type: "image", default: "/images/laser-marking.jpg" },
          { key: "facility_5_image", label: "Facility 5 Image", type: "image", default: "/images/wire-cutting.jpg" },
          { key: "facility_6_image", label: "Facility 6 Image", type: "image", default: "/images/pipe-bending.jpg" },
          { key: "facility_7_image", label: "Facility 7 Image", type: "image", default: "/images/quality-lab.jpg" },
          { key: "facility_8_image", label: "Facility 8 Image", type: "image", default: "/images/traub-section.jpg" },
        ],
      },
      {
        key: "awards", label: "Awards & Achievements",
        fields: [
          { key: "tagline", label: "Tagline", type: "text", default: "Recognition" },
          { key: "title", label: "Section Title", type: "text", default: "Awards & Achievements" },
          { key: "award_1_title", label: "Award 1 Title", type: "text", default: "Best Quality Performance Award" },
          { key: "award_1_image", label: "Award 1 Image", type: "image", default: "/images/award-real-1.jpg" },
          { key: "award_2_title", label: "Award 2 Title", type: "text", default: "Best Quality Trophy" },
          { key: "award_2_image", label: "Award 2 Image", type: "image", default: "/images/award-real-2.jpg" },
          { key: "award_3_title", label: "Award 3 Title", type: "text", default: "Best Supplier Award" },
          { key: "award_3_image", label: "Award 3 Image", type: "image", default: "/images/award-real-3.jpg" },
          { key: "award_4_title", label: "Award 4 Title", type: "text", default: "Best Supplier Trophy" },
          { key: "award_4_image", label: "Award 4 Image", type: "image", default: "/images/award-real-4.jpg" },
          { key: "award_5_title", label: "Award 5 Title", type: "text", default: "Certificate of Appreciation" },
          { key: "award_5_image", label: "Award 5 Image", type: "image", default: "/images/award-real-5.jpg" },
          { key: "award_6_title", label: "Award 6 Title", type: "text", default: "Appreciation Certificate" },
          { key: "award_6_image", label: "Award 6 Image", type: "image", default: "/images/award-real-6.jpg" },
        ],
      },
      {
        key: "cta", label: "Call to Action",
        fields: [
          { key: "title", label: "CTA Title", type: "text", default: "Let's Build Something Together" },
          { key: "description", label: "CTA Description", type: "textarea", default: "Partner with us for precision-engineered components that meet the highest quality standards." },
          { key: "image", label: "CTA Background Image", type: "image", default: "/images/cnc-section.jpg" },
          { key: "cta_1_text", label: "Button 1 Text", type: "text", default: "Get Started" },
          { key: "cta_2_text", label: "Button 2 Text", type: "text", default: "Our Capabilities" },
        ],
      },
    ],
  },
  company: {
    label: "Company",
    sections: [
      {
        key: "hero", label: "Hero Banner",
        fields: [
          { key: "title", label: "Page Title", type: "text", default: "Our Story" },
          { key: "subtitle", label: "Subtitle", type: "text", default: "Building Excellence Since 2016" },
          { key: "image", label: "Banner Image", type: "image", default: "/images/factory-overview.jpg" },
        ],
      },
      {
        key: "journey", label: "Our Journey",
        fields: [
          { key: "title", label: "Section Title", type: "text", default: "Our Journey" },
          { key: "description", label: "Journey Description", type: "textarea", default: "Shrivinayak Industries was established in 2016 in Chakan, Pune. What started as a small machining workshop has grown into a fully integrated manufacturing facility spanning 22,000+ sq.ft., equipped with state-of-the-art CNC, VMC, and welding infrastructure." },
          { key: "image", label: "Journey Image", type: "image", default: "/images/factory-overview.jpg" },
        ],
      },
      {
        key: "vision", label: "Vision & Mission",
        fields: [
          { key: "vision_title", label: "Vision Title", type: "text", default: "Our Vision" },
          { key: "vision_text", label: "Vision Text", type: "textarea", default: "To be a globally recognized supplier of precision-engineered components, setting benchmarks in quality, innovation, and customer satisfaction." },
          { key: "vision_image", label: "Vision Image", type: "image", default: "/images/vmc-section.jpg" },
          { key: "mission_title", label: "Mission Title", type: "text", default: "Our Mission" },
          { key: "mission_text", label: "Mission Text", type: "textarea", default: "To deliver world-class machined components, welded assemblies, and fasteners through continuous improvement, advanced technology, and a skilled workforce." },
          { key: "mission_image", label: "Mission Image", type: "image", default: "/images/cnc-section.jpg" },
        ],
      },
      {
        key: "quality", label: "Quality Policy",
        fields: [
          { key: "title", label: "Section Title", type: "text", default: "Quality Policy" },
          { key: "description", label: "Quality Policy Text", type: "textarea", default: "At Shrivinayak Industries, quality is embedded in every process. We follow stringent quality protocols including 100% inspection, SPC monitoring, and continuous process improvement to deliver zero-defect products." },
          { key: "point_1", label: "Quality Point 1", type: "text", default: "100% dimensional inspection on all critical parts" },
          { key: "point_2", label: "Quality Point 2", type: "text", default: "SPC monitoring and process capability studies" },
          { key: "point_3", label: "Quality Point 3", type: "text", default: "Continuous improvement through lean manufacturing" },
          { key: "point_4", label: "Quality Point 4", type: "text", default: "Regular internal and external quality audits" },
        ],
      },
    ],
  },
  capabilities: {
    label: "Capabilities",
    sections: [
      {
        key: "hero", label: "Hero Banner",
        fields: [
          { key: "title", label: "Page Title", type: "text", default: "Our Capabilities" },
          { key: "subtitle", label: "Subtitle", type: "text", default: "Advanced Manufacturing Solutions" },
          { key: "image", label: "Banner Image", type: "image", default: "/images/cnc-section.jpg" },
        ],
      },
      {
        key: "services", label: "Services List",
        fields: [
          { key: "service_1_title", label: "Service 1 Title", type: "text", default: "CNC Turning" },
          { key: "service_1_desc", label: "Service 1 Description", type: "textarea", default: "High-precision CNC turning for complex geometries with tolerances up to ±0.01mm" },
          { key: "service_1_detail", label: "Service 1 Detail", type: "textarea", default: "Our CNC turning center handles components from 5mm to 200mm diameter with multi-axis capability." },
          { key: "service_1_image", label: "Service 1 Image", type: "image", default: "/images/cnc-section.jpg" },
          { key: "service_2_title", label: "Service 2 Title", type: "text", default: "VMC Machining" },
          { key: "service_2_desc", label: "Service 2 Description", type: "textarea", default: "Vertical machining centers for milling, drilling, and tapping operations" },
          { key: "service_2_detail", label: "Service 2 Detail", type: "textarea", default: "4-axis VMC machines with automatic tool changers for high-volume production runs." },
          { key: "service_2_image", label: "Service 2 Image", type: "image", default: "/images/vmc-section.jpg" },
          { key: "service_3_title", label: "Service 3 Title", type: "text", default: "CO2 Welding" },
          { key: "service_3_desc", label: "Service 3 Description", type: "textarea", default: "Certified CO2 welding with trained operators for structural assemblies" },
          { key: "service_3_detail", label: "Service 3 Detail", type: "textarea", default: "MIG/MAG welding with fixtures and jigs for consistent, high-quality welds." },
          { key: "service_3_image", label: "Service 3 Image", type: "image", default: "/images/welding.jpg" },
          { key: "service_4_title", label: "Service 4 Title", type: "text", default: "Laser Marking" },
          { key: "service_4_desc", label: "Service 4 Description", type: "textarea", default: "Permanent laser marking for part identification and traceability" },
          { key: "service_4_image", label: "Service 4 Image", type: "image", default: "/images/laser-marking.jpg" },
          { key: "service_5_title", label: "Service 5 Title", type: "text", default: "Wire Cutting" },
          { key: "service_5_desc", label: "Service 5 Description", type: "textarea", default: "EDM wire cutting for intricate shapes and tight tolerances" },
          { key: "service_5_image", label: "Service 5 Image", type: "image", default: "/images/wire-cutting.jpg" },
          { key: "service_6_title", label: "Service 6 Title", type: "text", default: "Pipe Bending" },
          { key: "service_6_desc", label: "Service 6 Description", type: "textarea", default: "Hydraulic pipe bending for automotive and industrial applications" },
          { key: "service_6_image", label: "Service 6 Image", type: "image", default: "/images/pipe-bending.jpg" },
        ],
      },
    ],
  },
  products: {
    label: "Products",
    sections: [
      {
        key: "hero", label: "Hero Banner",
        fields: [
          { key: "title", label: "Page Title", type: "text", default: "Our Products" },
          { key: "subtitle", label: "Subtitle", type: "text", default: "Precision-Engineered Components" },
          { key: "image", label: "Banner Image", type: "image", default: "/images/products-1.png" },
        ],
      },
      {
        key: "gallery", label: "Product Gallery",
        fields: [
          { key: "product_1_image", label: "Product 1 Image", type: "image", default: "/images/products-1.png" },
          { key: "product_2_image", label: "Product 2 Image", type: "image", default: "/images/products-2.png" },
          { key: "product_3_image", label: "Product 3 Image", type: "image", default: "/images/products-3.png" },
          { key: "product_4_image", label: "Product 4 Image", type: "image", default: "/images/products-4.png" },
          { key: "product_5_image", label: "Product 5 Image", type: "image", default: "/images/products-5.png" },
          { key: "product_6_image", label: "Product 6 Image", type: "image", default: "/images/products-6.png" },
          { key: "product_7_image", label: "Product 7 Image", type: "image", default: "/images/products-7.png" },
          { key: "product_8_image", label: "Product 8 Image", type: "image", default: "/images/products-8.png" },
          { key: "product_9_image", label: "Product 9 Image", type: "image", default: "/images/products-9.png" },
          { key: "product_10_image", label: "Product 10 Image", type: "image", default: "/images/products-10.png" },
        ],
      },
    ],
  },
  industries: {
    label: "Future Expansion",
    sections: [
      {
        key: "hero", label: "Hero Banner",
        fields: [
          { key: "title", label: "Page Title", type: "text", default: "Industries We Serve" },
          { key: "subtitle", label: "Subtitle", type: "text", default: "Precision Manufacturing for Diverse Sectors" },
          { key: "image", label: "Banner Image", type: "image", default: "/images/factory-overview.jpg" },
        ],
      },
      {
        key: "list", label: "Industries List",
        fields: [
          { key: "ind_1_title", label: "Industry 1 Title", type: "text", default: "Automotive" },
          { key: "ind_1_desc", label: "Industry 1 Description", type: "textarea", default: "Precision components for 2-wheeler, 4-wheeler, and commercial vehicle manufacturers" },
          { key: "ind_1_image", label: "Industry 1 Image", type: "image", default: "/images/cnc-section.jpg" },
          { key: "ind_2_title", label: "Industry 2 Title", type: "text", default: "Construction Equipment" },
          { key: "ind_2_desc", label: "Industry 2 Description", type: "textarea", default: "Heavy-duty machined parts for earthmoving and construction machinery" },
          { key: "ind_2_image", label: "Industry 2 Image", type: "image", default: "/images/welding.jpg" },
          { key: "ind_3_title", label: "Industry 3 Title", type: "text", default: "Industrial Machinery" },
          { key: "ind_3_desc", label: "Industry 3 Description", type: "textarea", default: "Custom components for specialized industrial equipment" },
          { key: "ind_3_image", label: "Industry 3 Image", type: "image", default: "/images/vmc-section.jpg" },
        ],
      },
    ],
  },
  clients: {
    label: "Awards & Clients",
    sections: [
      {
        key: "hero", label: "Hero Banner",
        fields: [
          { key: "title", label: "Page Title", type: "text", default: "Clients & Certifications" },
          { key: "image", label: "Banner Image", type: "image", default: "/images/factory-overview.jpg" },
        ],
      },
      {
        key: "certifications", label: "Certifications (4 tiles)",
        fields: [
          { key: "section_tagline", label: "Section Tagline", type: "text", default: "Quality Standards" },
          { key: "section_title", label: "Section Title", type: "text", default: "Certifications" },
          { key: "cert_1_title", label: "Certification 1 Title", type: "text", default: "ISO 9001:2015" },
          { key: "cert_1_desc", label: "Certification 1 Description", type: "textarea", default: "Certified Quality Management System ensuring consistent product quality." },
          { key: "cert_1_image", label: "Certification 1 Image", type: "image", default: "/images/logo-badge.png" },
          { key: "cert_2_title", label: "Certification 2 Title", type: "text", default: "VDA 6.3" },
          { key: "cert_2_desc", label: "Certification 2 Description", type: "textarea", default: "Currently preparing for VDA 6.3 certification for process audits." },
          { key: "cert_2_image", label: "Certification 2 Image", type: "image", default: "/images/logo-badge.png" },
          { key: "cert_3_title", label: "Certification 3 Title", type: "text", default: "IATF 16949:2016" },
          { key: "cert_3_desc", label: "Certification 3 Description", type: "textarea", default: "Preparing for IATF 16949 automotive quality management certification." },
          { key: "cert_3_image", label: "Certification 3 Image", type: "image", default: "/images/logo-badge.png" },
          { key: "cert_4_title", label: "Certification 4 Title", type: "text", default: "Additional Certification" },
          { key: "cert_4_desc", label: "Certification 4 Description", type: "textarea", default: "Add details about this certification in the admin panel." },
          { key: "cert_4_image", label: "Certification 4 Image", type: "image", default: "/images/logo-badge.png" },
        ],
      },
      {
        key: "awards", label: "Awards & Achievements (4 tiles)",
        fields: [
          { key: "award_1_title", label: "Award 1 Title", type: "text", default: "Best Quality Performance Award" },
          { key: "award_1_image", label: "Award 1 Image", type: "image", default: "/images/award-real-1.jpg" },
          { key: "award_2_title", label: "Award 2 Title", type: "text", default: "Best Quality Trophy" },
          { key: "award_2_image", label: "Award 2 Image", type: "image", default: "/images/award-real-2.jpg" },
          { key: "award_3_title", label: "Award 3 Title", type: "text", default: "Best Supplier Award" },
          { key: "award_3_image", label: "Award 3 Image", type: "image", default: "/images/award-real-3.jpg" },
          { key: "award_4_title", label: "Award 4 Title", type: "text", default: "Best Supplier Trophy" },
          { key: "award_4_image", label: "Award 4 Image", type: "image", default: "/images/award-real-4.jpg" },
        ],
      },
    ],
  },
  facility: {
    label: "Facility Tour",
    sections: [
      {
        key: "hero", label: "Hero Banner",
        fields: [
          { key: "title", label: "Page Title", type: "text", default: "Virtual Factory Tour" },
          { key: "subtitle", label: "Subtitle", type: "text", default: "Step inside our 22,000+ sq.ft. manufacturing facility" },
          { key: "image", label: "Banner Image", type: "image", default: "/images/factory-overview.jpg" },
        ],
      },
      {
        key: "sections", label: "Facility Sections",
        fields: [
          { key: "sec_1_title", label: "Section 1 Title", type: "text", default: "CNC Machining Section" },
          { key: "sec_1_desc", label: "Section 1 Description", type: "textarea", default: "15 CNC machines for high-precision turning operations and complex component manufacturing." },
          { key: "sec_1_image_1", label: "Section 1 Image", type: "image", default: "/images/cnc-section.jpg" },
          { key: "sec_1_order", label: "Section 1 Display Order", type: "text", default: "1" },

          { key: "sec_2_title", label: "Section 2 Title", type: "text", default: "Traub Machines" },
          { key: "sec_2_desc", label: "Section 2 Description", type: "textarea", default: "12 Traub machines for high-volume precision turning of fasteners and small components." },
          { key: "sec_2_image_1", label: "Section 2 Image", type: "image", default: "/images/traub-section.jpg" },
          { key: "sec_2_order", label: "Section 2 Display Order", type: "text", default: "2" },

          { key: "sec_3_title", label: "Section 3 Title", type: "text", default: "VMC Section" },
          { key: "sec_3_desc", label: "Section 3 Description", type: "textarea", default: "7 VMC machines (3-axis & 4-axis) for complex milling operations." },
          { key: "sec_3_image_1", label: "Section 3 Image", type: "image", default: "/images/vmc-section.jpg" },
          { key: "sec_3_order", label: "Section 3 Display Order", type: "text", default: "3" },

          { key: "sec_4_title", label: "Section 4 Title", type: "text", default: "Cutting Section" },
          { key: "sec_4_desc", label: "Section 4 Description", type: "textarea", default: "CNC circular saw and bandsaw machines for accurate raw material cutting." },
          { key: "sec_4_image_1", label: "Section 4 Image", type: "image", default: "/images/cutting-machine.jpg" },
          { key: "sec_4_order", label: "Section 4 Display Order", type: "text", default: "4" },

          { key: "sec_5_title", label: "Section 5 Title", type: "text", default: "Oxy-Profile Cutting Machines" },
          { key: "sec_5_desc", label: "Section 5 Description", type: "textarea", default: "Dedicated oxy-profile cutting machines for clean and accurate plate cutting." },
          { key: "sec_5_image_1", label: "Section 5 Image", type: "image", default: "/images/oxy-cutting.jpg" },
          { key: "sec_5_order", label: "Section 5 Display Order", type: "text", default: "5" },

          { key: "sec_6_title", label: "Section 6 Title", type: "text", default: "Welding Section" },
          { key: "sec_6_desc", label: "Section 6 Description", type: "textarea", default: "4 CO2 welding machines for robust welded assemblies." },
          { key: "sec_6_image_1", label: "Section 6 Image", type: "image", default: "/images/welding.jpg" },
          { key: "sec_6_order", label: "Section 6 Display Order", type: "text", default: "6" },

          { key: "sec_7_title", label: "Section 7 Title", type: "text", default: "Wire Cutting Section" },
          { key: "sec_7_desc", label: "Section 7 Description", type: "textarea", default: "Precision wire EDM machines for tooling and intricate component profiles." },
          { key: "sec_7_image_1", label: "Section 7 Image", type: "image", default: "/images/wire-cutting.jpg" },
          { key: "sec_7_order", label: "Section 7 Display Order", type: "text", default: "7" },

          { key: "sec_8_title", label: "Section 8 Title", type: "text", default: "3-Axis Pipe Bending Machines" },
          { key: "sec_8_desc", label: "Section 8 Description", type: "textarea", default: "3-axis pipe bending machines for accurate and repeatable bent pipe assemblies." },
          { key: "sec_8_image_1", label: "Section 8 Image", type: "image", default: "/images/pipe-bending.jpg" },
          { key: "sec_8_order", label: "Section 8 Display Order", type: "text", default: "8" },

          { key: "sec_9_title", label: "Section 9 Title", type: "text", default: "Quality Lab" },
          { key: "sec_9_desc", label: "Section 9 Description", type: "textarea", default: "Fully equipped with Hardness Tester, Trimos Height Gauge, Vision Measuring Machine, and more." },
          { key: "sec_9_image_1", label: "Section 9 Image", type: "image", default: "/images/quality-lab.jpg" },
          { key: "sec_9_order", label: "Section 9 Display Order", type: "text", default: "9" },

          { key: "sec_10_title", label: "Section 10 Title", type: "text", default: "Inspection Area" },
          { key: "sec_10_desc", label: "Section 10 Description", type: "textarea", default: "Final inspection tables with Quality Gate 02 for 100% inspection." },
          { key: "sec_10_image_1", label: "Section 10 Image", type: "image", default: "/images/final-inspection.jpg" },
          { key: "sec_10_order", label: "Section 10 Display Order", type: "text", default: "10" },

          { key: "sec_11_title", label: "Section 11 Title", type: "text", default: "Power Backup" },
          { key: "sec_11_desc", label: "Section 11 Description", type: "textarea", default: "250 KVA DG Set ensuring uninterrupted production." },
          { key: "sec_11_image_1", label: "Section 11 Image", type: "image", default: "/images/power-backup.png" },
          { key: "sec_11_order", label: "Section 11 Display Order", type: "text", default: "11" },

          { key: "sec_12_title", label: "Section 12 Title", type: "text", default: "" },
          { key: "sec_12_desc", label: "Section 12 Description", type: "textarea", default: "" },
          { key: "sec_12_image_1", label: "Section 12 Image", type: "image", default: "" },
          { key: "sec_12_order", label: "Section 12 Display Order", type: "text", default: "12" },

          { key: "sec_13_title", label: "Section 13 Title", type: "text", default: "" },
          { key: "sec_13_desc", label: "Section 13 Description", type: "textarea", default: "" },
          { key: "sec_13_image_1", label: "Section 13 Image", type: "image", default: "" },
          { key: "sec_13_order", label: "Section 13 Display Order", type: "text", default: "13" },

          { key: "sec_14_title", label: "Section 14 Title", type: "text", default: "" },
          { key: "sec_14_desc", label: "Section 14 Description", type: "textarea", default: "" },
          { key: "sec_14_image_1", label: "Section 14 Image", type: "image", default: "" },
          { key: "sec_14_order", label: "Section 14 Display Order", type: "text", default: "14" },
        ],
      },
    ],
  },
  contact: {
    label: "Contact",
    sections: [
      {
        key: "hero", label: "Hero Banner",
        fields: [
          { key: "title", label: "Page Title", type: "text", default: "Get In Touch" },
          { key: "subtitle", label: "Subtitle", type: "text", default: "Let's discuss your manufacturing needs" },
          { key: "image", label: "Banner Image", type: "image", default: "/images/factory-overview.jpg" },
        ],
      },
      {
        key: "info", label: "Contact Information",
        fields: [
          { key: "address", label: "Address", type: "textarea", default: "Gat No.312, Behind Sai Service, Mahalunge-Kiwale Road, Chakan, Pune — 410501" },
          { key: "contact_1_name", label: "Contact 1 Name", type: "text", default: "Rahul Dabhade" },
          { key: "contact_1_role", label: "Contact 1 Role", type: "text", default: "Director" },
          { key: "contact_1_email", label: "Contact 1 Email", type: "text", default: "rahul@shrivinayakindustries.com" },
          { key: "contact_1_phone", label: "Contact 1 Phone", type: "text", default: "+91-9767507779" },
          { key: "contact_2_name", label: "Contact 2 Name", type: "text", default: "Girish Dabhade" },
          { key: "contact_2_role", label: "Contact 2 Role", type: "text", default: "Director" },
          { key: "contact_2_email", label: "Contact 2 Email", type: "text", default: "girish@shrivinayakindustries.com" },
          { key: "contact_2_phone", label: "Contact 2 Phone", type: "text", default: "+91-7709633424" },
        ],
      },
    ],
  },
  careers: {
    label: "Careers",
    sections: [
      {
        key: "hero", label: "Hero Banner",
        fields: [
          { key: "title", label: "Page Title", type: "text", default: "Join Our Team" },
          { key: "subtitle", label: "Subtitle", type: "text", default: "Build your career with a growing manufacturing leader" },
          { key: "image", label: "Banner Image", type: "image", default: "/images/factory-overview.jpg" },
        ],
      },
      {
        key: "benefits", label: "Benefits & Culture",
        fields: [
          { key: "title", label: "Section Title", type: "text", default: "Why Shrivinayak Industries?" },
          { key: "benefit_1", label: "Benefit 1", type: "text", default: "Competitive Salary & Benefits" },
          { key: "benefit_2", label: "Benefit 2", type: "text", default: "Growth & Learning Opportunities" },
          { key: "benefit_3", label: "Benefit 3", type: "text", default: "Modern Manufacturing Facility" },
          { key: "benefit_4", label: "Benefit 4", type: "text", default: "Safety-First Work Environment" },
        ],
      },
    ],
  },
};

const ImageUploadField = ({
  value,
  onUpload,
  label,
  page,
  section,
  fieldKey,
}: {
  value: string;
  onUpload: (url: string) => void;
  label: string;
  page: string;
  section: string;
  fieldKey: string;
}) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(false);
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [pendingExt, setPendingExt] = useState<string>("png");
  // Suggested aspect: lock the navbar/footer logo to 1:1 by default; free everywhere else.
  const suggestedAspect = section === "brand" && fieldKey === "logo" ? 1 : undefined;

  const openCropperFromFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPendingExt(file.name.split(".").pop() || "png");
    const reader = new FileReader();
    reader.onload = () => setCropSrc(String(reader.result));
    reader.readAsDataURL(file);
    // reset so choosing the same file twice still fires change
    e.target.value = "";
  };

  const handleCropped = async (blob: Blob) => {
    setCropSrc(null);
    setUploading(true);
    const ext = "png"; // canvas exports PNG; keep transparent-safe
    const path = `${page}/${section}/${fieldKey}-${Date.now()}.${ext}`;
    const asFile = new File([blob], `${fieldKey}.${ext}`, { type: "image/png" });
    const url = await uploadSiteImage(asFile, path);
    if (url) {
      onUpload(url);
      toast.success("Image uploaded");
    } else {
      toast.error("Upload failed");
    }
    setUploading(false);
    void pendingExt;
  };

  return (
    <div className="space-y-2">
      <label className="text-xs md:text-sm font-medium text-foreground">{label}</label>
      <div className="flex flex-col sm:flex-row items-start gap-3">
        <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-lg border border-border bg-secondary/50 overflow-hidden flex-shrink-0">
          {value ? (
            <>
              <img src={value} alt={label} className="w-full h-full object-contain" />
              <button
                onClick={() => setPreview(true)}
                className="absolute inset-0 bg-foreground/0 hover:bg-foreground/30 transition-colors flex items-center justify-center"
              >
                <Eye size={16} className="text-primary-foreground opacity-0 hover:opacity-100" />
              </button>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Image size={24} className="text-muted-foreground" />
            </div>
          )}
        </div>
        <div className="flex-1 space-y-2">
          <input
            type="text"
            value={value}
            onChange={(e) => onUpload(e.target.value)}
            placeholder="Image URL or upload..."
            className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm"
          />
          <div className="flex gap-2">
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-accent/10 text-accent text-xs font-medium hover:bg-accent/20 transition-colors disabled:opacity-50"
            >
              <Upload size={14} />
              {uploading ? "Uploading..." : "Upload & Crop"}
            </button>
            {value && (
              <button
                onClick={() => setPreview(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-secondary text-foreground text-xs font-medium hover:bg-secondary/80 transition-colors"
              >
                <Eye size={14} /> Preview
              </button>
            )}
          </div>
          {suggestedAspect === 1 && (
            <p className="text-[11px] text-muted-foreground">
              Tip: logo is locked to 1:1 by default for crisp display in the navbar/footer. Choose "Free" in the cropper to override.
            </p>
          )}
        </div>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={openCropperFromFile} />
      </div>

      {preview && value && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/60 p-4" onClick={() => setPreview(false)}>
          <div className="relative max-w-3xl max-h-[80vh] bg-card rounded-xl overflow-hidden shadow-xl" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setPreview(false)} className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-foreground/50 text-primary-foreground hover:bg-foreground/70">
              <X size={16} />
            </button>
            <img src={value} alt={label} className="max-w-full max-h-[80vh] object-contain" />
          </div>
        </div>
      )}

      {cropSrc && (
        <LogoCropperDialog
          imageSrc={cropSrc}
          aspect={suggestedAspect}
          onCancel={() => setCropSrc(null)}
          onConfirm={handleCropped}
        />
      )}
    </div>
  );
};

const ContentManager = () => {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [localValues, setLocalValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState("home");
  const [showRawEditor, setShowRawEditor] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [seedingAll, setSeedingAll] = useState(false);
  const [extraFields, setExtraFields] = useState<Record<string, FieldDef[]>>({});
  const [newItem, setNewItem] = useState({ page: "", section: "", content_key: "", content_value: "", content_type: "text" });

  const load = async () => {
    const { data } = await supabase.from("site_content").select("*").order("page").order("section");
    const loaded = (data as ContentItem[]) ?? [];
    setItems(loaded);
    // Build local values from DB, then fill missing from defaults
    const vals: Record<string, string> = {};
    // First set defaults
    for (const [pageKey, pageDef] of Object.entries(PAGE_STRUCTURE)) {
      for (const section of pageDef.sections) {
        for (const field of section.fields) {
          if (field.default) {
            vals[`${pageKey}|${section.key}|${field.key}`] = field.default;
          }
        }
      }
    }
    // Then override with DB values
    loaded.forEach((item) => {
      vals[`${item.page}|${item.section}|${item.content_key}`] = item.content_value ?? "";
    });
    setLocalValues(vals);

    // Build extras: DB rows for known sections whose keys are not in PAGE_STRUCTURE
    const extras: Record<string, FieldDef[]> = {};
    for (const item of loaded) {
      const page = PAGE_STRUCTURE[item.page];
      if (!page) continue;
      const section = page.sections.find(s => s.key === item.section);
      if (!section) continue;
      if (section.fields.some(f => f.key === item.content_key)) continue;
      const sid = `${item.page}|${item.section}`;
      extras[sid] = extras[sid] || [];
      if (!extras[sid].some(f => f.key === item.content_key)) {
        extras[sid].push({
          key: item.content_key,
          label: item.content_key.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase()),
          type: item.content_type === "image" ? "image" : "text",
        });
      }
    }
    setExtraFields(extras);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const getFieldValue = (page: string, section: string, key: string) => {
    const mapKey = `${page}|${section}|${key}`;
    return localValues[mapKey] ?? "";
  };

  const setFieldValue = (page: string, section: string, key: string, value: string) => {
    setLocalValues(prev => ({ ...prev, [`${page}|${section}|${key}`]: value }));
  };

  const isFieldSaved = (page: string, section: string, key: string) => {
    return items.some(i => i.page === page && i.section === section && i.content_key === key);
  };

  const saveField = async (page: string, section: string, key: string, type: string = "text") => {
    const savingKey = `${page}|${section}|${key}`;
    setSaving(prev => ({ ...prev, [savingKey]: true }));
    const value = getFieldValue(page, section, key);
    const success = await upsertContent(page, section, key, value, type);
    if (success) {
      toast.success(`Saved: ${key}`);
      await load();
    } else {
      toast.error("Failed to save");
    }
    setSaving(prev => ({ ...prev, [savingKey]: false }));
  };

  const saveSection = async (page: string, sectionKey: string, fields: FieldDef[]) => {
    let allSuccess = true;
    for (const field of fields) {
      const value = getFieldValue(page, sectionKey, field.key);
      const contentType = field.type === "image" ? "image" : "text";
      const success = await upsertContent(page, sectionKey, field.key, value, contentType);
      if (!success) allSuccess = false;
    }
    if (allSuccess) {
      toast.success("Section saved successfully");
      await load();
    } else {
      toast.error("Some fields failed to save");
    }
  };

  const seedAllDefaults = async () => {
    setSeedingAll(true);
    let count = 0;
    let errors = 0;
    for (const [pageKey, pageDef] of Object.entries(PAGE_STRUCTURE)) {
      for (const section of pageDef.sections) {
        const fields = [...section.fields, ...(extraFields[`${pageKey}|${section.key}`] ?? [])];
        for (const field of fields) {
          const value = getFieldValue(pageKey, section.key, field.key);
          if (!value) continue;
          const contentType = field.type === "image" ? "image" : "text";
          const success = await upsertContent(pageKey, section.key, field.key, value, contentType);
          if (success) count++;
          else errors++;
        }
      }
    }
    toast.success(`Saved ${count} content entries${errors ? ` (${errors} errors)` : ""}`);
    await load();
    setSeedingAll(false);
  };

  const toggleSection = (key: string) => {
    setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const addItem = async () => {
    const { error } = await supabase.from("site_content").insert(newItem);
    if (error) { toast.error(error.message); return; }
    toast.success("Content added");
    setNewItem({ page: "", section: "", content_key: "", content_value: "", content_type: "text" });
    setShowAdd(false);
    load();
  };

  const handleDeleteItem = async (id: string) => {
    const success = await deleteContent(id);
    if (success) { toast.success("Deleted"); load(); }
    else toast.error("Failed to delete");
  };

  const pageKeys = Object.keys(PAGE_STRUCTURE);

  const getSectionFields = (pageKey: string, section: SectionDef): FieldDef[] => {
    const extras = extraFields[`${pageKey}|${section.key}`] ?? [];
    return [...section.fields, ...extras];
  };

  const addGalleryImage = (pageKey: string, sectionKey: string) => {
    const sid = `${pageKey}|${sectionKey}`;
    const existing = [
      ...(PAGE_STRUCTURE[pageKey].sections.find(s => s.key === sectionKey)?.fields ?? []),
      ...(extraFields[sid] ?? []),
    ];
    const nums = existing
      .map(f => f.key.match(/^product_(\d+)_image$/))
      .filter(Boolean)
      .map(m => parseInt(m![1], 10));
    const next = (nums.length ? Math.max(...nums) : 0) + 1;
    const key = `product_${next}_image`;
    setExtraFields(prev => ({
      ...prev,
      [sid]: [...(prev[sid] ?? []), { key, label: `Product ${next} Image`, type: "image" }],
    }));
    setLocalValues(prev => ({ ...prev, [`${pageKey}|${sectionKey}|${key}`]: "" }));
    toast.success(`Added new image slot: ${key}`);
  };

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display font-bold text-xl md:text-2xl">Content Management</h1>
          <p className="text-xs md:text-sm text-muted-foreground mt-1">Edit all website text and images.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={seedAllDefaults}
            disabled={seedingAll}
            className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg bg-accent text-accent-foreground text-xs md:text-sm font-medium hover:bg-accent/90 transition-colors disabled:opacity-50"
          >
            <Database size={16} />
            {seedingAll ? "Saving..." : "Save All"}
          </button>
          <button
            onClick={() => setShowRawEditor(!showRawEditor)}
            className={`px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition-colors ${showRawEditor ? "bg-accent text-accent-foreground" : "bg-secondary text-foreground hover:bg-secondary/80"}`}
          >
            {showRawEditor ? "Visual" : "Raw"}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent" />
        </div>
      ) : showRawEditor ? (
        <div>
          <div className="flex justify-end mb-4">
            <button onClick={() => setShowAdd(!showAdd)} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-accent-foreground text-sm font-medium hover:bg-accent/90">
              <Plus size={16} /> Add Entry
            </button>
          </div>
          {showAdd && (
            <div className="bg-card rounded-xl p-6 border border-border mb-6 space-y-4">
              <div className="grid sm:grid-cols-3 gap-4">
                <input placeholder="Page" value={newItem.page} onChange={(e) => setNewItem({ ...newItem, page: e.target.value })} className="px-3 py-2 rounded-lg border border-input bg-background text-sm" />
                <input placeholder="Section" value={newItem.section} onChange={(e) => setNewItem({ ...newItem, section: e.target.value })} className="px-3 py-2 rounded-lg border border-input bg-background text-sm" />
                <input placeholder="Key" value={newItem.content_key} onChange={(e) => setNewItem({ ...newItem, content_key: e.target.value })} className="px-3 py-2 rounded-lg border border-input bg-background text-sm" />
              </div>
              <textarea placeholder="Value" value={newItem.content_value} onChange={(e) => setNewItem({ ...newItem, content_value: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm resize-none" rows={3} />
              <div className="flex gap-2">
                <select value={newItem.content_type} onChange={(e) => setNewItem({ ...newItem, content_type: e.target.value })} className="px-3 py-2 rounded-lg border border-input bg-background text-sm">
                  <option value="text">Text</option>
                  <option value="image">Image</option>
                </select>
                <button onClick={addItem} className="px-4 py-2 rounded-lg bg-accent text-accent-foreground text-sm font-medium">Save</button>
              </div>
            </div>
          )}
          {[...new Set(items.map(i => i.page))].map(page => (
            <div key={page} className="mb-8">
              <h2 className="font-display font-bold text-lg mb-3 capitalize">{page}</h2>
              <div className="space-y-3">
                {items.filter(i => i.page === page).map(item => (
                  <div key={item.id} className="bg-card rounded-lg p-4 border border-border flex flex-col sm:flex-row gap-3 items-start">
                    <div className="flex-shrink-0 w-40">
                      <p className="text-xs text-muted-foreground">{item.section}</p>
                      <p className="font-medium text-sm">{item.content_key}</p>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-secondary text-muted-foreground">{item.content_type}</span>
                    </div>
                    {item.content_type === "image" ? (
                      <div className="flex-1 flex items-center gap-3">
                        {item.content_value && <img src={item.content_value} alt="" className="w-16 h-16 object-cover rounded" />}
                        <input
                          value={item.content_value ?? ""}
                          onChange={(e) => setItems(items.map(i => i.id === item.id ? { ...i, content_value: e.target.value } : i))}
                          className="flex-1 px-3 py-2 rounded-lg border border-input bg-background text-sm"
                        />
                      </div>
                    ) : (
                      <textarea
                        value={item.content_value ?? ""}
                        onChange={(e) => setItems(items.map(i => i.id === item.id ? { ...i, content_value: e.target.value } : i))}
                        className="flex-1 px-3 py-2 rounded-lg border border-input bg-background text-sm resize-none w-full"
                        rows={2}
                      />
                    )}
                    <div className="flex gap-2 flex-shrink-0">
                      <button onClick={async () => {
                        await supabase.from("site_content").update({ content_value: item.content_value }).eq("id", item.id);
                        toast.success("Saved");
                      }} className="p-2 rounded-lg bg-accent/10 text-accent hover:bg-accent/20"><Save size={16} /></button>
                      <button onClick={() => handleDeleteItem(item.id)} className="p-2 rounded-lg hover:bg-destructive/10 text-destructive"><Trash2 size={16} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="flex flex-wrap gap-1 h-auto p-1 mb-4 md:mb-6 bg-secondary overflow-x-auto">
            {pageKeys.map(key => (
              <TabsTrigger key={key} value={key} className="text-xs md:text-sm capitalize whitespace-nowrap">
                {PAGE_STRUCTURE[key].label}
              </TabsTrigger>
            ))}
          </TabsList>

          {pageKeys.map(pageKey => (
            <TabsContent key={pageKey} value={pageKey} className="space-y-4">
              {PAGE_STRUCTURE[pageKey].sections.map(section => {
                const sectionId = `${pageKey}-${section.key}`;
                const isExpanded = expandedSections[sectionId] !== false;
                const sectionFields = getSectionFields(pageKey, section);
                const savedCount = sectionFields.filter(f => isFieldSaved(pageKey, section.key, f.key)).length;
                const isProductGallery = pageKey === "products" && section.key === "gallery";

                return (
                  <div key={sectionId} className="bg-card rounded-xl border border-border overflow-hidden">
                    <button
                      onClick={() => toggleSection(sectionId)}
                      className="w-full flex items-center justify-between p-5 hover:bg-secondary/30 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                        <h3 className="font-display font-bold text-base">{section.label}</h3>
                        <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded">
                          {savedCount}/{sectionFields.length} saved
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {isProductGallery && (
                          <button
                            onClick={(e) => { e.stopPropagation(); addGalleryImage(pageKey, section.key); }}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-secondary text-foreground text-xs md:text-sm font-medium hover:bg-secondary/80 transition-colors"
                          >
                            <Plus size={14} /> Add Image
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            saveSection(pageKey, section.key, sectionFields);
                          }}
                          className="flex items-center gap-1.5 px-3 md:px-4 py-2 rounded-lg bg-accent text-accent-foreground text-xs md:text-sm font-medium hover:bg-accent/90 transition-colors"
                        >
                          <Save size={14} /> Save Section
                        </button>
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="px-5 pb-5 space-y-5 border-t border-border pt-5">
                        {sectionFields.map(field => {
                          const saved = isFieldSaved(pageKey, section.key, field.key);
                          return (
                            <div key={field.key}>
                              {field.type === "image" ? (
                                <div>
                                  <ImageUploadField
                                    value={getFieldValue(pageKey, section.key, field.key)}
                                    onUpload={(url) => setFieldValue(pageKey, section.key, field.key, url)}
                                    label={field.label}
                                    page={pageKey}
                                    section={section.key}
                                    fieldKey={field.key}
                                  />
                                  {!saved && (
                                    <p className="text-[11px] text-amber-600 mt-1">⚠ Default value — click "Save Section" to persist</p>
                                  )}
                                </div>
                              ) : field.type === "textarea" ? (
                                <div className="space-y-1.5">
                                  <div className="flex items-center gap-2">
                                    <label className="text-sm font-medium text-foreground">{field.label}</label>
                                    {!saved && <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-700">default</span>}
                                  </div>
                                  <textarea
                                    value={getFieldValue(pageKey, section.key, field.key)}
                                    onChange={(e) => setFieldValue(pageKey, section.key, field.key, e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm resize-none"
                                    rows={3}
                                    placeholder={`Enter ${field.label.toLowerCase()}...`}
                                  />
                                </div>
                              ) : (
                                <div className="space-y-1.5">
                                  <div className="flex items-center gap-2">
                                    <label className="text-sm font-medium text-foreground">{field.label}</label>
                                    {!saved && <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-700">default</span>}
                                  </div>
                                  <div className="flex gap-2">
                                    <input
                                      type="text"
                                      value={getFieldValue(pageKey, section.key, field.key)}
                                      onChange={(e) => setFieldValue(pageKey, section.key, field.key, e.target.value)}
                                      className="flex-1 px-3 py-2 rounded-lg border border-input bg-background text-sm"
                                      placeholder={`Enter ${field.label.toLowerCase()}...`}
                                    />
                                    <button
                                      onClick={() => saveField(pageKey, section.key, field.key)}
                                      disabled={saving[`${pageKey}|${section.key}|${field.key}`]}
                                      className="p-2 rounded-lg bg-accent/10 text-accent hover:bg-accent/20 transition-colors disabled:opacity-50"
                                    >
                                      <Save size={16} />
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </TabsContent>
          ))}
        </Tabs>
      )}
    </AdminLayout>
  );
};

export default ContentManager;
