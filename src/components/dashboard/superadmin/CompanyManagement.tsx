
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Eye, UserCheck, Lock, RotateCcw } from 'lucide-react';

interface Company {
  id: string;
  name: string;
  cnpj: string;
  status: string;
  locations: number;
  orders: number;
  created_at: string;
}

interface CompanyManagementProps {
  companies: Company[];
  onViewCompany: (companyId: string) => void;
  onImpersonateCompany: (companyId: string) => void;
  onBlockCompany: (companyId: string) => void;
}

const CompanyManagement = ({ companies, onViewCompany, onImpersonateCompany, onBlockCompany }: CompanyManagementProps) => {
  const getStatusBadge = (status: string) => {
    const styles = {
      ativo: 'bg-green-100 text-green-800 border-green-200',
      pendente: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      bloqueado: 'bg-red-100 text-red-800 border-red-200'
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
                <TableHead className="text-muted-foreground">Unidades</TableHead>
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
                  <TableCell className="text-foreground">{company.locations}</TableCell>
                  <TableCell className="text-foreground">{company.orders}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="border-border hover:bg-accent"
                        onClick={() => onViewCompany(company.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="border-border hover:bg-accent"
                        onClick={() => onImpersonateCompany(company.id)}
                      >
                        <UserCheck className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="border-border hover:bg-accent"
                        onClick={() => onBlockCompany(company.id)}
                      >
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
