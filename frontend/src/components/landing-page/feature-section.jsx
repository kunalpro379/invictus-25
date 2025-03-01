import { Code, Cpu, Layers, Zap } from "lucide-react"

export function FeatureSection() {
  const features = [
    {
      icon: <Zap className="h-10 w-10 text-primary" />,
      title: "Lightning Fast Setup",
      description: "Get your project up and running in minutes with our pre-configured templates and components.",
    },
    {
      icon: <Layers className="h-10 w-10 text-primary" />,
      title: "Modern UI Components",
      description: "Beautiful, responsive components built with Tailwind CSS and shadcn/ui for a polished look.",
    },
    {
      icon: <Code className="h-10 w-10 text-primary" />,
      title: "Developer Friendly",
      description: "Clean, well-structured code that's easy to customize and extend for your specific needs.",
    },
    {
      icon: <Cpu className="h-10 w-10 text-primary" />,
      title: "Performance Optimized",
      description: "Built with performance in mind, ensuring your application runs smoothly even under load.",
    },
  ]

  return (
    <section className="text-black w-full py-12 md:py-24 lg:py-32 bg-white">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-gray-100 px-3 py-1 text-sm">Features</div>
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Everything You Need</h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Our starter kit includes all the essential components and features you need to build a successful
              hackathon project.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:gap-12 py-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm transition-all hover:shadow-md"
            >
              <div className="p-2 rounded-full bg-gray-100">{feature.icon}</div>
              <h3 className="text-xl font-bold">{feature.title}</h3>
              <p className="text-gray-500 text-center">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

