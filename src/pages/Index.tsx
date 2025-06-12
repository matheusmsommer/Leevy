
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import HeroSection from "@/components/HeroSection";
import BenefitsSection from "@/components/BenefitsSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import FeaturesSection from "@/components/FeaturesSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const Index = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground font-medium">Carregando...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border shadow-soft">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-primary">leevy</div>
          <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-soft">
            <a href="/login" className="font-semibold">Entrar</a>
          </Button>
        </div>
      </header>

      <div className="pt-20">
        <HeroSection />
        <BenefitsSection />
        <HowItWorksSection />
        <FeaturesSection />
        <CTASection />
        <Footer />
      </div>
    </div>
  );
};

export default Index;
