
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
  Activity,
  Building2,
  Settings
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UserDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Mock data - seria substituído por dados reais
  const recentOrders = [
    {
      id: '1',
      service: 'Hemograma Completo',
      patient: 'João Silva',
      company: 'Laboratório Central',
      location: 'São Paulo - Centro',
      date: '2024-01-20',
      time: '09:00',
      status: 'agendado',
      amount: 45.00
    },
    {
      id: '2',
      service: 'Consulta Cardiologia',
      patient: 'Maria Silva',
      company: 'Clínica CardioVida',
      location: 'São Paulo - Itaim',
      date: '2024-01-25',
      time: '14:30',
      status: 'concluido',
      amount: 180.00
    },
    {
      id: '3',
      service: 'Check-up Executivo',
      patient: 'João Silva', 
      company: 'Centro Médico Premium',
      location: 'São Paulo - Faria Lima',
      date: '2024-02-01',
      time: '08:00',
      status: 'em_andamento',
      amount: 350.00
    }
  ];

  const quickStats = {
    totalOrders: 12,
    pendingOrders: 2,
    completedOrders: 8,
    availableResults: 3
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      agendado: { label: 'Agendado', variant: 'default' as const, icon: Clock },
      em_andamento: { label: 'Em Andamento', variant: 'secondary' as const, icon: Activity },
      concluido: { label: 'Concluído', variant: 'outline' as const, icon: CheckCircle },
      cancelado: { label: 'Cancelado', variant: 'destructive' as const, icon: AlertCircle }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.agendado;
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
              Bem-vindo à sua área pessoal
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/settings')}>
              <Settings className="h-4 w-4 mr-2" />
              Configurações
            </Button>
            <Button variant="outline" onClick={logout}>
              Sair
            </Button>
          </div>
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
                Fazer Novo Pedido
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">Total de Pedidos</CardTitle>
              <FileText className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">{quickStats.totalOrders}</div>
              <p className="text-xs text-muted-foreground">
                Histórico completo
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">Pendentes</CardTitle>
              <Clock className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">{quickStats.pendingOrders}</div>
              <p className="text-xs text-muted-foreground">
                Aguardando atendimento
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">Concluídos</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">{quickStats.completedOrders}</div>
              <p className="text-xs text-muted-foreground">
                Exames realizados
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">Resultados</CardTitle>
              <Download className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">{quickStats.availableResults}</div>
              <p className="text-xs text-muted-foreground">
                Disponíveis para download
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Orders */}
        <Card className="mb-8 bg-card border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-card-foreground">Últimos Pedidos</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Seus pedidos mais recentes
                </CardDescription>
              </div>
              <Button 
                variant="outline" 
                onClick={() => navigate('/orders')}
                className="flex items-center gap-2"
              >
                Ver Todos
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {recentOrders.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Nenhum pedido encontrado</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Faça seu primeiro pedido
                </p>
                <Button onClick={() => navigate('/search')}>
                  Buscar Serviços
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 border border-border rounded-lg bg-background">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Activity className="h-4 w-4 text-primary" />
                        <h4 className="font-medium text-foreground">{order.service}</h4>
                        {getStatusBadge(order.status)}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        <Building2 className="h-3 w-3" />
                        <span>{order.company}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        <User className="h-3 w-3" />
                        <span>Paciente: {order.patient}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {new Date(order.date).toLocaleDateString('pt-BR')} às {order.time} - {order.location}
                        </span>
                      </div>
                      <div className="text-sm font-medium text-foreground mt-1">
                        R$ {order.amount.toFixed(2)}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {order.status === 'concluido' && (
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4 mr-2" />
                          Resultado
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <FileText className="h-8 w-8 text-blue-500 mb-2" />
                <h3 className="font-medium mb-1 text-card-foreground">Meus Pedidos</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Histórico completo de exames
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
                <User className="h-8 w-8 text-green-500 mb-2" />
                <h3 className="font-medium mb-1 text-card-foreground">Meus Pacientes</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Gerir dependentes
                </p>
                <Button variant="outline" onClick={() => navigate('/patients')}>
                  Gerenciar
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <Settings className="h-8 w-8 text-purple-500 mb-2" />
                <h3 className="font-medium mb-1 text-card-foreground">Configurações</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Dados pessoais e conta
                </p>
                <Button variant="outline" onClick={() => navigate('/settings')}>
                  Configurar
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
