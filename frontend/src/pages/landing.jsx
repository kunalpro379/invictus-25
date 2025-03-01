import { HeroSection } from "@/components/landing-page/hero-section";
import { FeatureSection } from "@/components/landing-page/feature-section";
import { TestimonialSection } from "@/components/landing-page/testimonial-section";
import { CTASection } from "@/components/landing-page/cta-section";
import { Footer } from "@/components/landing-page/footer";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Header Section */}
      <header className="bg-blue-950/20 px-4 lg:px-6 h-16 flex items-center justify-center border-b shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <a href="/" className="flex items-center text-2xl font-bold tracking-wide text-blue-900 dark:text-white">
            Hackathon Starter
          </a>

          {/* Navigation Links */}
          <nav className="hidden md:flex gap-6">
            <a href="#features" className="text-sm font-medium transition duration-300 hover:text-blue-600 dark:hover:text-blue-400">
              Features
            </a>
            <a href="#testimonials" className="text-sm font-medium transition duration-300 hover:text-blue-600 dark:hover:text-blue-400">
              Testimonials
            </a>
            <a href="#pricing" className="text-sm font-medium transition duration-300 hover:text-blue-600 dark:hover:text-blue-400">
              Pricing
            </a>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-4">
            <Button className="px-4 py-2 bg-transparent border border-gray-800 dark:border-white text-gray-800 dark:text-white hover:bg-gray-800 hover:text-white dark:hover:bg-white dark:hover:text-gray-800 transition">
              <a href="/login">Login</a>
            </Button>

            <Button className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition">
              <a href="/signup">Sign Up</a>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <HeroSection />
        <FeatureSection />
        <TestimonialSection />
        <CTASection />
      </main>

      {/* Footer Section */}
      <Footer />
    </div>
  );
}
