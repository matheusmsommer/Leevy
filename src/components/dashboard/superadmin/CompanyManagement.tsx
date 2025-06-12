
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Eye, UserCheck, Lock, RotateCcw } from 'lucide-react';

interface Company {
  id: string;
  name: string;
  cnpj: string;
  status: 'active' | 'pending' | 'blocked';
  collectPoints: number;
  ordersCount: number;
}

interface CompanyManagementProps {
  companies: Company[];
}

const CompanyManagement = ({ companies }: CompanyManagementProps) => {
  const getStatusBadge = (status: Company['status']) => {
    const styles = {
      active: 'bg-green-100 text-green-800 border-green-200',
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      blocked: 'bg-red-100 text-red-800 border-red-200'
    };

    const labels = {
      active: 'Ativo',
      pending: 'Pendente',
      blocked: 'Bloqueado'
    };

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs border ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="text-foreground">Gestão de Empresas</CardTitle>
        <CardDescription className="text-muted-foreground">
          Laboratórios e clínicas da plataforma
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="border border-border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead className="text-muted-foreground">Empresa</TableHead>
                <TableHead className="text-muted-foreground">CNPJ</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
                <TableHead className="text-muted-foreground">Pontos de Coleta</TableHead>
                <TableHead className="text-muted-foreground">Pedidos</TableHead>
                <TableHead className="text-muted-foreground">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {companies.map((company) => (
                <TableRow key={company.id} className="border-border hover:bg-muted/50">
                  <TableCell className="font-medium text-foreground">{company.name}</TableCell>
                  <TableCell className="text-foreground font-mono">{company.cnpj}</TableCell>
                  <TableCell>{getStatusBadge(company.status)}</TableCell>
                  <TableCell className="text-foreground">{company.collectPoints}</TableCell>
                  <TableCell className="text-foreground">{company.ordersCount}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="border-border hover:bg-accent">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="border-border hover:bg-accent">
                        <UserCheck className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="border-border hover:bg-accent">
                        <Lock className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="border-border hover:bg-accent">
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                    </div>
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

export default CompanyManagement;
