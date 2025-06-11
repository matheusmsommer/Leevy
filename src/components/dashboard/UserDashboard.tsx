
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Users, Calendar, File, Search } from 'lucide-react';

const UserDashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gradient">Minha Área</h1>
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
                <Search className="h-5 w-5" />
                Buscar Exames
              </CardTitle>
              <CardDescription>
                Encontre e agende exames disponíveis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">
                Buscar Exames
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Meus Pedidos
              </CardTitle>
              <CardDescription>
                Acompanhe seus agendamentos e histórico
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">
                Ver Pedidos
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <File className="h-5 w-5" />
                Resultados
              </CardTitle>
              <CardDescription>
                Acesse seus resultados de exames
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">
                Ver Resultados
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Dependentes
              </CardTitle>
              <CardDescription>
                Gerencie familiares e dependentes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">
                Gerenciar Dependentes
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Atalhos Rápidos</CardTitle>
              <CardDescription>
                Acesso rápido às funcionalidades mais utilizadas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Button variant="outline">
                    Agendar Exame de Sangue
                  </Button>
                  <Button variant="outline">
                    Adicionar Dependente
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
