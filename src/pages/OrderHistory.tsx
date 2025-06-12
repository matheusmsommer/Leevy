
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  MapPin, 
  FileText, 
  DollarSign, 
  Download, 
  Search,
  Filter,
  User,
  Clock,
  Building2,
  Activity,
  ArrowLeft,
  Eye
} from 'lucide-react';

const OrderHistory = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  // Mock data - seria substituído por dados reais
  const orders = [
    {
      id: '1',
      service_name: 'Hemograma Completo',
      patient_name: 'João Silva',
      company_name: 'Laboratório Central',
      location_name: 'São Paulo - Centro',
      scheduled_date: '2024-01-20',
      scheduled_time: '09:00',
      status: 'agendado',
      payment_status: 'aprovado',
      amount: 45.00,
      created_at: '2024-01-15',
      has_result: false
    },
    {
      id: '2',
      service_name: 'Consulta Cardiologista',
      patient_name: 'Maria Silva',
      company_name: 'Clínica CardioVida',
      location_name: 'São Paulo - Itaim',
      scheduled_date: '2024-01-25',
      scheduled_time: '14:30',
      status: 'concluido',
      payment_status: 'aprovado',
      amount: 180.00,
      created_at: '2024-01-18',
      has_result: true
    },
    {
      id: '3',
      service_name: 'Check-up Executivo',
      patient_name: 'João Silva',
      company_name: 'Centro Médico Premium',
      location_name: 'São Paulo - Faria Lima',
      scheduled_date: '2024-02-01',
      scheduled_time: '08:00',
      status: 'em_andamento',
      payment_status: 'aprovado',
      amount: 350.00,
      created_at: '2024-01-20',
      has_result: false
    },
    {
      id: '4',
      service_name: 'Ressonância Magnética',
      patient_name: 'João Silva',
      company_name: 'Instituto de Imagem',
      location_name: 'São Paulo - Vila Olímpia',
      scheduled_date: '2023-12-15',
      scheduled_time: '16:00',
      status: 'cancelado',
      payment_status: 'estornado',
      amount: 280.00,
      created_at: '2023-12-10',
      has_result: false
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      agendado: { label: 'Agendado', variant: 'default' as const },
      em_andamento: { label: 'Em Andamento', variant: 'secondary' as const },
      concluido: { label: 'Concluído', variant: 'outline' as const },
      cancelado: { label: 'Cancelado', variant: 'destructive' as const }
    };
    
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.agendado;
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.service_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.company_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    let matchesDate = true;
    if (dateFilter !== 'all') {
      const orderDate = new Date(order.created_at);
      const now = new Date();
      const daysDiff = Math.floor((now.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24));
      
      switch (dateFilter) {
        case 'last7days':
          matchesDate = daysDiff <= 7;
          break;
        case 'last30days':
          matchesDate = daysDiff <= 30;
          break;
        case 'last90days':
          matchesDate = daysDiff <= 90;
          break;
      }
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const handleViewDetails = (orderId: string) => {
    // Implementar visualização de detalhes
    console.log('Ver detalhes do pedido:', orderId);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Meus Pedidos</h1>
            <p className="text-sm text-muted-foreground">
              Histórico completo dos seus agendamentos e serviços
            </p>
          </div>
          <Button onClick={() => navigate('/dashboard')} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Estatísticas rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-card border-border">
            <CardContent className="pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-card-foreground">{orders.length}</div>
                <p className="text-sm text-muted-foreground">Total de Pedidos</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {orders.filter(o => o.status === 'concluido').length}
                </div>
                <p className="text-sm text-muted-foreground">Concluídos</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {orders.filter(o => o.status === 'agendado' || o.status === 'em_andamento').length}
                </div>
                <p className="text-sm text-muted-foreground">Em Andamento</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  R$ {orders.reduce((sum, order) => sum + order.amount, 0).toFixed(2)}
                </div>
                <p className="text-sm text-muted-foreground">Total Gasto</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <Card className="mb-6 bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-card-foreground">
              <Filter className="h-5 w-5 text-primary" />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por serviço, paciente ou empresa..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-background border-input text-foreground placeholder:text-muted-foreground"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="bg-background border-input text-foreground">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="all">Todos os Status</SelectItem>
                  <SelectItem value="agendado">Agendado</SelectItem>
                  <SelectItem value="em_andamento">Em Andamento</SelectItem>
                  <SelectItem value="concluido">Concluído</SelectItem>
                  <SelectItem value="cancelado">Cancelado</SelectItem>
                </SelectContent>
              </Select>

              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="bg-background border-input text-foreground">
                  <SelectValue placeholder="Período" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="all">Todos os Períodos</SelectItem>
                  <SelectItem value="last7days">Últimos 7 dias</SelectItem>
                  <SelectItem value="last30days">Últimos 30 dias</SelectItem>
                  <SelectItem value="last90days">Últimos 90 dias</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Pedidos */}
        {filteredOrders.length === 0 ? (
          <Card className="bg-card border-border">
            <CardContent className="py-8 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== 'all' || dateFilter !== 'all' 
                  ? 'Nenhum pedido encontrado com os filtros aplicados'
                  : 'Nenhum pedido encontrado'
                }
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                Faça seu primeiro agendamento para ver o histórico aqui
              </p>
              <Button onClick={() => navigate('/search')}>
                Buscar Serviços
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const statusBadge = getStatusBadge(order.status);
              
              return (
                <Card key={order.id} className="bg-card border-border">
                  <CardContent className="pt-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Activity className="h-5 w-5 text-primary" />
                              <h3 className="font-semibold text-lg text-card-foreground">{order.service_name}</h3>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Building2 className="h-4 w-4" />
                              <span>{order.company_name}</span>
                            </div>
                          </div>
                          <Badge variant={statusBadge.variant}>
                            {statusBadge.label}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span className="text-foreground">Paciente: {order.patient_name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <span className="text-foreground">{order.location_name}</span>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            {order.scheduled_date && order.scheduled_time && (
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span className="text-foreground">
                                  {new Date(order.scheduled_date).toLocaleDateString('pt-BR')} às {order.scheduled_time}
                                </span>
                              </div>
                            )}
                            <div className="flex items-center gap-2">
                              <DollarSign className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium text-foreground">R$ {order.amount.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>Pedido criado em {new Date(order.created_at).toLocaleDateString('pt-BR')}</span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 lg:w-48">
                        {order.has_result && (
                          <Button variant="outline" size="sm" className="flex items-center gap-2">
                            <Download className="h-4 w-4" />
                            Baixar Resultado
                          </Button>
                        )}
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewDetails(order.id)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Ver Detalhes
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
