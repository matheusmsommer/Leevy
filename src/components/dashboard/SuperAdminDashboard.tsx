
import React, { useState } from 'react';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import SuperAdminSidebar from './superadmin/SuperAdminSidebar';
import DashboardStats from './superadmin/DashboardStats';
import CompanyManagement from './superadmin/CompanyManagement';
import ServiceManagement from './superadmin/ServiceManagement';
import OrderManagement from './superadmin/OrderManagement';
import UserManagement from './superadmin/UserManagement';
import PlatformSettings from './superadmin/PlatformSettings';
import AuditLogs from './superadmin/AuditLogs';
import ConfigurationManagement from './superadmin/ConfigurationManagement';

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

  const handleViewCompany = (companyId: string) => {
    console.log('Viewing company:', companyId);
  };

  const handleImpersonateCompany = (companyId: string) => {
    console.log('Impersonating company:', companyId);
  };

  const handleBlockCompany = (companyId: string) => {
    console.log('Blocking company:', companyId);
  };

  const handleAddService = () => {
    console.log('Adding new service');
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
        return <DashboardStats />;
      case 'companies':
        return <CompanyManagement 
          onViewCompany={handleViewCompany}
          onImpersonateCompany={handleImpersonateCompany}
          onBlockCompany={handleBlockCompany}
        />;
      case 'exams':
        return <ServiceManagement globalServices={[]} onAddService={handleAddService} />;
      case 'configurations':
        return <ConfigurationManagement />;
      case 'orders':
        return <OrderManagement 
          onExportOrders={handleExportOrders}
          onMarkCommissionPaid={handleMarkCommissionPaid}
        />;
      case 'users':
        return <UserManagement />;
      case 'settings':
        return <PlatformSettings />;
      case 'logs':
        return <AuditLogs auditLogs={mockAuditLogs} />;
      default:
        return <DashboardStats />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <SuperAdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
          </header>
          <main className="flex-1 overflow-auto">
            <div className="container max-w-7xl mx-auto p-6 space-y-8">
              {renderContent()}
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default SuperAdminDashboard;
