import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";

export function TestimonialSection() {
  const testimonials = [
    {
      quote: "This starter kit is absolutely phenomenal! The code quality and components are top-notch. Saved us weeks of development time.",
      author: "Alex Johnson",
      role: "Senior Developer at Google",
      avatar: "https://randomuser.me/api/portraits/men/1.jpg",
      company: "google.com",
    },
    {
      quote: "The most beautiful and well-structured starter kit I've ever used. Perfect for hackathons and rapid prototyping.",
      author: "Sarah Chen",
      role: "Tech Lead at Microsoft",
      avatar: "https://randomuser.me/api/portraits/women/2.jpg",
      company: "microsoft.com",
    },
    {
      quote: "Won first place in our hackathon using this! The modern UI components and animations really set our project apart.",
      author: "Michael Rodriguez",
      role: "Founder at TechStart",
      avatar: "https://randomuser.me/api/portraits/men/3.jpg",
      company: "techstart.io",
    },
  ];

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800" />
      <div className="absolute inset-0 bg-grid-gray-100/[0.2] bg-[size:20px_20px]" />
      
      <div className="container relative px-4 mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.span 
            className="inline-block px-4 py-2 mb-4 text-sm font-semibold tracking-wider text-blue-600 uppercase bg-blue-100 rounded-full dark:bg-blue-900/30"
            whileHover={{ scale: 1.05 }}
          >
            Testimonials
          </motion.span>
          <h2 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white md:text-5xl">
            Loved by Developers
          </h2>
          <p className="mx-auto text-xl text-gray-600 dark:text-gray-300 md:max-w-xl">
            Join thousands of developers who are already building amazing projects with our starter kit
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              whileHover={{ y: -5 }}
              className="relative p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl dark:shadow-gray-800/50"
            >
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 opacity-5 rounded-full blur-2xl" />
              
              <div className="relative">
                {/* Content inside the div */}
              </div>
                <svg className="w-10 h-10 mb-4 text-blue-500 opacity-20" fill="currentColor" viewBox="0 0 32 32">
                  <path d="M16 0C7.16 0 0 7.16 0 16s7.16 16 16 16 16-7.16 16-16S24.84 0 16 0zm6.4 14.4h-3.2v3.2h3.2v3.2h-6.4v-9.6h6.4v3.2zm-9.6 0h-3.2v3.2h3.2v3.2H6.4v-9.6h6.4v3.2z"/>
                </svg>
                
                <p className="mb-6 text-lg italic text-gray-700 dark:text-gray-300">
                  "{testimonial.quote}"
                </p>

                <div className="flex items-center gap-4">
                  <Avatar className="w-12 h-12 border-2 border-white shadow-lg">
                    <AvatarImage src={testimonial.avatar} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600">
                      {testimonial.author.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {testimonial.author}
                    </h4>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <span>{testimonial.role}</span>
                      <span>•</span>
                      <a href={`https://${testimonial.company}`} className="hover:text-blue-600">
                        {testimonial.company}
                      </a>
                    </div>
                  </div>
                </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
