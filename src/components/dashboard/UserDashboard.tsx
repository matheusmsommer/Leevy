
import React, { useState } from 'react';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import UserSidebar from './UserSidebar';
import SearchSection from './user/SearchSection';
import BookingsSection from './user/BookingsSection';
import OrdersSection from './user/OrdersSection';
import PatientsSection from './user/PatientsSection';
import FavoritesSection from './user/FavoritesSection';
import ReportsSection from './user/ReportsSection';
import SettingsSection from './user/SettingsSection';

const UserDashboard = () => {
  const [activeSection, setActiveSection] = useState('search');

  const renderContent = () => {
    switch (activeSection) {
      case 'search':
        return <SearchSection />;
      case 'bookings':
        return <BookingsSection />;
      case 'orders':
        return <OrdersSection />;
      case 'patients':
        return <PatientsSection />;
      case 'favorites':
        return <FavoritesSection />;
      case 'reports':
        return <ReportsSection />;
      case 'settings':
        return <SettingsSection />;
      default:
        return <SearchSection />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-background via-background to-muted/20">
        <UserSidebar activeSection={activeSection} onSectionChange={setActiveSection} />
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

export default UserDashboard;
