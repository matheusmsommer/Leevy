
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Eye, Search, Filter, Package, Calendar, DollarSign } from 'lucide-react';
import { Order, OrderFilter } from '@/types/order';
import OrderDetailsModal from './OrderDetailsModal';

const OrderManagement = () => {
  const [orders, setOrders] = useState<Order[]>([
    {
      id: '1',
      order_number: 'ORD-2024-001',
      patient_name: 'João Silva',
      patient_id: 'pat1',
      customer_name: 'João Silva',
      customer_id: 'user1',
      services: ['srv1', 'srv2'],
      service_names: ['Hemograma Completo', 'Glicemia'],
      location_id: 'loc1',
      location_name: 'Lab Centro',
      scheduled_date: '2024-01-20',
      scheduled_time: '09:00',
      attendance_type: 'presencial',
      status: 'aguardando_atendimento',
      payment_status: 'aprovado',
      total_amount: 85.00,
      observations: 'Jejum de 12 horas',
      created_at: '2024-01-15T10:00:00Z',
      updated_at: '2024-01-15T10:00:00Z'
    },
    {
      id: '2',
      order_number: 'ORD-2024-002',
      patient_name: 'Maria Santos',
      patient_id: 'pat2',
      customer_name: 'Maria Santos',
      customer_id: 'user2',
      services: ['srv3'],
      service_names: ['Check-up Básico'],
      location_id: 'loc1',
      location_name: 'Lab Centro',
      attendance_type: 'livre',
      status: 'concluido',
      payment_status: 'aprovado',
      total_amount: 180.00,
      result_files: [
        {
          id: 'file1',
          filename: 'resultado-checkup-maria.pdf',
          url: '/results/resultado-checkup-maria.pdf',
          uploaded_at: '2024-01-18T14:30:00Z'
        }
      ],
      created_at: '2024-01-16T14:00:00Z',
      updated_at: '2024-01-18T14:30:00Z'
    }
  ]);

  const [filters, setFilters] = useState<OrderFilter>({});
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const getStatusBadge = (status: string) => {
    const statusMap = {
      aguardando_atendimento: { label: 'Aguardando Atendimento', variant: 'secondary' as const },
      em_atendimento: { label: 'Em Atendimento', variant: 'default' as const },
      aguardando_pagamento: { label: 'Aguardando Pagamento', variant: 'destructive' as const },
      concluido: { label: 'Concluído', variant: 'default' as const },
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

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

  const handleUpdateOrder = (updatedOrder: Order) => {
    setOrders(prev => prev.map(order => 
      order.id === updatedOrder.id ? updatedOrder : order
    ));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-card-foreground">
            <Package className="h-5 w-5" />
            Gestão de Pedidos
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Visualize e gerencie todos os pedidos realizados pelos clientes
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filtros */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="text-sm font-medium mb-2 block text-foreground">Status</label>
              <Select value={filters.status || ''} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value || undefined }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos os status</SelectItem>
                  <SelectItem value="aguardando_atendimento">Aguardando Atendimento</SelectItem>
                  <SelectItem value="em_atendimento">Em Atendimento</SelectItem>
                  <SelectItem value="aguardando_pagamento">Aguardando Pagamento</SelectItem>
                  <SelectItem value="concluido">Concluído</SelectItem>
                  <SelectItem value="cancelado">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block text-foreground">Nome do Paciente</label>
              <Input
                placeholder="Buscar por nome..."
                value={filters.patientName || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, patientName: e.target.value || undefined }))}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block text-foreground">Data Inicial</label>
              <Input
                type="date"
                value={filters.dateFrom || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value || undefined }))}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block text-foreground">Data Final</label>
              <Input
                type="date"
                value={filters.dateTo || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value || undefined }))}
              />
            </div>
          </div>

          {/* Lista de Pedidos */}
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div key={order.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors bg-card">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <h3 className="font-semibold text-card-foreground">{order.order_number}</h3>
                      {getStatusBadge(order.status)}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                      <div>
                        <span className="font-medium text-foreground flex items-center gap-1">
                          <Search className="h-3 w-3" />
                          Paciente:
                        </span>
                        <p className="text-foreground">{order.patient_name}</p>
                      </div>
                      
                      <div>
                        <span className="font-medium text-foreground flex items-center gap-1">
                          <Package className="h-3 w-3" />
                          Exames:
                        </span>
                        <p className="text-foreground">{order.service_names.join(', ')}</p>
                      </div>
                      
                      <div>
                        <span className="font-medium text-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Data/Hora:
                        </span>
                        <p className="text-foreground">
                          {order.scheduled_date && order.scheduled_time 
                            ? `${new Date(order.scheduled_date).toLocaleDateString('pt-BR')} às ${order.scheduled_time}`
                            : 'Comparecimento livre'
                          }
                        </p>
                      </div>
                      
                      <div>
                        <span className="font-medium text-foreground flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          Valor:
                        </span>
                        <p className="text-foreground">R$ {order.total_amount.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewDetails(order)}
                    className="ml-4"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Ver Detalhes
                  </Button>
                </div>
              </div>
            ))}

            {filteredOrders.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Filter className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum pedido encontrado com os filtros aplicados.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Modal de Detalhes */}
      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          open={showDetailsModal}
          onOpenChange={setShowDetailsModal}
          onUpdate={handleUpdateOrder}
        />
      )}
    </div>
  );
};

export default OrderManagement;
