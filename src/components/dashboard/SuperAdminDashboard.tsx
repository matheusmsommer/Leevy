
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

  // Mock data for audit logs - will be replaced with real data later
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

  // Mock data for platform stats - will be replaced with real data later
  const mockPlatformStats = {
    totalCompanies: 0,
    totalOrders: 0,
    totalRevenue: 0,
    commissionsReceived: 0,
    commissionsPending: 0
  };

  // Mock data for top companies - will be replaced with real data later
  const mockTopCompanies: Array<{ id: string; name: string; orders: number; revenue: number }> = [];

  // Mock data for global exams - will be replaced with real data later
  const mockGlobalExams: Array<{ id: string; name: string; code: string; category: string; preparation: string; description: string }> = [];

  // Mock data for platform users - will be replaced with real data later
  const mockPlatformUsers: Array<{ id: string; name: string; email: string; totalSpent: number; lastAccess: string; ordersCount: number }> = [];

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
          onViewCompany={handleViewCompany}
          onImpersonateCompany={handleImpersonateCompany}
          onBlockCompany={handleBlockCompany}
        />;
      case 'exams':
        return <ExamManagement globalExams={mockGlobalExams} onAddExam={handleAddExam} />;
      case 'orders':
        return <OrderManagement 
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
      <div className="min-h-screen flex w-full bg-background">
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
