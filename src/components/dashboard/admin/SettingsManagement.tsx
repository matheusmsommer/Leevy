
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, Building, CreditCard, Bell, Shield, Link, FileText, Users } from 'lucide-react';

const SettingsManagement = () => {
  const settingsCategories = [
    {
      id: 'company',
      title: 'Dados da Empresa',
      description: 'Informações básicas, CNPJ, endereço',
      icon: Building,
      items: ['Nome da empresa', 'CNPJ', 'Endereço', 'Telefone', 'E-mail']
    },
    {
      id: 'payment',
      title: 'Pagamentos',
      description: 'Configurações de pagamento e cobrança',
      icon: CreditCard,
      items: ['Métodos de pagamento', 'Taxas', 'Parcelamento', 'PIX']
    },
    {
      id: 'notifications',
      title: 'Notificações',
      description: 'Configurar alertas e comunicações',
      icon: Bell,
      items: ['E-mail', 'SMS', 'WhatsApp', 'Push']
    },
    {
      id: 'security',
      title: 'Segurança',
      description: 'Controle de acesso e permissões',
      icon: Shield,
      items: ['Autenticação', 'Permissões', 'Logs', 'Backup']
    },
    {
      id: 'integrations',
      title: 'Integrações',
      description: 'APIs e serviços externos',
      icon: Link,
      items: ['API Key', 'Webhooks', 'Terceiros', 'Sincronização']
    },
    {
      id: 'documents',
      title: 'Documentos',
      description: 'Termos de uso e políticas',
      icon: FileText,
      items: ['Termos de uso', 'Política de privacidade', 'Contratos']
    }
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Configurações</h1>
          <p className="text-muted-foreground mt-2">
            Gerencie as configurações do seu laboratório
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {settingsCategories.map((category) => (
          <Card key={category.id} className="border-border shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                  <category.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                    {category.title}
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {category.description}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {category.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                    <div className="w-1.5 h-1.5 bg-primary/60 rounded-full" />
                    {item}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-border shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-foreground flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            Configurações Rápidas
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Ajustes básicos do sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Sistema</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <span className="text-foreground">Modo manutenção</span>
                  <div className="w-10 h-6 bg-muted rounded-full relative">
                    <div className="w-4 h-4 bg-white rounded-full absolute top-1 left-1 transition-transform"></div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <span className="text-foreground">Backup automático</span>
                  <div className="w-10 h-6 bg-primary rounded-full relative">
                    <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1 transition-transform"></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Notificações</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <span className="text-foreground">E-mail de vendas</span>
                  <div className="w-10 h-6 bg-primary rounded-full relative">
                    <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1 transition-transform"></div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <span className="text-foreground">SMS para clientes</span>
                  <div className="w-10 h-6 bg-muted rounded-full relative">
                    <div className="w-4 h-4 bg-white rounded-full absolute top-1 left-1 transition-transform"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsManagement;
