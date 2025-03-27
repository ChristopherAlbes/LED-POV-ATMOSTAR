import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import BrandLogos from "@/components/BrandLogos";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import ProductShowcase from "@/components/ProductShowcase";
import Testimonials from "@/components/Testimonials";
import CTASection from "@/components/CTASection";
import WaitlistForm from "@/components/WaitlistForm";
import Footer from "@/components/Footer";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
  const { data: waitlistCountData } = useQuery({
    queryKey: ['/api/waitlist/count'],
    staleTime: 60000, // 1 minute
  });
  
  const waitlistCount = waitlistCountData?.count || 350;

  return (
    <div className="min-h-screen font-sans text-gray-800 antialiased bg-gray-50">
      <Navbar />
      <Hero waitlistCount={waitlistCount} />
      <BrandLogos />
      <Features />
      <HowItWorks />
      <ProductShowcase />
      <Testimonials />
      <CTASection />
      <WaitlistForm />
      <Footer />
    </div>
  );
}
