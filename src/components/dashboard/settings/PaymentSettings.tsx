
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DollarSign, TrendingUp } from 'lucide-react';

interface PaymentSettingsProps {
  companyId: string;
}

const PaymentSettings: React.FC<PaymentSettingsProps> = ({ companyId }) => {
  const paymentData = {
    fixedFee: 2.50,
    commissionPercentage: 10,
    totalSales: 15750.00,
    commissionPaid: 1575.00,
    pendingTransfers: 450.00
  };

  const transfers = [
    {
      id: '1',
      date: '2024-01-10',
      amount: 890.00,
      status: 'Efetuado'
    },
    {
      id: '2',
      date: '2024-01-03',
      amount: 1200.00,
      status: 'Efetuado'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Pagamentos e Comissão
        </CardTitle>
        <CardDescription>
          Informações sobre taxas e repasses (somente leitura)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Taxa Fixa</p>
                  <p className="text-2xl font-bold">R$ {paymentData.fixedFee.toFixed(2)}</p>
                </div>
                <DollarSign className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Comissão</p>
                  <p className="text-2xl font-bold">{paymentData.commissionPercentage}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pendente</p>
                  <p className="text-2xl font-bold">R$ {paymentData.pendingTransfers.toFixed(2)}</p>
                </div>
                <DollarSign className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Histórico de Repasses</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transfers.map((transfer) => (
                <TableRow key={transfer.id}>
                  <TableCell>{transfer.date}</TableCell>
                  <TableCell>R$ {transfer.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {transfer.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentSettings;
