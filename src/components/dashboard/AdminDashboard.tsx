
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { Settings, Users, Calendar, File, Building, MapPin } from 'lucide-react';
import CompanyManagement from './CompanyManagement';
import ServiceManagement from './ServiceManagement';
import { Company } from '@/types/business';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [company, setCompany] = useState<Company | null>(null);

  // Mock company data - em produção virá do Supabase
  React.useEffect(() => {
    // Simular carregamento da empresa do admin
    const mockCompany: Company = {
      id: '1',
      name: 'Laboratório São Paulo',
      type: 'laboratorio',
      cnpj: '12.345.678/0001-90',
      created_by: user?.id || '1',
      status: 'ativa',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setCompany(mockCompany);
  }, [user]);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gradient">Painel Administrativo</h1>
            <p className="text-sm text-muted-foreground">Olá, {user?.name}</p>
          </div>
          <Button variant="outline" onClick={logout}>
            Sair
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="company">Empresa</TabsTrigger>
            <TabsTrigger value="services">Serviços</TabsTrigger>
            <TabsTrigger value="agenda">Agenda</TabsTrigger>
            <TabsTrigger value="settings">Configurações</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Pedidos Hoje
                  </CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-xs text-muted-foreground">
                    +2 desde ontem
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Receita do Mês
                  </CardTitle>
                  <File className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">R$ 3.240</div>
                  <p className="text-xs text-muted-foreground">
                    +15% desde o mês passado
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Serviços Ativos
                  </CardTitle>
                  <File className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">24</div>
                  <p className="text-xs text-muted-foreground">
                    Exames e consultas
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Unidades
                  </CardTitle>
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3</div>
                  <p className="text-xs text-muted-foreground">
                    Locais de atendimento
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Ações Rápidas</CardTitle>
                  <CardDescription>
                    Acesso rápido às funcionalidades mais utilizadas
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full justify-start">
                    <File className="h-4 w-4 mr-2" />
                    Adicionar Novo Exame
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Calendar className="h-4 w-4 mr-2" />
                    Ver Agenda de Hoje
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <MapPin className="h-4 w-4 mr-2" />
                    Gerenciar Unidades
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Link de Venda Direta</CardTitle>
                  <CardDescription>
                    Gere links personalizados para venda de exames
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Crie links diretos para que pacientes possam comprar exames sem precisar navegar pelo catálogo.
                    </p>
                    <Button variant="outline">
                      Gerar Link de Pagamento
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="company">
            <CompanyManagement company={company} />
          </TabsContent>

          <TabsContent value="services">
            <ServiceManagement companyId={company?.id || null} />
          </TabsContent>

          <TabsContent value="agenda">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Agenda e Pedidos
                </CardTitle>
                <CardDescription>
                  Visualize agendamentos e gerencie pedidos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Funcionalidade de agenda será implementada na próxima etapa.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Configurações
                </CardTitle>
                <CardDescription>
                  Configure sua empresa e preferências
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Configurações serão implementadas na próxima etapa.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
