
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

  // Mock data for audit logs
  const mockAuditLogs = [
    {
      id: '1',
      action: 'Criação de empresa',
      user: 'Super Admin',
      timestamp: '2024-01-15 14:30',
      details: 'Nova empresa Lab São Paulo foi criada',
      type: 'user' as const
    },
    {
      id: '2',
      action: 'Login no sistema',
      user: 'admin@labsp.com',
      timestamp: '2024-01-15 14:25',
      details: 'Login realizado com sucesso',
      type: 'security' as const
    }
  ];

  // Mock data for platform stats
  const mockPlatformStats = {
    totalCompanies: 45,
    totalOrders: 1250,
    totalRevenue: 485750.00,
    commissionsReceived: 48575.00,
    commissionsPending: 12500.00
  };

  // Mock data for top companies
  const mockTopCompanies = [
    { id: '1', name: 'Laboratório São Paulo', orders: 245, revenue: 89500.00 },
    { id: '2', name: 'Clínica CardioVida', orders: 180, revenue: 65200.00 },
    { id: '3', name: 'Centro Diagnóstico Beta', orders: 156, revenue: 55800.00 }
  ];

  // Mock data for companies
  const mockCompanies = [
    { id: '1', name: 'Laboratório São Paulo', cnpj: '12.345.678/0001-90', status: 'Ativo', locations: 3, orders: 245, created_at: '2024-01-01' },
    { id: '2', name: 'Clínica CardioVida', cnpj: '98.765.432/0001-10', status: 'Ativo', locations: 2, orders: 180, created_at: '2024-01-02' },
    { id: '3', name: 'Centro Diagnóstico Beta', cnpj: '11.222.333/0001-44', status: 'Pendente', locations: 1, orders: 0, created_at: '2024-01-03' }
  ];

  // Mock data for global exams
  const mockGlobalExams = [
    { id: '1', name: 'Hemograma Completo', code: 'HEM001', category: 'Sangue', preparation: 'Jejum de 8 horas', description: 'Avaliação das células sanguíneas' },
    { id: '2', name: 'Glicemia de Jejum', code: 'GLI001', category: 'Sangue', preparation: 'Jejum de 12 horas', description: 'Dosagem de glicose' },
    { id: '3', name: 'Ultrassom Abdome', code: 'USG001', category: 'Imagem', preparation: 'Bexiga cheia', description: 'Exame ultrassonográfico' }
  ];

  // Mock data for all orders
  const mockAllOrders = [
    { id: '1', company: 'Lab São Paulo', patient: 'João Silva', service: 'Hemograma', amount: 45.00, commission: 4.50, date: '2024-01-15', status: 'concluido', commissionPaid: true },
    { id: '2', company: 'Clínica CardioVida', patient: 'Maria Santos', service: 'Consulta', amount: 180.00, commission: 18.00, date: '2024-01-14', status: 'pendente', commissionPaid: false }
  ];

  // Mock data for platform users
  const mockPlatformUsers = [
    { id: '1', name: 'João Silva', email: 'joao@email.com', totalSpent: 450.00, lastAccess: '2024-01-15', ordersCount: 8 },
    { id: '2', name: 'Maria Santos', email: 'maria@email.com', totalSpent: 320.00, lastAccess: '2024-01-14', ordersCount: 5 }
  ];

  const handleViewCompany = (companyId: string) => {
    console.log('Viewing company:', companyId);
  };

  const handleImpersonateCompany = (companyId: string) => {
    console.log('Impersonating company:', companyId);
  };

  const handleBlockCompany = (companyId: string) => {
    console.log('Blocking company:', companyId);
  };

  const handleAddExam = () => {
    console.log('Adding new exam');
  };

  const handleExportOrders = () => {
    console.log('Exporting orders');
  };

  const handleMarkCommissionPaid = (orderId: string) => {
    console.log('Marking commission as paid for order:', orderId);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardStats platformStats={mockPlatformStats} topCompanies={mockTopCompanies} />;
      case 'companies':
        return <CompanyManagement 
          companies={mockCompanies} 
          onViewCompany={handleViewCompany}
          onImpersonateCompany={handleImpersonateCompany}
          onBlockCompany={handleBlockCompany}
        />;
      case 'exams':
        return <ExamManagement globalExams={mockGlobalExams} onAddExam={handleAddExam} />;
      case 'orders':
        return <OrderManagement 
          allOrders={mockAllOrders}
          onExportOrders={handleExportOrders}
          onMarkCommissionPaid={handleMarkCommissionPaid}
        />;
      case 'users':
        return <UserManagement platformUsers={mockPlatformUsers} />;
      case 'settings':
        return <PlatformSettings />;
      case 'logs':
        return <AuditLogs auditLogs={mockAuditLogs} />;
      default:
        return <DashboardStats platformStats={mockPlatformStats} topCompanies={mockTopCompanies} />;
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
