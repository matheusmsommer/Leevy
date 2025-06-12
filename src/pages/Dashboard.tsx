
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import SuperAdminDashboard from '@/components/dashboard/SuperAdminDashboard';
import AdminDashboard from '@/components/dashboard/AdminDashboard';
import UserDashboard from '@/components/dashboard/UserDashboard';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

const Dashboard = () => {
  const { user, userRole, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  const renderDashboard = () => {
    // Use userRole first, then fallback to user.role, then default to 'user'
    const currentRole = userRole || user?.role || 'user';
    
    console.log('Dashboard - Current role:', currentRole, 'UserRole:', userRole, 'User.role:', user?.role);
    
    switch (currentRole) {
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
                Tipo de usuário não reconhecido: {currentRole}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Email: {user?.email}
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
