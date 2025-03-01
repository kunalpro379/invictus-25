import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";

export function TestimonialSection() {
  const testimonials = [
    {
      quote:
        "This starter kit saved us hours of setup time. We were able to focus on building our core features right from the start.",
      author: "Alex Johnson",
      role: "Frontend Developer",
      avatar: "AJ",
    },
    {
      quote:
        "The authentication components worked flawlessly. Clean code and great UX out of the box.",
      author: "Sarah Chen",
      role: "UX Designer",
      avatar: "SC",
    },
    {
      quote:
        "We won our hackathon thanks to this starter kit. The modern UI components impressed the judges.",
      author: "Michael Rodriguez",
      role: "Full Stack Developer",
      avatar: "MR",
    },
  ];

  return (
    <section className="w-full py-16 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900">
      <div className="container px-4 md:px-6 mx-auto text-center">
        <div className="space-y-2">
          <div className="inline-block rounded-lg bg-gray-200 dark:bg-gray-800 px-4 py-1 text-sm font-medium">
            Testimonials
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white md:text-4xl">
            Loved by Developers
          </h2>
          <p className="max-w-2xl mx-auto text-gray-600 dark:text-gray-300 md:text-lg">
            Don't just take our word for it. Here's what others have to say about our starter kit.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-3 lg:gap-12 pt-10">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="flex flex-col items-center space-y-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-md transition-transform duration-300 hover:scale-105"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
            >
              <p className="text-gray-700 dark:text-gray-300 italic text-center">
                "{testimonial.quote}"
              </p>
              <div className="flex items-center space-x-4">
                <Avatar className="w-12 h-12 shadow-lg">
                  <AvatarImage src={`/placeholder.svg?height=40&width=40&text=${testimonial.avatar}`} />
                  <AvatarFallback className="bg-blue-500 text-white">
                    {testimonial.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="text-left">
                  <h4 className="font-semibold text-gray-900 dark:text-white">{testimonial.author}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
