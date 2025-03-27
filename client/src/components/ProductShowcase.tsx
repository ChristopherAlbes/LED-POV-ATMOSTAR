import { motion } from "framer-motion";
import { 
  Button 
} from "@/components/ui/button";
import { Check } from "lucide-react";

export default function ProductShowcase() {
  const features = [
    {
      title: "AI-Powered Analysis",
      description: "Get intelligent insights automatically"
    },
    {
      title: "Seamless Integration",
      description: "Works with your existing tools"
    },
    {
      title: "Real-time Updates",
      description: "Always stay informed with instant notifications"
    },
    {
      title: "Cross-Platform Support",
      description: "Use it anywhere, on any device"
    }
  ];

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
          <motion.div 
            className="relative lg:order-2 mb-12 lg:mb-0"
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative z-10">
              <div className="mx-auto rounded-xl shadow-2xl max-w-full bg-primary-600/80 h-[400px] flex items-center justify-center text-white">
                <svg className="w-32 h-32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="24" height="24" rx="4" fill="currentColor" fillOpacity="0.2"/>
                  <path d="M6 12L10 16L18 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            <div className="absolute inset-0 transform translate-x-6 translate-y-6">
              <div className="absolute inset-0 bg-primary-200 rounded-xl opacity-30 blur-lg"></div>
            </div>
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-amber-500/20 rounded-full filter blur-xl"></div>
          </motion.div>
          <motion.div 
            className="lg:order-1"
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
          >
            <div className="md:pr-8">
              <h2 className="text-base font-semibold text-primary-600 tracking-wide uppercase">Advanced Technology</h2>
              <p className="mt-2 text-3xl font-extrabold text-gray-900">Designed for the modern world</p>
              <p className="mt-4 text-lg text-gray-500">
                Our product combines cutting-edge technology with intuitive design to help you achieve more than ever before.
              </p>

              <ul className="mt-8 space-y-4">
                {features.map((feature, index) => (
                  <motion.li 
                    key={index} 
                    className="flex items-start"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <div className="flex-shrink-0">
                      <Check className="h-6 w-6 text-green-500" />
                    </div>
                    <p className="ml-3 text-base text-gray-700">
                      <strong className="font-medium text-gray-900">{feature.title}</strong> - {feature.description}
                    </p>
                  </motion.li>
                ))}
              </ul>

              <div className="mt-10">
                <Button 
                  onClick={() => scrollToSection('waitlist')}
                  className="inline-flex items-center px-5 py-3 shadow-sm text-white bg-primary-600 hover:bg-primary-700"
                >
                  Get Early Access
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
