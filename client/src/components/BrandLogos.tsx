import { motion } from "framer-motion";

export default function BrandLogos() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const logoVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm font-medium text-gray-500 uppercase tracking-wider mb-6">Trusted by innovative teams</p>
        <motion.div 
          className="grid grid-cols-2 gap-8 md:grid-cols-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.div className="col-span-1 flex justify-center items-center grayscale opacity-70 hover:opacity-100 transition duration-300" variants={logoVariants}>
            <svg className="h-8" viewBox="0 0 100 30" fill="currentColor">
              <path d="M20 10h-5v5h5v-5zM35 10h-5v5h5v-5zM50 10h-5v5h5v-5zM65 10h-5v5h5v-5zM80 10h-5v5h5v-5z"/>
            </svg>
          </motion.div>
          <motion.div className="col-span-1 flex justify-center items-center grayscale opacity-70 hover:opacity-100 transition duration-300" variants={logoVariants}>
            <svg className="h-8" viewBox="0 0 100 30" fill="currentColor">
              <circle cx="25" cy="15" r="10"/>
              <rect x="45" y="5" width="20" height="20" rx="5"/>
              <path d="M75 5l10 10-10 10-10-10z"/>
            </svg>
          </motion.div>
          <motion.div className="col-span-1 flex justify-center items-center grayscale opacity-70 hover:opacity-100 transition duration-300" variants={logoVariants}>
            <svg className="h-8" viewBox="0 0 100 30" fill="currentColor">
              <path d="M30 5h40v20h-40z"/>
            </svg>
          </motion.div>
          <motion.div className="col-span-1 flex justify-center items-center grayscale opacity-70 hover:opacity-100 transition duration-300" variants={logoVariants}>
            <svg className="h-8" viewBox="0 0 100 30" fill="currentColor">
              <circle cx="50" cy="15" r="15"/>
            </svg>
          </motion.div>
          <motion.div className="col-span-1 flex justify-center items-center grayscale opacity-70 hover:opacity-100 transition duration-300" variants={logoVariants}>
            <svg className="h-8" viewBox="0 0 100 30" fill="currentColor">
              <path d="M20 5l15 20h-30zM50 5l15 20h-30zM80 5l15 20h-30z"/>
            </svg>
          </motion.div>
          <motion.div className="col-span-1 flex justify-center items-center grayscale opacity-70 hover:opacity-100 transition duration-300" variants={logoVariants}>
            <svg className="h-8" viewBox="0 0 100 30" fill="currentColor">
              <rect x="20" y="5" width="60" height="20" rx="10"/>
            </svg>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
