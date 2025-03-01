import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function CTASection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Ready to Build Your Next Project?</h2>
            <p className="mx-auto max-w-[600px] text-primary-foreground/80 md:text-xl/relaxed">
              Join thousands of developers who are already using our starter kit to build amazing projects.
            </p>
          </div>
          <div className="mx-auto w-full max-w-sm space-y-2">
            <form className="flex flex-col sm:flex-row gap-2">
              <Input
                type="email"
                placeholder="Enter your email"
                className="max-w-lg flex-1 bg-primary-foreground text-primary placeholder:text-primary/50"
              />
              <Button type="submit" variant="secondary">
                Get Started
              </Button>
            </form>
            <p className="text-xs text-primary-foreground/60">
              By subscribing, you agree to our terms and privacy policy.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

