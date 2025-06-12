
import { Settings, ShoppingCart, Calendar, BarChart3 } from "lucide-react";

const HowItWorksSection = () => {
  const steps = [
    {
      number: "01",
      title: "Cadastro e Configuração",
      description: "Configure seu laboratório na plataforma, adicione serviços, locais e equipe",
      icon: Settings
    },
    {
      number: "02",
      title: "Paciente Escolhe e Paga",
      description: "Pacientes acessam seu catálogo, escolhem exames e pagam online",
      icon: ShoppingCart
    },
    {
      number: "03",
      title: "Agendamento e Coleta",
      description: "Sistema agenda automaticamente e gerencia toda a logística",
      icon: Calendar
    },
    {
      number: "04",
      title: "Resultados e Repasse",
      description: "Entregue resultados digitalmente e receba repasses automáticos",
      icon: BarChart3
    }
  ];

  return (
    <section className="py-24 bg-gray-50">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
            Como <span className="text-blue-600">funciona</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Um processo simples e eficiente que transforma a experiência de compra de exames
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <div key={index} className="relative">
                  {/* Connecting line */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-blue-300 to-blue-100 z-0" />
                  )}
                  
                  <div className="relative bg-white border-2 border-gray-100 rounded-2xl p-8 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 z-10 hover:border-blue-200">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-full text-xl font-bold mb-6 shadow-lg">
                      {step.number}
                    </div>
                    
                    <div className="mb-4">
                      <IconComponent className="h-10 w-10 text-blue-600 mx-auto" />
                    </div>
                    
                    <h3 className="text-xl font-bold mb-4 text-gray-900">
                      {step.title}
                    </h3>
                    
                    <p className="text-gray-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-3 bg-white border-2 border-blue-200 rounded-full px-6 py-3 shadow-lg">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
            <span className="text-gray-700 font-semibold">
              Processo 100% automatizado
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
