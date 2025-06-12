
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Calendar, 
  FileText, 
  Download, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Plus,
  ArrowRight,
  User,
  Activity
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UserDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Mock data - seria substituído por dados reais
  const recentBookings = [
    {
      id: '1',
      service: 'Hemograma Completo',
      patient: 'João Silva',
      location: 'Laboratório Central - Centro',
      date: '2024-01-20',
      time: '09:00',
      status: 'confirmado'
    },
    {
      id: '2',
      service: 'Consulta Cardiologia',
      patient: 'Maria Silva',
      location: 'Clínica CardioVida - Itaim',
      date: '2024-01-25',
      time: '14:30',
      status: 'resultado_disponivel'
    }
  ];

  const quickStats = {
    pendingPayments: 1,
    confirmedBookings: 3,
    availableResults: 2
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pendente_pagamento: { label: 'Pendente Pagamento', variant: 'secondary' as const, icon: Clock },
      confirmado: { label: 'Confirmado', variant: 'default' as const, icon: CheckCircle },
      realizado: { label: 'Realizado', variant: 'outline' as const, icon: CheckCircle },
      resultado_disponivel: { label: 'Resultado Disponível', variant: 'destructive' as const, icon: Download }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.confirmado;
    const IconComponent = config.icon;
    
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <IconComponent className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Olá, {user?.name}!</h1>
            <p className="text-sm text-muted-foreground">
              Bem-vindo de volta à sua área pessoal
            </p>
          </div>
          <Button variant="outline" onClick={logout}>
            Sair
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Action Hero */}
        <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20 mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-4 md:mb-0">
                <h2 className="text-xl font-bold mb-2 text-foreground">Precisa agendar um exame ou consulta?</h2>
                <p className="text-muted-foreground">
                  Encontre e agende rapidamente em nossa rede de parceiros
                </p>
              </div>
              <Button 
                size="lg" 
                onClick={() => navigate('/search')}
                className="flex items-center gap-2"
              >
                <Plus className="h-5 w-5" />
                Fazer Novo Agendamento
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">Pagamentos Pendentes</CardTitle>
              <AlertCircle className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">{quickStats.pendingPayments}</div>
              <p className="text-xs text-muted-foreground">
                Finalize para confirmar
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">Agendamentos Confirmados</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">{quickStats.confirmedBookings}</div>
              <p className="text-xs text-muted-foreground">
                Próximos exames
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">Resultados Disponíveis</CardTitle>
              <Download className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">{quickStats.availableResults}</div>
              <p className="text-xs text-muted-foreground">
                Prontos para download
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Bookings */}
        <Card className="mb-8 bg-card border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-card-foreground">Próximos Agendamentos</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Seus agendamentos mais recentes
                </CardDescription>
              </div>
              <Button 
                variant="outline" 
                onClick={() => navigate('/bookings')}
                className="flex items-center gap-2"
              >
                Ver Todos
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {recentBookings.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Nenhum agendamento encontrado</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Faça seu primeiro agendamento
                </p>
                <Button onClick={() => navigate('/search')}>
                  Buscar Serviços
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {recentBookings.map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-4 border border-border rounded-lg bg-background">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Activity className="h-4 w-4 text-primary" />
                        <h4 className="font-medium text-foreground">{booking.service}</h4>
                        {getStatusBadge(booking.status)}
                      </div>
                      <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                        <User className="h-3 w-3" />
                        Paciente: {booking.patient}
                      </p>
                      <p className="text-sm text-muted-foreground mb-1">
                        {booking.location}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {new Date(booking.date).toLocaleDateString('pt-BR')} às {booking.time}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {booking.status === 'resultado_disponivel' && (
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4 mr-2" />
                          Baixar
                        </Button>
                      )}
                      <Button size="sm" variant="outline">
                        Ver Detalhes
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <FileText className="h-8 w-8 text-blue-500 mb-2" />
                <h3 className="font-medium mb-1 text-card-foreground">Meus Pedidos</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Histórico completo
                </p>
                <Button variant="outline" onClick={() => navigate('/orders')}>
                  Acessar
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <Calendar className="h-8 w-8 text-green-500 mb-2" />
                <h3 className="font-medium mb-1 text-card-foreground">Agendamentos</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Próximos exames
                </p>
                <Button variant="outline" onClick={() => navigate('/bookings')}>
                  Ver Agenda
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <Download className="h-8 w-8 text-purple-500 mb-2" />
                <h3 className="font-medium mb-1 text-card-foreground">Resultados</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Laudos disponíveis
                </p>
                <Button variant="outline" onClick={() => navigate('/results')}>
                  Ver Resultados
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <User className="h-8 w-8 text-orange-500 mb-2" />
                <h3 className="font-medium mb-1 text-card-foreground">Pacientes</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Gerir dependentes
                </p>
                <Button variant="outline" onClick={() => navigate('/patients')}>
                  Gerenciar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
