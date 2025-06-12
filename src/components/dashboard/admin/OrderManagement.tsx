
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Eye, Download, ShoppingCart } from 'lucide-react';

const OrderManagement = () => {
  const orders = [
    { id: '1', patient: 'João Silva', service: 'Hemograma Completo', amount: 45.00, date: '2024-03-15', status: 'concluido', location: 'Unidade Centro' },
    { id: '2', patient: 'Maria Santos', service: 'Glicemia de Jejum', amount: 25.00, date: '2024-03-14', status: 'agendado', location: 'Unidade Zona Sul' },
    { id: '3', patient: 'Pedro Costa', service: 'Check-up Básico', amount: 85.00, date: '2024-03-13', status: 'pendente', location: 'Unidade Centro' },
    { id: '4', patient: 'Ana Carolina', service: 'Ultrassom Abdome', amount: 120.00, date: '2024-03-12', status: 'concluido', location: 'Unidade Norte' },
  ];

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'concluido':
        return <Badge className="bg-primary/10 text-primary border-primary/20">Concluído</Badge>;
      case 'agendado':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Agendado</Badge>;
      case 'pendente':
        return <Badge variant="outline" className="border-muted text-muted-foreground">Pendente</Badge>;
      default:
        return <Badge className="bg-destructive/10 text-destructive border-destructive/20">Cancelado</Badge>;
    }
  };

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
          <div className="border border-border rounded-xl overflow-hidden bg-card">
            <Table>
              <TableHeader>
                <TableRow className="border-border bg-muted/30">
                  <TableHead className="text-muted-foreground font-semibold py-4">Paciente</TableHead>
                  <TableHead className="text-muted-foreground font-semibold">Serviço</TableHead>
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
                    <TableCell className="font-semibold text-foreground py-4">{order.patient}</TableCell>
                    <TableCell className="text-foreground">{order.service}</TableCell>
                    <TableCell className="text-foreground font-semibold">
                      R$ {order.amount.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(order.date).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell className="text-foreground">{order.location}</TableCell>
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

          {orders.length === 0 && (
            <div className="text-center py-12">
              <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Nenhum pedido encontrado</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderManagement;
