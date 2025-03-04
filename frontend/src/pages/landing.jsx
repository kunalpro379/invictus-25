import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { HeroSection } from "@/components/landing-page/hero-section";
import { FeatureSection } from "@/components/landing-page/feature-section";
import { TestimonialSection } from "@/components/landing-page/testimonial-section";
import { CTASection } from "@/components/landing-page/cta-section";
import { Footer } from "@/components/landing-page/footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "Features", id: "features" },
    { label: "Testimonials", id: "testimonials" },
    { label: "Contact Us", id: "contact" }
  ];

  // Smooth scroll function
  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      window.scrollTo({
        top: section.offsetTop - 80, // Adjusted for fixed navbar height
        behavior: "smooth"
      });
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <header className="bg-blue-950 fixed w-full z-50 transition-all duration-300">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <motion.div whileHover={{ scale: 1.05 }}>
            <Link to="/" className="flex items-center space-x-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur-sm opacity-80" />
                <div className="relative h-12 w-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">R</span>
                </div>
              </div>
              <span className="text-xl font-bold transition-colors duration-300 text-white">
                ReSync
              </span>
            </Link>
          </motion.div>

          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <button
                  onClick={() => scrollToSection(item.id)}
                  className={`text-sm font-medium transition-colors duration-300 ${
                    scrolled ? "text-gray-400 hover:text-blue-400" : "text-white/90 hover:text-white"
                  }`}
                >
                  {item.label}
                </button>
              </motion.div>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/login">
                <Button
                  variant="outline"
                  className={`border-2 transition-colors duration-300 ${
                    scrolled ? "border-gray-300 text-gray-100 hover:bg-gray-100" : "border-white text-white hover:bg-white/10"
                  }`}
                >
                  Login
                </Button>
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/signup">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                  Get Started
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </header>

      <main className="flex-1 pt-20">
        <HeroSection />
        <div className="relative" id="features">
          <div className="absolute inset-0 bg-gradient-to-b from-white to-gray-50 -skew-y-3 -z-10 transform" />
          <FeatureSection />
        </div>
        <div id="testimonials">
          <TestimonialSection />
        </div>
        <div id="pricing">
          <CTASection />
        </div>
        <div id="contact">
          <Footer />
        </div>
      </main>
    </div>
  );
}
