
import { Button } from "@/components/ui/button";

const CTASection = () => {
  return (
    <section className="py-24 bg-gradient-to-br from-secondary via-primary to-leevy-700 text-white relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
      </div>

      <div className="container px-4 mx-auto relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white">
            Pronto para <span className="text-leevy-200">modernizar</span> seu laboratório?
          </h2>
          
          <p className="text-xl md:text-2xl text-gray-100 max-w-2xl mx-auto leading-relaxed">
            Junte-se à revolução digital da saúde e ofereça uma experiência excepcional aos seus pacientes
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
            <Button 
              size="lg" 
              className="bg-white text-secondary hover:bg-gray-50 px-10 py-6 text-lg rounded-xl font-semibold shadow-elevated hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 border-0"
            >
              Solicitar Demonstração
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-2 border-white/40 text-white hover:bg-white/10 backdrop-blur-sm px-10 py-6 text-lg rounded-xl font-semibold transition-all duration-200 hover:border-white/60"
            >
              Falar com Especialista
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="pt-16 border-t border-white/20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-white">Setup</div>
                <div className="text-gray-200">em 24 horas</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">Suporte</div>
                <div className="text-gray-200">especializado</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">ROI</div>
                <div className="text-gray-200">garantido</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
