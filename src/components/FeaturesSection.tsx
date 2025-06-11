
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const FeaturesSection = () => {
  const features = [
    {
      title: "Checkout Digital Completo",
      description: "Sistema de pagamento integrado com cartão de crédito, futuro suporte a Pix e boleto",
      icon: "💳",
      highlight: true
    },
    {
      title: "Gestão de Múltiplos Locais",
      description: "Configure diferentes unidades com horários e serviços específicos",
      icon: "📍",
      highlight: false
    },
    {
      title: "Catálogo Inteligente",
      description: "Organize exames, consultas e checkups com preços promocionais automáticos",
      icon: "📚",
      highlight: false
    },
    {
      title: "Dashboard Analítico",
      description: "KPIs em tempo real, relatórios de vendas e insights de performance",
      icon: "📈",
      highlight: true
    },
    {
      title: "Gestão de Equipe",
      description: "Controle de acesso e permissões para administradores e colaboradores",
      icon: "👥",
      highlight: false
    },
    {
      title: "Resultados Digitais",
      description: "Upload de PDFs ou integração com sistemas externos de resultados",
      icon: "📄",
      highlight: false
    },
    {
      title: "Links de Venda Direta",
      description: "Gere links personalizados para divulgação em redes sociais e marketing",
      icon: "🔗",
      highlight: true
    },
    {
      title: "Compliance e Segurança",
      description: "Dados protegidos, logs de auditoria e conformidade com LGPD",
      icon: "🔒",
      highlight: false
    }
  ];

  return (
    <section className="py-24 bg-gradient-subtle">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Recursos <span className="text-gradient">completos</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Tudo que seu laboratório precisa para vender online de forma profissional e segura
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className={`group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${
                feature.highlight 
                  ? 'border-leevy-200 bg-gradient-to-br from-leevy-50 to-background' 
                  : 'border-border hover:border-leevy-200'
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="text-3xl group-hover:scale-110 transition-transform duration-200">
                    {feature.icon}
                  </div>
                  {feature.highlight && (
                    <div className="w-2 h-2 bg-leevy-500 rounded-full animate-pulse" />
                  )}
                </div>
                <CardTitle className="text-lg leading-tight">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-16">
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 bg-leevy-50 border border-leevy-200 rounded-2xl px-8 py-6">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🚀</span>
              <span className="text-leevy-700 font-semibold">
                Novos recursos em desenvolvimento
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              WhatsApp, IA, Telemedicina e muito mais
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
