
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const BenefitsSection = () => {
  const labBenefits = [
    {
      title: "Sistema Próprio de Vendas",
      description: "Tenha seu próprio checkout digital e sistema de agendamentos sem depender de terceiros",
      icon: "🏥"
    },
    {
      title: "Pagamento Antecipado",
      description: "Receba o pagamento no momento da compra, garantindo fluxo de caixa",
      icon: "💳"
    },
    {
      title: "Gestão Completa",
      description: "Gerencie catálogo, equipe, pedidos e pacientes em uma única plataforma",
      icon: "⚙️"
    },
    {
      title: "Independência Total",
      description: "Atenda pacientes sem depender de convênios ou centrais telefônicas",
      icon: "🚀"
    }
  ];

  const patientBenefits = [
    {
      title: "Agendamento Online",
      description: "Agende seus exames quando quiser, onde estiver, 24 horas por dia",
      icon: "📅"
    },
    {
      title: "Gestão de Dependentes",
      description: "Gerencie exames de toda a família em uma única conta",
      icon: "👨‍👩‍👧‍👦"
    },
    {
      title: "Resultados Digitais",
      description: "Acesse seus resultados de forma segura e organizada",
      icon: "📊"
    },
    {
      title: "Transparência Total",
      description: "Preços claros, instruções detalhadas e acompanhamento em tempo real",
      icon: "✨"
    }
  ];

  return (
    <section className="py-24 bg-gradient-subtle">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Benefícios para <span className="text-gradient">todos</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Uma plataforma pensada para revolucionar a experiência tanto de laboratórios quanto de pacientes
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Laboratórios */}
          <div className="space-y-8">
            <div className="text-center">
              <h3 className="text-2xl md:text-3xl font-bold text-leevy-700 mb-4">
                Para Laboratórios
              </h3>
              <p className="text-muted-foreground">
                Modernize seu negócio e aumente suas vendas
              </p>
            </div>

            <div className="grid gap-6">
              {labBenefits.map((benefit, index) => (
                <Card key={index} className="hover:shadow-lg transition-all duration-300 border-leevy-100 hover:border-leevy-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{benefit.icon}</div>
                      <CardTitle className="text-lg">{benefit.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {benefit.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Pacientes */}
          <div className="space-y-8">
            <div className="text-center">
              <h3 className="text-2xl md:text-3xl font-bold text-leevy-700 mb-4">
                Para Pacientes
              </h3>
              <p className="text-muted-foreground">
                Praticidade e segurança em cada etapa
              </p>
            </div>

            <div className="grid gap-6">
              {patientBenefits.map((benefit, index) => (
                <Card key={index} className="hover:shadow-lg transition-all duration-300 border-leevy-100 hover:border-leevy-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{benefit.icon}</div>
                      <CardTitle className="text-lg">{benefit.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {benefit.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
