
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import SuperAdminDashboard from '@/components/dashboard/SuperAdminDashboard';
import AdminDashboard from '@/components/dashboard/AdminDashboard';
import UserDashboard from '@/components/dashboard/UserDashboard';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

const Dashboard = () => {
  const { user } = useAuth();

  const renderDashboard = () => {
    switch (user?.role) {
      case 'superadmin':
        return <SuperAdminDashboard />;
      case 'admin':
        return <AdminDashboard />;
      case 'user':
        return <UserDashboard />;
      default:
        return (
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-destructive">Erro</h1>
              <p className="text-muted-foreground mt-2">
                Tipo de usuário não reconhecido.
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <ProtectedRoute>
      {renderDashboard()}
    </ProtectedRoute>
  );
};

export default Dashboard;
