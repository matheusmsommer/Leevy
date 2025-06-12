
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

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardStats />;
      case 'companies':
        return <CompanyManagement />;
      case 'exams':
        return <ExamManagement />;
      case 'orders':
        return <OrderManagement />;
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
