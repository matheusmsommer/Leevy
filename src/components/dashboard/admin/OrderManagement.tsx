
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Eye, Download, ShoppingCart } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Order {
  id: string;
  patient_name: string;
  patient_cpf: string;
  patient_phone?: string;
  total_amount: number;
  status: string;
  scheduled_date?: string;
  created_at: string;
  location: {
    name: string;
  };
  order_items: Array<{
    quantity: number;
    unit_price: number;
    service: {
      exam: {
        name: string;
      };
    };
  }>;
}

const OrderManagement = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    if (!user) return;

    try {
      console.log('Fetching orders for user:', user.id);
      
      // Primeiro, buscar o perfil do usuário para obter company_id
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error('Error fetching user profile:', profileError);
        return;
      }

      if (!profile?.company_id) {
        console.log('User has no company_id');
        setOrders([]);
        setLoading(false);
        return;
      }

      // Buscar pedidos da empresa
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
          location:locations!inner(name),
          order_items(
            quantity,
            unit_price,
            service:company_services!inner(
              exam:exams!inner(name)
            )
          )
        `)
        .eq('company_id', profile.company_id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching orders:', error);
        toast({
          title: "Erro ao carregar pedidos",
          description: "Não foi possível carregar os pedidos da empresa.",
          variant: "destructive",
        });
        return;
      }

      console.log('Orders loaded:', data);
      setOrders(data || []);
    } catch (error) {
      console.error('Error in fetchOrders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'concluido':
        return <Badge className="bg-primary/10 text-primary border-primary/20">Concluído</Badge>;
      case 'confirmed':
      case 'agendado':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Agendado</Badge>;
      case 'pending':
      case 'pendente':
        return <Badge variant="outline" className="border-muted text-muted-foreground">Pendente</Badge>;
      default:
        return <Badge className="bg-destructive/10 text-destructive border-destructive/20">Cancelado</Badge>;
    }
  };

  const getServiceNames = (orderItems: Order['order_items']) => {
    return orderItems.map(item => item.service.exam.name).join(', ');
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Pedidos</h1>
            <p className="text-muted-foreground mt-2">
              Gerencie todos os pedidos do seu laboratório
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Pedidos</h1>
          <p className="text-muted-foreground mt-2">
            Gerencie todos os pedidos do seu laboratório
          </p>
        </div>
        <Button variant="outline" className="border-border">
          <Download className="h-4 w-4 mr-2" />
          Exportar
        </Button>
      </div>

      <Card className="border-border shadow-sm">
        <CardHeader className="pb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <ShoppingCart className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl font-semibold text-foreground">Histórico de Pedidos</CardTitle>
              <CardDescription className="text-muted-foreground">
                Todos os pedidos realizados
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Nenhum pedido encontrado</p>
            </div>
          ) : (
            <div className="border border-border rounded-xl overflow-hidden bg-card">
              <Table>
                <TableHeader>
                  <TableRow className="border-border bg-muted/30">
                    <TableHead className="text-muted-foreground font-semibold py-4">Paciente</TableHead>
                    <TableHead className="text-muted-foreground font-semibold">Serviços</TableHead>
                    <TableHead className="text-muted-foreground font-semibold">Valor</TableHead>
                    <TableHead className="text-muted-foreground font-semibold">Data</TableHead>
                    <TableHead className="text-muted-foreground font-semibold">Unidade</TableHead>
                    <TableHead className="text-muted-foreground font-semibold">Status</TableHead>
                    <TableHead className="text-muted-foreground font-semibold text-center">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id} className="border-border hover:bg-muted/20 transition-colors">
                      <TableCell className="font-semibold text-foreground py-4">
                        <div>
                          <p>{order.patient_name}</p>
                          <p className="text-xs text-muted-foreground">{order.patient_cpf}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-foreground max-w-xs">
                        <div className="truncate" title={getServiceNames(order.order_items)}>
                          {getServiceNames(order.order_items)}
                        </div>
                      </TableCell>
                      <TableCell className="text-foreground font-semibold">
                        R$ {order.total_amount.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell className="text-foreground">{order.location?.name || 'N/A'}</TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2 justify-center">
                          <Button size="sm" variant="outline" className="border-border hover:bg-accent">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderManagement;
