
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Settings, Users, Calendar } from 'lucide-react';

const SuperAdminDashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gradient">leevy SuperAdmin</h1>
            <p className="text-sm text-muted-foreground">Olá, {user?.name}</p>
          </div>
          <Button variant="outline" onClick={logout}>
            Sair
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Gestão de Empresas
              </CardTitle>
              <CardDescription>
                Visualize e gerencie todas as empresas da plataforma
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">
                Ver Empresas
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Relatórios Globais
              </CardTitle>
              <CardDescription>
                Acesse métricas e relatórios de toda a plataforma
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">
                Ver Relatórios
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Configurações
              </CardTitle>
              <CardDescription>
                Gerencie configurações globais da plataforma
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">
                Configurar
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Acesso de Suporte</CardTitle>
              <CardDescription>
                Entre em empresas específicas para suporte técnico
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Como superadmin, você pode acessar qualquer empresa em modo invisível para suporte.
                </p>
                <Button variant="outline">
                  Modo Suporte de Empresa
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
