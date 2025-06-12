
import React, { useState } from 'react';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import AdminSidebar from './AdminSidebar';
import DashboardOverview from './admin/DashboardOverview';
import ServiceManagement from './admin/ServiceManagement';
import ComboManagement from './admin/ComboManagement';
import OrderManagement from './admin/OrderManagement';
import LocationManagement from './admin/LocationManagement';
import UserManagement from './admin/UserManagement';
import SettingsManagement from './admin/SettingsManagement';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'services':
        return <ServiceManagement />;
      case 'combos':
        return <ComboManagement />;
      case 'orders':
        return <OrderManagement />;
      case 'locations':
        return <LocationManagement />;
      case 'users':
        return <UserManagement />;
      case 'settings':
        return <SettingsManagement />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-background via-background to-muted/20">
        <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />
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

export default AdminDashboard;
