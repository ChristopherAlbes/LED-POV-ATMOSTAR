import { motion } from "framer-motion";
import { 
  Zap, 
  Shield, 
  Palette, 
  Cloud, 
  BarChart2, 
  Users
} from "lucide-react";

export default function Features() {
  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Lightning Fast",
      description: "Experience incredible speed and performance with our optimized technology.",
      bgColor: "bg-primary-100",
      textColor: "text-primary-600"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Enterprise Security",
      description: "Rest easy knowing your data is protected with military-grade encryption.",
      bgColor: "bg-emerald-100",
      textColor: "text-emerald-600"
    },
    {
      icon: <Palette className="w-6 h-6" />,
      title: "Beautiful Design",
      description: "Enjoy a clean, intuitive interface that makes complex tasks simple.",
      bgColor: "bg-amber-100",
      textColor: "text-amber-600"
    },
    {
      icon: <Cloud className="w-6 h-6" />,
      title: "Cloud Integration",
      description: "Access your data from anywhere with seamless cloud synchronization.",
      bgColor: "bg-primary-100",
      textColor: "text-primary-600"
    },
    {
      icon: <BarChart2 className="w-6 h-6" />,
      title: "Advanced Analytics",
      description: "Gain valuable insights with comprehensive data analysis tools.",
      bgColor: "bg-emerald-100",
      textColor: "text-emerald-600"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Team Collaboration",
      description: "Work together seamlessly with integrated collaboration features.",
      bgColor: "bg-amber-100",
      textColor: "text-amber-600"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const featureVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-base font-semibold text-primary-600 tracking-wide uppercase">Features</h2>
          <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">Everything you need to succeed</p>
          <p className="mt-4 text-xl text-gray-500">Our product combines powerful features with an intuitive interface to help you achieve more.</p>
        </div>

        <motion.div 
          className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              className="bg-white p-8 border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition duration-300 ease-in-out"
              variants={featureVariants}
            >
              <div className={`w-12 h-12 rounded-full ${feature.bgColor} flex items-center justify-center ${feature.textColor} mb-5`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
