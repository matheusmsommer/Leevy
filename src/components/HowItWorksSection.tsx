
const HowItWorksSection = () => {
  const steps = [
    {
      number: "01",
      title: "Cadastro e Configuração",
      description: "Configure seu laboratório na plataforma, adicione serviços, locais e equipe",
      icon: "⚙️"
    },
    {
      number: "02",
      title: "Paciente Escolhe e Paga",
      description: "Pacientes acessam seu catálogo, escolhem exames e pagam online",
      icon: "🛒"
    },
    {
      number: "03",
      title: "Agendamento e Coleta",
      description: "Sistema agenda automaticamente e gerencia toda a logística",
      icon: "📅"
    },
    {
      number: "04",
      title: "Resultados e Repasse",
      description: "Entregue resultados digitalmente e receba repasses automáticos",
      icon: "📊"
    }
  ];

  return (
    <section className="py-24 bg-background">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Como <span className="text-gradient">funciona</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Um processo simples e eficiente que transforma a experiência de compra de exames
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                {/* Connecting line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-leevy-300 to-leevy-200 z-0" />
                )}
                
                <div className="relative bg-card border border-leevy-100 rounded-2xl p-8 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 z-10">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-leevy text-white rounded-full text-2xl font-bold mb-6">
                    {step.number}
                  </div>
                  
                  <div className="text-4xl mb-4">{step.icon}</div>
                  
                  <h3 className="text-xl font-bold mb-4 text-foreground">
                    {step.title}
                  </h3>
                  
                  <p className="text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-2 bg-leevy-50 border border-leevy-200 rounded-full px-6 py-3">
            <div className="w-2 h-2 bg-leevy-500 rounded-full animate-pulse" />
            <span className="text-leevy-700 font-medium">
              Processo 100% automatizado
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
