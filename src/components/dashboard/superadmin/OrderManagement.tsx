
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Download, Eye, Check, ShoppingCart } from 'lucide-react';

interface Order {
  id: string;
  company: string;
  patient: string;
  service: string;
  amount: number;
  commission: number;
  date: string;
  status: string;
  commissionPaid: boolean;
}

interface OrderManagementProps {
  allOrders: Order[];
  onExportOrders: () => void;
  onMarkCommissionPaid: (orderId: string) => void;
}

const OrderManagement = ({ allOrders, onExportOrders, onMarkCommissionPaid }: OrderManagementProps) => {
  const getStatusBadge = (status: string) => {
    const normalizedStatus = status.toLowerCase();
    
    if (normalizedStatus === 'concluido') {
      return (
        <Badge className="bg-primary/10 text-primary border-primary/20">
          Concluído
        </Badge>
      );
    } else if (normalizedStatus === 'pendente') {
      return (
        <Badge variant="outline" className="border-muted text-muted-foreground">
          Pendente
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-destructive/10 text-destructive border-destructive/20">
          Cancelado
        </Badge>
      );
    }
  };

  return (
    <Card className="border-border shadow-sm">
      <CardHeader className="pb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <ShoppingCart className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl font-semibold text-foreground">Gestão de Vendas</CardTitle>
            <CardDescription className="text-muted-foreground">
              Todos os pedidos realizados na plataforma
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-muted/20 rounded-lg p-4">
          <div className="text-sm text-foreground font-medium">
            {allOrders.length} pedidos encontrados
          </div>
          <Button onClick={onExportOrders} variant="outline" className="border-border w-full sm:w-auto">
            <Download className="h-4 w-4 mr-2" />
            Exportar CSV
          </Button>
        </div>

        <div className="border border-border rounded-xl overflow-hidden bg-card">
          <Table>
            <TableHeader>
              <TableRow className="border-border bg-muted/30">
                <TableHead className="text-muted-foreground font-semibold py-4">Empresa</TableHead>
                <TableHead className="text-muted-foreground font-semibold">Paciente</TableHead>
                <TableHead className="text-muted-foreground font-semibold">Serviço</TableHead>
                <TableHead className="text-muted-foreground font-semibold">Valor</TableHead>
                <TableHead className="text-muted-foreground font-semibold">Comissão</TableHead>
                <TableHead className="text-muted-foreground font-semibold">Data</TableHead>
                <TableHead className="text-muted-foreground font-semibold">Status</TableHead>
                <TableHead className="text-muted-foreground font-semibold text-center">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allOrders.map((order) => (
                <TableRow key={order.id} className="border-border hover:bg-muted/20 transition-colors">
                  <TableCell className="font-semibold text-foreground py-4">{order.company}</TableCell>
                  <TableCell className="text-foreground">{order.patient}</TableCell>
                  <TableCell className="text-foreground">{order.service}</TableCell>
                  <TableCell className="text-foreground font-semibold">
                    R$ {order.amount.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-foreground">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">R$ {order.commission.toFixed(2)}</span>
                      {order.commissionPaid ? (
                        <Badge className="text-xs bg-primary/10 text-primary border-primary/20">
                          Pago
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs border-muted text-muted-foreground">
                          Pendente
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(order.date).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2 justify-center">
                      <Button size="sm" variant="outline" className="border-border hover:bg-accent">
                        <Eye className="h-4 w-4" />
                      </Button>
                      {!order.commissionPaid && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="border-primary/20 text-primary hover:bg-primary/10"
                          onClick={() => onMarkCommissionPaid(order.id)}
                          title="Marcar comissão como paga"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {allOrders.length === 0 && (
          <div className="text-center py-12">
            <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Nenhum pedido encontrado</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OrderManagement;
