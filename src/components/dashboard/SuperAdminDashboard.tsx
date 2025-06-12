import React, { useState } from 'react';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import SuperAdminSidebar from './superadmin/SuperAdminSidebar';
import DashboardStats from './superadmin/DashboardStats';
import ExamManagement from './superadmin/ExamManagement';
import CompanyManagement from './superadmin/CompanyManagement';
import OrderManagement from './superadmin/OrderManagement';
import UserManagement from './superadmin/UserManagement';
import AuditLogs from './superadmin/AuditLogs';
import PlatformSettings from './superadmin/PlatformSettings';

const SuperAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

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

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardStats platformStats={platformStats} topCompanies={topCompanies} />;
      case 'exams':
        return <ExamManagement globalExams={globalExams} onAddExam={handleAddExam} />;
      case 'companies':
        return (
          <CompanyManagement 
            companies={companies}
            onViewCompany={handleViewCompany}
            onImpersonateCompany={handleImpersonateCompany}
            onBlockCompany={handleBlockCompany}
          />
        );
      case 'orders':
        return (
          <OrderManagement 
            allOrders={allOrders}
            onExportOrders={handleExportOrders}
            onMarkCommissionPaid={handleMarkCommissionPaid}
          />
        );
      case 'users':
        return <UserManagement platformUsers={platformUsers} />;
      case 'audit':
        return <AuditLogs auditLogs={auditLogs} />;
      case 'settings':
        return <PlatformSettings />;
      default:
        return <DashboardStats platformStats={platformStats} topCompanies={topCompanies} />;
    }
  };

  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Dashboard';
      case 'exams':
        return 'Gestão de Exames';
      case 'companies':
        return 'Gestão de Empresas';
      case 'orders':
        return 'Gestão de Vendas';
      case 'users':
        return 'Gestão de Usuários';
      case 'audit':
        return 'Auditoria e Logs';
      case 'settings':
        return 'Configurações da Plataforma';
      default:
        return 'Dashboard';
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <SuperAdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <h1 className="text-xl font-semibold text-foreground">{getPageTitle()}</h1>
          </header>
          <div className="flex-1 space-y-4 p-6">
            {renderContent()}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default SuperAdminDashboard;
