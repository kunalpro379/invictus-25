import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="text-gray-900 w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-white to-gray-100">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
              Your Ultimate Hackathon Starter Kit
            </h1>
            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
              Get ahead of the competition with our pre-built components and templates. Start building your project in
              minutes, not hours.
            </p>
          </div>
          <div className="space-x-4">
            <Button size="lg" className="px-8 bg-blue-600 text-white ">
              Get Started
            </Button>
            <Button size="lg" variant="outline" className="px-8 bg-blue-600 text-white ">
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

