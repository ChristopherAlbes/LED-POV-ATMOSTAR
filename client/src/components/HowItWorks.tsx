import { motion } from "framer-motion";

export default function HowItWorks() {
  const steps = [
    {
      number: 1,
      title: "Sign Up",
      description: "Join our waitlist to get early access when we launch. We'll notify you as soon as we're ready."
    },
    {
      number: 2,
      title: "Early Access",
      description: "Get priority access to our product before the general public. Be among the first to experience it."
    },
    {
      number: 3,
      title: "Special Offer",
      description: "Waitlist members receive exclusive pricing and bonuses not available to the general public."
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-base font-semibold text-primary-600 tracking-wide uppercase">How It Works</h2>
          <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">Simple, powerful, effective</p>
          <p className="mt-4 text-xl text-gray-500">Our streamlined workflow helps you get more done in less time.</p>
        </div>

        <div className="mt-16">
          <div className="relative">
            {/* Timeline line */}
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gray-200"></div>
            
            {/* Steps */}
            <div className="space-y-12 md:space-y-0">
              {steps.map((step, index) => (
                <motion.div 
                  key={index}
                  className={`relative md:flex items-center justify-between ${index % 2 === 1 ? 'md:flex-row' : 'md:flex-row-reverse'} ${index > 0 ? 'md:mt-24' : ''}`}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                >
                  <div className="hidden md:block w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center border-4 border-white absolute left-1/2 transform -translate-x-1/2 z-10">
                    <span className="text-primary-700 font-bold text-xl">{step.number}</span>
                  </div>
                  <div className={`md:w-5/12 p-6 bg-white rounded-xl shadow-sm relative md:mt-0 ${index % 2 === 1 ? '' : ''}`}>
                    <div className="md:hidden w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                      <span className="text-primary-700 font-bold">{step.number}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{step.title}</h3>
                    <p className="mt-2 text-gray-600">{step.description}</p>
                  </div>
                  <div className="hidden md:block md:w-5/12"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
