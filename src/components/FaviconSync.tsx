import { useEffect } from "react";
import { useCmsPage } from "@/hooks/useCmsPage";

const navbarDefaults: Record<string, Record<string, string>> = {
  brand: {
    logo: "/images/logo.jpg",
    name_line1: "Shrivinayak",
    name_line2: "Industries",
    alt: "Shrivinayak Industries",
  },
};

/**
 * Keeps <link rel="icon"> and document.title in sync with the CMS navbar brand.
 * Renders nothing.
 */
const FaviconSync = () => {
  const { get } = useCmsPage("navbar", navbarDefaults);
  const logo = get("brand", "logo");
  const name = `${get("brand", "name_line1")} ${get("brand", "name_line2")}`.trim();

  useEffect(() => {
    if (!logo) return;
    const head = document.head;
    // Remove any existing icon links (favicon.ico default + any prior injections)
    head.querySelectorAll("link[rel~='icon']").forEach((el) => el.parentNode?.removeChild(el));
    const link = document.createElement("link");
    link.rel = "icon";
    link.href = logo;
    head.appendChild(link);
    const apple = document.createElement("link");
    apple.rel = "apple-touch-icon";
    apple.href = logo;
    head.appendChild(apple);
  }, [logo]);

  useEffect(() => {
    if (name) document.title = name;
  }, [name]);

  return null;
};

export default FaviconSync;