
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Download, Eye, Check } from 'lucide-react';

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
    const styles = {
      concluido: 'bg-green-100 text-green-800 border-green-200',
      pendente: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      cancelado: 'bg-red-100 text-red-800 border-red-200'
    };

    const normalizedStatus = status.toLowerCase() as keyof typeof styles;
    const style = styles[normalizedStatus] || styles.pendente;

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs border ${style}`}>
        {status}
      </span>
    );
  };

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="text-foreground">Gestão de Vendas</CardTitle>
        <CardDescription className="text-muted-foreground">
          Todos os pedidos realizados na plataforma
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              {allOrders.length} pedidos encontrados
            </div>
            <Button onClick={onExportOrders} variant="outline" className="border-border">
              <Download className="h-4 w-4 mr-2" />
              Exportar CSV
            </Button>
          </div>

          <div className="border border-border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow className="border-border">
                  <TableHead className="text-muted-foreground">Empresa</TableHead>
                  <TableHead className="text-muted-foreground">Paciente</TableHead>
                  <TableHead className="text-muted-foreground">Serviço</TableHead>
                  <TableHead className="text-muted-foreground">Valor</TableHead>
                  <TableHead className="text-muted-foreground">Comissão</TableHead>
                  <TableHead className="text-muted-foreground">Data</TableHead>
                  <TableHead className="text-muted-foreground">Status</TableHead>
                  <TableHead className="text-muted-foreground">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allOrders.map((order) => (
                  <TableRow key={order.id} className="border-border hover:bg-muted/50">
                    <TableCell className="font-medium text-foreground">{order.company}</TableCell>
                    <TableCell className="text-foreground">{order.patient}</TableCell>
                    <TableCell className="text-foreground">{order.service}</TableCell>
                    <TableCell className="text-foreground">R$ {order.amount.toFixed(2)}</TableCell>
                    <TableCell className="text-foreground">
                      <div className="flex items-center gap-2">
                        R$ {order.commission.toFixed(2)}
                        {order.commissionPaid ? (
                          <Badge variant="secondary" className="text-xs">Pago</Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs border-yellow-300 text-yellow-700">Pendente</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(order.date).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="border-border hover:bg-accent">
                          <Eye className="h-4 w-4" />
                        </Button>
                        {!order.commissionPaid && (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="border-border hover:bg-accent"
                            onClick={() => onMarkCommissionPaid(order.id)}
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
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderManagement;
