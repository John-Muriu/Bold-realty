import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import FeaturedProperties from "@/components/home/FeaturedProperties";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import InsightsSection from "@/components/home/InsightsSection";
import CTASection from "@/components/home/CTASection";
import TopLocations from "@/components/home/TopLocations";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <FeaturedProperties
          title="Featured Properties"
          description="Explore our exclusive collection of premium properties across Nairobi"
          filter={{ featured: true }}
          limit={8}
        />
        <TopLocations />
        <InsightsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
