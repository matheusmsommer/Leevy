
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
  Clock
} from 'lucide-react';

const OrderHistory = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  // Mock data - seria substituído por dados reais
  const orders = [
    {
      id: '1',
      service_name: 'Hemograma Completo',
      patient_name: 'João Silva',
      company_name: 'Laboratório Central',
      location_name: 'São Paulo - Centro',
      type: 'laboratorial',
      scheduled_date: '2024-01-20',
      scheduled_time: '09:00',
      status: 'confirmado',
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
      type: 'consulta',
      scheduled_date: '2024-01-25',
      scheduled_time: '14:30',
      status: 'realizado',
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
      type: 'checkup',
      scheduled_date: '2024-02-01',
      scheduled_time: '08:00',
      status: 'pendente_pagamento',
      payment_status: 'pendente',
      amount: 350.00,
      created_at: '2024-01-20',
      has_result: false
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pendente_pagamento: { label: 'Pendente Pagamento', variant: 'secondary' as const },
      confirmado: { label: 'Confirmado', variant: 'default' as const },
      realizado: { label: 'Realizado', variant: 'outline' as const },
      cancelado: { label: 'Cancelado', variant: 'destructive' as const }
    };
    
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.confirmado;
  };

  const getTypeBadge = (type: string) => {
    const typeConfig = {
      laboratorial: { label: 'Laboratorial', color: 'bg-blue-100 text-blue-800' },
      imagem: { label: 'Imagem', color: 'bg-purple-100 text-purple-800' },
      consulta: { label: 'Consulta', color: 'bg-green-100 text-green-800' },
      checkup: { label: 'Check-up', color: 'bg-orange-100 text-orange-800' }
    };
    
    const config = typeConfig[type as keyof typeof typeConfig] || typeConfig.laboratorial;
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.service_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.company_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesType = typeFilter === 'all' || order.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gradient">Meus Pedidos</h1>
            <p className="text-sm text-muted-foreground">
              Histórico completo dos seus agendamentos e serviços
            </p>
          </div>
          <Button onClick={() => navigate('/dashboard')}>
            Voltar ao Dashboard
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
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
                  className="pl-10"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Status</SelectItem>
                  <SelectItem value="pendente_pagamento">Pendente Pagamento</SelectItem>
                  <SelectItem value="confirmado">Confirmado</SelectItem>
                  <SelectItem value="realizado">Realizado</SelectItem>
                  <SelectItem value="cancelado">Cancelado</SelectItem>
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Tipos</SelectItem>
                  <SelectItem value="laboratorial">Laboratorial</SelectItem>
                  <SelectItem value="imagem">Imagem</SelectItem>
                  <SelectItem value="consulta">Consulta</SelectItem>
                  <SelectItem value="checkup">Check-up</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== 'all' || typeFilter !== 'all' 
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
                <Card key={order.id}>
                  <CardContent className="pt-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-lg">{order.service_name}</h3>
                              {getTypeBadge(order.type)}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {order.company_name}
                            </p>
                          </div>
                          <Badge variant={statusBadge.variant}>
                            {statusBadge.label}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span>Paciente: {order.patient_name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <span>{order.location_name}</span>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            {order.scheduled_date && order.scheduled_time && (
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span>
                                  {new Date(order.scheduled_date).toLocaleDateString('pt-BR')} às {order.scheduled_time}
                                </span>
                              </div>
                            )}
                            <div className="flex items-center gap-2">
                              <DollarSign className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">R$ {order.amount.toFixed(2)}</span>
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
                        <Button variant="outline" size="sm">
                          Ver Detalhes
                        </Button>
                        {order.status === 'confirmado' && (
                          <Button variant="outline" size="sm">
                            Reagendar
                          </Button>
                        )}
                        {order.status === 'pendente_pagamento' && (
                          <Button size="sm">
                            Finalizar Pagamento
                          </Button>
                        )}
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
