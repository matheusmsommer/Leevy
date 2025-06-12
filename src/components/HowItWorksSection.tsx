
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
    <section className="py-24 bg-gray-50">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
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
                  <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-primary/30 to-primary/10 z-0" />
                )}
                
                <div className="relative bg-white border-2 border-gray-100 rounded-2xl p-8 text-center hover:shadow-elevated transition-all duration-300 hover:-translate-y-2 z-10 hover:border-primary/20">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-leevy text-white rounded-full text-xl font-bold mb-6 shadow-soft">
                    {step.number}
                  </div>
                  
                  <div className="text-4xl mb-4">{step.icon}</div>
                  
                  <h3 className="text-xl font-bold mb-4 text-foreground">
                    {step.title}
                  </h3>
                  
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-3 bg-white border-2 border-primary/20 rounded-full px-6 py-3 shadow-soft">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <span className="text-secondary font-semibold">
              Processo 100% automatizado
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
