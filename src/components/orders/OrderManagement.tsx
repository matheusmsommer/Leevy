
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Eye, Search, Filter, Package, Calendar, DollarSign, Settings, Wrench } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { OrderFilter } from '@/types/order';
import OrderDetailsModal from './OrderDetailsModal';

interface DatabaseOrder {
  id: string;
  order_number: string;
  patient_name: string;
  patient_id: string;
  customer_name: string;
  customer_id: string;
  services: string[];
  service_names: string[];
  location_id: string;
  location_name: string;
  scheduled_date?: string;
  scheduled_time?: string;
  attendance_type: 'presencial' | 'domiciliar' | 'livre';
  status: string;
  payment_status: 'pendente' | 'aprovado' | 'rejeitado';
  total_amount: number;
  observations?: string;
  result_files?: Array<{
    id: string;
    filename: string;
    url: string;
    uploaded_at: string;
  }>;
  result_link?: string;
  created_at: string;
  updated_at: string;
}

const OrderManagement = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [orders, setOrders] = useState<DatabaseOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<OrderFilter>({});
  const [selectedOrder, setSelectedOrder] = useState<DatabaseOrder | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    if (!user) return;

    try {
      console.log('Fetching orders for user:', user.id);
      
      const { data, error } = await supabase
        .from('orders')
        .select(`
          id,
          patient_name,
          patient_cpf,
          patient_phone,
          total_amount,
          status,
          scheduled_date,
          created_at,
          updated_at,
          location:locations(name),
          order_items(
            quantity,
            unit_price,
            service:company_services!inner(
              service:services!inner(name)
            )
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching orders:', error);
        toast({
          title: "Erro ao carregar pedidos",
          description: "Não foi possível carregar seus pedidos.",
          variant: "destructive",
        });
        return;
      }

      console.log('Orders loaded:', data);
      
      // Transformar os dados para o formato esperado
      const transformedOrders: DatabaseOrder[] = (data || []).map(order => ({
        id: order.id,
        order_number: `ORD-${order.id.slice(0, 8).toUpperCase()}`,
        patient_name: order.patient_name,
        patient_id: order.patient_cpf,
        customer_name: order.patient_name,
        customer_id: user.id,
        services: order.order_items.map(item => item.service.service.name),
        service_names: order.order_items.map(item => item.service.service.name),
        location_id: '',
        location_name: order.location?.name || 'N/A',
        scheduled_date: order.scheduled_date ? new Date(order.scheduled_date).toISOString().split('T')[0] : undefined,
        scheduled_time: order.scheduled_date ? new Date(order.scheduled_date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : undefined,
        attendance_type: order.scheduled_date ? 'presencial' : 'livre',
        status: order.status || 'pending',
        payment_status: 'aprovado',
        total_amount: Number(order.total_amount),
        observations: '',
        created_at: order.created_at,
        updated_at: order.updated_at
      }));

      setOrders(transformedOrders);
    } catch (error) {
      console.error('Error in fetchOrders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      aguardando_atendimento: { label: 'Aguardando Atendimento', variant: 'secondary' as const },
      em_atendimento: { label: 'Em Atendimento', variant: 'default' as const },
      aguardando_pagamento: { label: 'Aguardando Pagamento', variant: 'destructive' as const },
      concluido: { label: 'Concluído', variant: 'default' as const },
      completed: { label: 'Concluído', variant: 'default' as const },
      pending: { label: 'Pendente', variant: 'secondary' as const },
      cancelado: { label: 'Cancelado', variant: 'destructive' as const }
    };

    const config = statusMap[status as keyof typeof statusMap] || { label: status, variant: 'secondary' as const };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const filteredOrders = orders.filter(order => {
    if (filters.status && order.status !== filters.status) return false;
    if (filters.patientName && !order.patient_name.toLowerCase().includes(filters.patientName.toLowerCase())) return false;
    if (filters.dateFrom && order.created_at < filters.dateFrom) return false;
    if (filters.dateTo && order.created_at > filters.dateTo) return false;
    return true;
  });

  const handleViewDetails = (order: DatabaseOrder) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

  const handleUpdateOrder = (updatedOrder: DatabaseOrder) => {
    setOrders(prev => prev.map(order => 
      order.id === updatedOrder.id ? updatedOrder : order
    ));
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-card-foreground">
              <Package className="h-5 w-5 text-primary" />
              Meus Pedidos
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Carregando seus pedidos...
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-card-foreground">
            <Package className="h-5 w-5 text-primary" />
            Meus Pedidos
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Visualize e gerencie seus pedidos de exames
          </CardDescription>
        </CardHeader>
        <CardContent className="bg-card">
          {/* Filtros */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="text-sm font-medium mb-2 block text-card-foreground">Status</label>
              <Select value={filters.status || ''} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value || undefined }))}>
                <SelectTrigger className="bg-background border-input text-foreground">
                  <SelectValue placeholder="Todos os status" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="">Todos os status</SelectItem>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="aguardando_atendimento">Aguardando Atendimento</SelectItem>
                  <SelectItem value="em_atendimento">Em Atendimento</SelectItem>
                  <SelectItem value="completed">Concluído</SelectItem>
                  <SelectItem value="cancelado">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block text-card-foreground">Nome do Paciente</label>
              <Input
                placeholder="Buscar por nome..."
                value={filters.patientName || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, patientName: e.target.value || undefined }))}
                className="bg-background border-input text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block text-card-foreground">Data Inicial</label>
              <Input
                type="date"
                value={filters.dateFrom || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value || undefined }))}
                className="bg-background border-input text-foreground"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block text-card-foreground">Data Final</label>
              <Input
                type="date"
                value={filters.dateTo || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value || undefined }))}
                className="bg-background border-input text-foreground"
              />
            </div>
          </div>

          {/* Lista de Pedidos */}
          <div className="space-y-4">
            {filteredOrders.length === 0 ? (
              <div className="text-center py-8">
                <Filter className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">
                  {orders.length === 0 ? 'Você ainda não fez nenhum pedido.' : 'Nenhum pedido encontrado com os filtros aplicados.'}
                </p>
              </div>
            ) : (
              filteredOrders.map((order) => (
                <div key={order.id} className="border border-border rounded-lg p-4 hover:bg-accent/50 transition-colors bg-card">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <h3 className="font-semibold text-card-foreground">{order.order_number}</h3>
                        {getStatusBadge(order.status)}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-card-foreground flex items-center gap-1 mb-1">
                            <Search className="h-3 w-3 text-primary" />
                            Paciente:
                          </span>
                          <p className="text-muted-foreground">{order.patient_name}</p>
                        </div>
                        
                        <div>
                          <span className="font-medium text-card-foreground flex items-center gap-1 mb-1">
                            <Wrench className="h-3 w-3 text-primary" />
                            Exames:
                          </span>
                          <p className="text-muted-foreground">{order.service_names.join(', ')}</p>
                        </div>
                        
                        <div>
                          <span className="font-medium text-card-foreground flex items-center gap-1 mb-1">
                            <Calendar className="h-3 w-3 text-primary" />
                            Data/Hora:
                          </span>
                          <p className="text-muted-foreground">
                            {order.scheduled_date && order.scheduled_time 
                              ? `${new Date(order.scheduled_date).toLocaleDateString('pt-BR')} às ${order.scheduled_time}`
                              : 'Comparecimento livre'
                            }
                          </p>
                        </div>
                        
                        <div>
                          <span className="font-medium text-card-foreground flex items-center gap-1 mb-1">
                            <DollarSign className="h-3 w-3 text-primary" />
                            Valor:
                          </span>
                          <p className="text-muted-foreground">R$ {order.total_amount.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetails(order)}
                      className="ml-4 border-border text-foreground hover:bg-accent"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Ver Detalhes
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Modal de Detalhes */}
      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder as any}
          open={showDetailsModal}
          onOpenChange={setShowDetailsModal}
          onUpdate={handleUpdateOrder as any}
        />
      )}
    </div>
  );
};

export default OrderManagement;
