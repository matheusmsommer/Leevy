
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import DashboardStats from './superadmin/DashboardStats';
import ExamManagement from './superadmin/ExamManagement';
import CompanyManagement from './superadmin/CompanyManagement';
import OrderManagement from './superadmin/OrderManagement';
import UserManagement from './superadmin/UserManagement';
import AuditLogs from './superadmin/AuditLogs';
import PlatformSettings from './superadmin/PlatformSettings';

const SuperAdminDashboard = () => {
  const { logout } = useAuth();

  // Mock data - seria substituído por dados reais do Supabase
  const platformStats = {
    totalCompanies: 45,
    totalOrders: 1280,
    totalRevenue: 89750.00,
    commissionsReceived: 8975.00,
    commissionsPending: 2340.00
  };

  const topCompanies = [
    { id: '1', name: 'Laboratório São Paulo', orders: 180, revenue: 12450.00 },
    { id: '2', name: 'Clínica CardioVida', orders: 156, revenue: 11200.00 },
    { id: '3', name: 'Centro Médico Premium', orders: 134, revenue: 9800.00 }
  ];

  const companies = [
    {
      id: '1',
      name: 'Laboratório São Paulo',
      cnpj: '12.345.678/0001-90',
      status: 'ativo',
      locations: 3,
      orders: 180,
      created_at: '2024-01-15'
    },
    {
      id: '2',
      name: 'Clínica CardioVida',
      cnpj: '98.765.432/0001-10',
      status: 'ativo',
      locations: 2,
      orders: 156,
      created_at: '2024-01-20'
    },
    {
      id: '3',
      name: 'Centro Diagnóstico Beta',
      cnpj: '11.222.333/0001-44',
      status: 'pendente',
      locations: 1,
      orders: 0,
      created_at: '2024-02-01'
    }
  ];

  const globalExams = [
    {
      id: '1',
      name: 'Hemograma Completo',
      code: 'HEM001',
      category: 'sangue',
      preparation: 'Jejum de 8 horas',
      description: 'Avaliação completa das células sanguíneas'
    },
    {
      id: '2',
      name: 'Glicemia de Jejum',
      code: 'GLI001',
      category: 'sangue',
      preparation: 'Jejum de 12 horas',
      description: 'Dosagem de glicose no sangue'
    },
    {
      id: '3',
      name: 'Ultrassom Abdome Total',
      code: 'USG001',
      category: 'imagem',
      preparation: 'Bexiga cheia, jejum de 6 horas',
      description: 'Exame de ultrassom do abdome completo'
    }
  ];

  const allOrders = [
    {
      id: '1',
      company: 'Laboratório São Paulo',
      patient: 'João Silva',
      service: 'Hemograma Completo',
      amount: 45.00,
      commission: 4.50,
      date: '2024-02-10',
      status: 'concluido',
      commissionPaid: true
    },
    {
      id: '2',
      company: 'Clínica CardioVida',
      patient: 'Maria Santos',
      service: 'Check-up Cardiológico',
      amount: 280.00,
      commission: 28.00,
      date: '2024-02-09',
      status: 'concluido',
      commissionPaid: false
    }
  ];

  const platformUsers = [
    {
      id: '1',
      name: 'João Silva',
      email: 'joao@email.com',
      totalSpent: 320.00,
      lastAccess: '2024-02-10',
      ordersCount: 5
    },
    {
      id: '2',
      name: 'Maria Santos',
      email: 'maria@email.com',
      totalSpent: 580.00,
      lastAccess: '2024-02-09',
      ordersCount: 8
    }
  ];

  const auditLogs = [
    {
      id: '1',
      action: 'Login',
      user: 'admin@leevy.com',
      target: 'Sistema',
      timestamp: '2024-02-10 09:30:00',
      details: 'Login realizado com sucesso'
    },
    {
      id: '2',
      action: 'Empresa Bloqueada',
      user: 'admin@leevy.com',
      target: 'Laboratório XYZ',
      timestamp: '2024-02-09 14:15:00',
      details: 'Empresa bloqueada por violação dos termos'
    }
  ];

  const handleViewCompany = (companyId: string) => {
    console.log('Ver detalhes da empresa:', companyId);
  };

  const handleImpersonateCompany = (companyId: string) => {
    console.log('Acessar como admin da empresa:', companyId);
  };

  const handleBlockCompany = (companyId: string) => {
    console.log('Bloquear empresa:', companyId);
  };

  const handleAddExam = () => {
    console.log('Adicionar novo exame global');
  };

  const handleExportOrders = () => {
    console.log('Exportar pedidos para CSV');
  };

  const handleMarkCommissionPaid = (orderId: string) => {
    console.log('Marcar comissão como paga:', orderId);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Painel Leevy - Superadmin</h1>
            <p className="text-sm text-muted-foreground">
              Gestão completa da plataforma
            </p>
          </div>
          <Button variant="outline" onClick={logout}>
            Sair
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="exams">Exames</TabsTrigger>
            <TabsTrigger value="companies">Empresas</TabsTrigger>
            <TabsTrigger value="orders">Vendas</TabsTrigger>
            <TabsTrigger value="users">Usuários</TabsTrigger>
            <TabsTrigger value="audit">Auditoria</TabsTrigger>
            <TabsTrigger value="settings">Config</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <DashboardStats 
              platformStats={platformStats} 
              topCompanies={topCompanies} 
            />
          </TabsContent>

          <TabsContent value="exams">
            <ExamManagement 
              globalExams={globalExams} 
              onAddExam={handleAddExam} 
            />
          </TabsContent>

          <TabsContent value="companies">
            <CompanyManagement 
              companies={companies}
              onViewCompany={handleViewCompany}
              onImpersonateCompany={handleImpersonateCompany}
              onBlockCompany={handleBlockCompany}
            />
          </TabsContent>

          <TabsContent value="orders">
            <OrderManagement 
              allOrders={allOrders}
              onExportOrders={handleExportOrders}
              onMarkCommissionPaid={handleMarkCommissionPaid}
            />
          </TabsContent>

          <TabsContent value="users">
            <UserManagement platformUsers={platformUsers} />
          </TabsContent>

          <TabsContent value="audit">
            <AuditLogs auditLogs={auditLogs} />
          </TabsContent>

          <TabsContent value="settings">
            <PlatformSettings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
