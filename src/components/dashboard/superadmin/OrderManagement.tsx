
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, Eye } from 'lucide-react';

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
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Gestão de Vendas</CardTitle>
            <CardDescription>Todos os pedidos da plataforma</CardDescription>
          </div>
          <Button onClick={onExportOrders}>
            <Download className="h-4 w-4 mr-2" />
            Exportar CSV
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Empresa</TableHead>
              <TableHead>Paciente</TableHead>
              <TableHead>Serviço</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Comissão</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.company}</TableCell>
                <TableCell>{order.patient}</TableCell>
                <TableCell>{order.service}</TableCell>
                <TableCell>R$ {order.amount.toFixed(2)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    R$ {order.commission.toFixed(2)}
                    {order.commissionPaid && (
                      <Badge variant="outline" className="text-green-600">
                        Paga
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {new Date(order.date).toLocaleDateString('pt-BR')}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="capitalize">
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4" />
                    </Button>
                    {!order.commissionPaid && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => onMarkCommissionPaid(order.id)}
                      >
                        Marcar Pago
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default OrderManagement;
