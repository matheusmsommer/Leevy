
import React, { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import SuperAdminSidebar from './superadmin/SuperAdminSidebar';
import DashboardStats from './superadmin/DashboardStats';
import CompanyManagement from './superadmin/CompanyManagement';
import ExamManagement from './superadmin/ExamManagement';
import OrderManagement from './superadmin/OrderManagement';
import UserManagement from './superadmin/UserManagement';
import PlatformSettings from './superadmin/PlatformSettings';
import AuditLogs from './superadmin/AuditLogs';

const SuperAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  // Mock data - em produção viria do Supabase
  const platformStats = {
    totalCompanies: 15,
    totalOrders: 1250,
    totalRevenue: 75000,
    commissionsReceived: 7500,
    commissionsPending: 2100
  };

  const topCompanies = [
    { id: '1', name: 'Laboratório São Paulo', orders: 45, revenue: 12500 },
    { id: '2', name: 'Clínica CardioVida', orders: 38, revenue: 9800 },
    { id: '3', name: 'Centro Diagnóstico Beta', orders: 32, revenue: 8200 }
  ];

  const companies = [
    { id: '1', name: 'Laboratório São Paulo', cnpj: '12.345.678/0001-90', status: 'Ativo', locations: 3, orders: 45, created_at: '2024-01-15' },
    { id: '2', name: 'Clínica CardioVida', cnpj: '98.765.432/0001-10', status: 'Ativo', locations: 2, orders: 38, created_at: '2024-02-20' },
    { id: '3', name: 'Centro Diagnóstico Beta', cnpj: '11.222.333/0001-44', status: 'Pendente', locations: 1, orders: 0, created_at: '2024-03-10' }
  ];

  const globalExams = [
    { id: '1', name: 'Hemograma Completo', code: 'HEM001', category: 'Sangue', preparation: 'Jejum de 8 horas', description: 'Avaliação completa das células sanguíneas' },
    { id: '2', name: 'Glicemia de Jejum', code: 'GLI001', category: 'Sangue', preparation: 'Jejum de 12 horas', description: 'Dosagem de glicose no sangue' },
    { id: '3', name: 'Ultrassom Abdome Total', code: 'USG001', category: 'Imagem', preparation: 'Bexiga cheia, jejum de 6 horas', description: 'Exame de ultrassom do abdome completo' }
  ];

  const allOrders = [
    { id: '1', company: 'Laboratório São Paulo', patient: 'João Silva', service: 'Hemograma Completo', amount: 45.00, commission: 4.50, date: '2024-03-15', status: 'concluido', commissionPaid: false },
    { id: '2', company: 'Clínica CardioVida', patient: 'Maria Santos', service: 'Glicemia de Jejum', amount: 25.00, commission: 2.50, date: '2024-03-14', status: 'concluido', commissionPaid: true },
    { id: '3', company: 'Laboratório São Paulo', patient: 'Pedro Costa', service: 'Ultrassom Abdome', amount: 120.00, commission: 12.00, date: '2024-03-13', status: 'pendente', commissionPaid: false }
  ];

  const platformUsers = [
    { id: '1', name: 'Ana Carolina', email: 'ana@email.com', totalSpent: 250.00, lastAccess: '2024-03-15', ordersCount: 5 },
    { id: '2', name: 'Roberto Lima', email: 'roberto@email.com', totalSpent: 180.00, lastAccess: '2024-03-14', ordersCount: 3 },
    { id: '3', name: 'Fernanda Souza', email: 'fernanda@email.com', totalSpent: 320.00, lastAccess: '2024-03-13', ordersCount: 7 }
  ];

  const handleViewCompany = (companyId: string) => {
    console.log('Visualizar empresa:', companyId);
  };

  const handleImpersonateCompany = (companyId: string) => {
    console.log('Acessar como empresa:', companyId);
  };

  const handleBlockCompany = (companyId: string) => {
    console.log('Bloquear empresa:', companyId);
  };

  const handleAddExam = () => {
    console.log('Adicionar novo exame');
  };

  const handleExportOrders = () => {
    console.log('Exportar pedidos');
  };

  const handleMarkCommissionPaid = (orderId: string) => {
    console.log('Marcar comissão como paga:', orderId);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardStats platformStats={platformStats} topCompanies={topCompanies} />;
      case 'companies':
        return (
          <CompanyManagement
            companies={companies}
            onViewCompany={handleViewCompany}
            onImpersonateCompany={handleImpersonateCompany}
            onBlockCompany={handleBlockCompany}
          />
        );
      case 'exams':
        return <ExamManagement globalExams={globalExams} onAddExam={handleAddExam} />;
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
      case 'settings':
        return <PlatformSettings />;
      case 'logs':
        return <AuditLogs />;
      default:
        return <DashboardStats platformStats={platformStats} topCompanies={topCompanies} />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-background via-background to-muted/20">
        <SuperAdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="flex-1 overflow-auto">
          <div className="container max-w-7xl mx-auto p-6 space-y-8">
            {renderContent()}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default SuperAdminDashboard;
