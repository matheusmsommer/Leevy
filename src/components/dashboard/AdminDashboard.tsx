
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { Settings, Users, Calendar, File, Building, MapPin, DollarSign, TrendingUp, UserCheck } from 'lucide-react';
import CompanyManagement from './CompanyManagement';
import ServiceManagement from './ServiceManagement';
import AdminOnboarding from './AdminOnboarding';
import { Company } from '@/types/business';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [company, setCompany] = useState<Company | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);

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

  // Mock KPIs data
  const kpis = {
    monthlyBookings: 45,
    totalSales: 8750.00,
    commissionPaid: 875.00,
    patientsServed: 32
  };

  // Mock recent bookings
  const recentBookings = [
    {
      id: '1',
      patient_name: 'João Silva',
      service_name: 'Hemograma Completo',
      location: 'Centro',
      date: '2024-01-15',
      time: '09:00',
      status: 'confirmado',
      amount: 45.00
    },
    {
      id: '2',
      patient_name: 'Maria Santos',
      service_name: 'Check-up Básico',
      location: 'Vila Madalena',
      date: '2024-01-15',
      time: '14:30',
      status: 'realizado',
      amount: 180.00
    }
  ];

  if (showOnboarding) {
    return (
      <AdminOnboarding
        onComplete={(data) => {
          console.log('Onboarding completed:', data);
          setShowOnboarding(false);
        }}
      />
    );
  }

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
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="overview">Dashboard</TabsTrigger>
            <TabsTrigger value="agenda">Agenda</TabsTrigger>
            <TabsTrigger value="patients">Pacientes</TabsTrigger>
            <TabsTrigger value="services">Serviços</TabsTrigger>
            <TabsTrigger value="orders">Pedidos</TabsTrigger>
            <TabsTrigger value="financial">Financeiro</TabsTrigger>
            <TabsTrigger value="team">Equipe</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Agendamentos do Mês
                  </CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{kpis.monthlyBookings}</div>
                  <p className="text-xs text-muted-foreground">
                    +12% desde o mês passado
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Vendas Totais
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">R$ {kpis.totalSales.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">
                    +8% desde o mês passado
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Comissão Leevy
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">R$ {kpis.commissionPaid.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">
                    10% das vendas
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Pacientes Atendidos
                  </CardTitle>
                  <UserCheck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{kpis.patientsServed}</div>
                  <p className="text-xs text-muted-foreground">
                    Únicos este mês
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Agendamentos Recentes</CardTitle>
                  <CardDescription>
                    Últimos agendamentos realizados
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentBookings.map((booking) => (
                      <div key={booking.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{booking.patient_name}</p>
                          <p className="text-sm text-muted-foreground">{booking.service_name}</p>
                          <p className="text-xs text-muted-foreground">
                            {booking.date} às {booking.time} - {booking.location}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">R$ {booking.amount.toFixed(2)}</p>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            booking.status === 'confirmado' ? 'bg-blue-100 text-blue-800' :
                            booking.status === 'realizado' ? 'bg-green-100 text-green-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {booking.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

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
                    Adicionar Novo Serviço
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Calendar className="h-4 w-4 mr-2" />
                    Ver Agenda de Hoje
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <MapPin className="h-4 w-4 mr-2" />
                    Gerenciar Locais
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => setShowOnboarding(true)}>
                    <Settings className="h-4 w-4 mr-2" />
                    Reconfigurar Empresa
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="agenda">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Agenda de Agendamentos
                </CardTitle>
                <CardDescription>
                  Visualize e gerencie todos os agendamentos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Interface de agenda será implementada na próxima etapa.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="patients">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Pacientes Cadastrados
                </CardTitle>
                <CardDescription>
                  Visualize pacientes que já compraram serviços
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Lista de pacientes será implementada na próxima etapa.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="services">
            <ServiceManagement companyId={company?.id || null} />
          </TabsContent>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <File className="h-5 w-5" />
                  Pedidos e Vendas
                </CardTitle>
                <CardDescription>
                  Acompanhe todas as vendas e status de pagamento
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Lista de pedidos será implementada na próxima etapa.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="financial">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Relatórios Financeiros
                </CardTitle>
                <CardDescription>
                  Acompanhe repasses e comissões
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Relatórios financeiros serão implementados na próxima etapa.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="team">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Gerenciar Equipe
                </CardTitle>
                <CardDescription>
                  Convide usuários e gerencie permissões
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Gerenciamento de equipe será implementado na próxima etapa.
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
