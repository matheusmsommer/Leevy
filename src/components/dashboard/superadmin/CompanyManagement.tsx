
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Eye, UserCheck, Lock, RotateCcw, Building2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
  onViewCompany: (companyId: string) => void;
  onImpersonateCompany: (companyId: string) => void;
  onBlockCompany: (companyId: string) => void;
}

const CompanyManagement = ({ onViewCompany, onImpersonateCompany, onBlockCompany }: CompanyManagementProps) => {
  const { toast } = useToast();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      console.log('Fetching companies...');
      
      const { data: companiesData, error: companiesError } = await supabase
        .from('companies')
        .select('*')
        .order('created_at', { ascending: false });

      if (companiesError) {
        console.error('Error fetching companies:', companiesError);
        toast({
          title: "Erro ao carregar empresas",
          description: "Não foi possível carregar as empresas.",
          variant: "destructive",
        });
        return;
      }

      console.log('Companies loaded:', companiesData);

      // Para cada empresa, buscar número de locais e pedidos
      const enrichedCompanies = await Promise.all(
        (companiesData || []).map(async (company) => {
          // Buscar número de locais
          const { count: locationsCount } = await supabase
            .from('locations')
            .select('*', { count: 'exact', head: true })
            .eq('company_id', company.id);

          // Buscar número de pedidos
          const { count: ordersCount } = await supabase
            .from('orders')
            .select('*', { count: 'exact', head: true })
            .eq('company_id', company.id);

          return {
            id: company.id,
            name: company.name,
            cnpj: company.cnpj || 'N/A',
            status: company.status || 'pending',
            locations: locationsCount || 0,
            orders: ordersCount || 0,
            created_at: company.created_at
          };
        })
      );

      setCompanies(enrichedCompanies);
    } catch (error) {
      console.error('Error in fetchCompanies:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const normalizedStatus = status.toLowerCase();
    
    if (normalizedStatus === 'ativo' || normalizedStatus === 'active') {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
          Ativo
        </span>
      );
    } else if (normalizedStatus === 'pendente' || normalizedStatus === 'pending') {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground border border-border">
          Pendente
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-destructive/10 text-destructive border border-destructive/20">
          {status}
        </span>
      );
    }
  };

  if (loading) {
    return (
      <Card className="border-border shadow-sm">
        <CardHeader className="pb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl font-semibold text-foreground">Gestão de Empresas</CardTitle>
              <CardDescription className="text-muted-foreground">
                Carregando empresas...
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border shadow-sm">
      <CardHeader className="pb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Building2 className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl font-semibold text-foreground">Gestão de Empresas</CardTitle>
            <CardDescription className="text-muted-foreground">
              Laboratórios e clínicas da plataforma
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="border border-border rounded-xl overflow-hidden bg-card">
          <Table>
            <TableHeader>
              <TableRow className="border-border bg-muted/30">
                <TableHead className="text-muted-foreground font-semibold py-4">Empresa</TableHead>
                <TableHead className="text-muted-foreground font-semibold">CNPJ</TableHead>
                <TableHead className="text-muted-foreground font-semibold">Status</TableHead>
                <TableHead className="text-muted-foreground font-semibold">Unidades</TableHead>
                <TableHead className="text-muted-foreground font-semibold">Pedidos</TableHead>
                <TableHead className="text-muted-foreground font-semibold text-center">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {companies.map((company) => (
                <TableRow key={company.id} className="border-border hover:bg-muted/20 transition-colors">
                  <TableCell className="font-semibold text-foreground py-4">{company.name}</TableCell>
                  <TableCell className="text-foreground font-mono text-sm bg-muted/20 rounded px-2 py-1 w-fit">
                    {company.cnpj}
                  </TableCell>
                  <TableCell>{getStatusBadge(company.status)}</TableCell>
                  <TableCell className="text-foreground font-medium">{company.locations}</TableCell>
                  <TableCell className="text-foreground font-medium">{company.orders}</TableCell>
                  <TableCell>
                    <div className="flex gap-2 justify-center">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="border-border hover:bg-accent"
                        onClick={() => onViewCompany(company.id)}
                        title="Visualizar empresa"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="border-border hover:bg-accent"
                        onClick={() => onImpersonateCompany(company.id)}
                        title="Acessar como empresa"
                      >
                        <UserCheck className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="border-destructive/20 text-destructive hover:bg-destructive/10"
                        onClick={() => onBlockCompany(company.id)}
                        title="Bloquear empresa"
                      >
                        <Lock className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="border-border hover:bg-accent"
                        title="Resetar dados"
                      >
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {companies.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Nenhuma empresa cadastrada ainda</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CompanyManagement;
