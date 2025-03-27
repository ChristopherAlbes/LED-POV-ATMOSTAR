import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function CTASection() {
  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="py-20 bg-primary-700 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="w-full h-full bg-primary-900"></div>
      </div>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-200 to-transparent opacity-30"></div>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-200 to-transparent opacity-30"></div>
      
      <motion.div 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-800 text-primary-100">
            Limited Time Offer
          </span>
          <h2 className="mt-4 text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Join the waitlist today</span>
            <span className="block text-primary-200">Get 50% off at launch</span>
          </h2>
          <p className="mt-6 text-xl text-primary-100">
            Sign up now to secure your spot and be the first to experience our revolutionary product.
          </p>
          <div className="mt-10">
            <Button 
              onClick={() => scrollToSection('waitlist')}
              size="lg"
              className="inline-flex items-center px-6 py-3 shadow-sm text-primary-700 bg-white hover:bg-primary-50 transition duration-150"
            >
              Join the Waitlist
              <svg className="ml-2 -mr-1 w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
