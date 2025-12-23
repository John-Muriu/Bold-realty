import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import StatsSection from "@/components/home/StatsSection";
import FeaturedProperties from "@/components/home/FeaturedProperties";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import InsightsSection from "@/components/home/InsightsSection";
import CTASection from "@/components/home/CTASection";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <StatsSection />

        <FeaturedProperties
          title="Featured Properties"
          description="Explore our exclusive collection of premium properties across Nairobi"
          filter={{ featured: true }}
          limit={3}
          backgroundImage="/westlands-bg.png"
        />
        <TestimonialsSection />
        <InsightsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
