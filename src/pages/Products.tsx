import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import ScrollReveal from "@/components/ScrollReveal";

const products = [
  "/images/products-1.png",
  "/images/products-2.png",
  "/images/products-3.png",
  "/images/products-4.png",
  "/images/products-5.png",
  "/images/products-6.png",
  "/images/products-7.png",
  "/images/products-8.png",
  "/images/products-9.png",
  "/images/products-10.png",
];

const Products = () => (
  <Layout>
    <section className="relative h-[50vh] min-h-[350px] flex items-center">
      <div className="absolute inset-0">
        <img src="/images/products-1.png" alt="Products" className="image-cover" />
        <div className="absolute inset-0 overlay-gradient" />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 w-full">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-px w-12 bg-highlight" />
          <span className="text-highlight text-sm font-semibold uppercase tracking-widest">Gallery</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-display font-extrabold text-primary-foreground">Products Gallery</h1>
      </div>
    </section>

    <section className="section-padding bg-background">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-12">
            <p className="section-subtitle mx-auto">
              Explore our range of precision machined components, welded assemblies, and fasteners manufactured for global clients.
            </p>
          </div>
        </ScrollReveal>
        <div className="masonry-grid">
          {products.map((img, i) => (
            <ScrollReveal key={i} delay={i * 0.05}>
              <div className="card-industrial group relative overflow-hidden cursor-pointer">
                <img src={img} alt={`Product ${i + 1}`} className="w-full transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/60 transition-all duration-300 flex items-center justify-center">
                  <Link
                    to="/contact"
                    className="opacity-0 group-hover:opacity-100 transition-opacity bg-highlight text-accent-foreground px-6 py-2 rounded-md text-sm font-semibold"
                  >
                    Request Quote
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  </Layout>
);

export default Products;
