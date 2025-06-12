
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Eye, Shield, Lock } from 'lucide-react';

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

const CompanyManagement = ({ 
  companies, 
  onViewCompany, 
  onImpersonateCompany, 
  onBlockCompany 
}: CompanyManagementProps) => {
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      ativo: { label: 'Ativo', variant: 'default' as const },
      pendente: { label: 'Pendente', variant: 'secondary' as const },
      bloqueado: { label: 'Bloqueado', variant: 'destructive' as const }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.ativo;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestão de Empresas</CardTitle>
        <CardDescription>Laboratórios e clínicas cadastradas</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Empresa</TableHead>
              <TableHead>CNPJ</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Locais</TableHead>
              <TableHead>Pedidos</TableHead>
              <TableHead>Cadastro</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {companies.map((company) => (
              <TableRow key={company.id}>
                <TableCell className="font-medium">{company.name}</TableCell>
                <TableCell>{company.cnpj}</TableCell>
                <TableCell>{getStatusBadge(company.status)}</TableCell>
                <TableCell>{company.locations}</TableCell>
                <TableCell>{company.orders}</TableCell>
                <TableCell>
                  {new Date(company.created_at).toLocaleDateString('pt-BR')}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => onViewCompany(company.id)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => onImpersonateCompany(company.id)}
                    >
                      <Shield className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => onBlockCompany(company.id)}
                    >
                      <Lock className="h-4 w-4" />
                    </Button>
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

export default CompanyManagement;
