import { HeroSection } from "@/components/landing-page/hero-section"
import { FeatureSection } from "@/components/landing-page/feature-section"
import { TestimonialSection } from "@/components/landing-page/testimonial-section"
import { CTASection } from "@/components/landing-page/cta-section"
import { Footer } from "@/components/landing-page/footer"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b">
        <div className="container mx-auto flex justify-between items-center">
          <a href="/" className="flex items-center">
            <span className="font-bold text-xl">Hackathon Starter</span>
          </a>
          <nav className="hidden md:flex gap-6">
            <a href="#features" className="text-sm font-medium hover:underline underline-offset-4">
              Features
            </a>
            <a href="#testimonials" className="text-sm font-medium hover:underline underline-offset-4">
              Testimonials
            </a>
            <a href="#pricing" className="text-sm font-medium hover:underline underline-offset-4">
              Pricing
            </a>
          </nav>
          <div className="flex justify-center items-center gap-4">
            <a href="/login" className="text-sm font-medium hover:underline underline-offset-4">
              Login
            </a>
            <a
              href="/signup"
              className="text-sm font-medium bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
            >
              Sign Up
            </a>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <HeroSection />
        <FeatureSection />
        <TestimonialSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}

