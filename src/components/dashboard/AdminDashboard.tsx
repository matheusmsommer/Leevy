
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Settings, Users, Calendar, File } from 'lucide-react';

const AdminDashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gradient">Painel Administrativo</h1>
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
                <File className="h-5 w-5" />
                Serviços e Exames
              </CardTitle>
              <CardDescription>
                Gerencie o catálogo de exames e serviços oferecidos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">
                Gerenciar Serviços
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Unidades
              </CardTitle>
              <CardDescription>
                Configure locais de atendimento e coleta
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">
                Gerenciar Unidades
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Agenda e Pedidos
              </CardTitle>
              <CardDescription>
                Visualize agendamentos e gerencie pedidos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">
                Ver Agenda
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
                Configure sua empresa e preferências
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
              <CardTitle>Link de Venda Direta</CardTitle>
              <CardDescription>
                Gere links personalizados para venda de exames
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Crie links diretos para que pacientes possam comprar exames sem precisar navegar pelo catálogo.
                </p>
                <Button variant="outline">
                  Gerar Link de Pagamento
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
