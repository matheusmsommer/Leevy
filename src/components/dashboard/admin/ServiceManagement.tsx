
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, TestTube, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface CompanyService {
  id: string;
  price: number;
  active: boolean;
  exam: {
    id: string;
    name: string;
    code: string;
    category: string;
    description?: string;
  };
}

const ServiceManagement = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [services, setServices] = useState<CompanyService[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompanyServices();
  }, [user]);

  const fetchCompanyServices = async () => {
    if (!user) return;

    try {
      console.log('Fetching company services for user:', user.id);
      
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
        setServices([]);
        setLoading(false);
        return;
      }

      // Buscar serviços da empresa com informações do exame
      const { data, error } = await supabase
        .from('company_services')
        .select(`
          id,
          price,
          active,
          exam:exams!inner(
            id,
            name,
            code,
            category,
            description
          )
        `)
        .eq('company_id', profile.company_id);

      if (error) {
        console.error('Error fetching company services:', error);
        toast({
          title: "Erro ao carregar serviços",
          description: "Não foi possível carregar os serviços da empresa.",
          variant: "destructive",
        });
        return;
      }

      console.log('Company services loaded:', data);
      setServices(data || []);
    } catch (error) {
      console.error('Error in fetchCompanyServices:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (serviceId: string, currentActive: boolean) => {
    try {
      const { error } = await supabase
        .from('company_services')
        .update({ active: !currentActive })
        .eq('id', serviceId);

      if (error) {
        console.error('Error updating service status:', error);
        toast({
          title: "Erro",
          description: "Não foi possível atualizar o status do serviço.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Sucesso",
        description: `Serviço ${!currentActive ? 'ativado' : 'desativado'} com sucesso.`,
      });

      // Recarregar dados
      fetchCompanyServices();
    } catch (error) {
      console.error('Error in handleToggleActive:', error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Serviços</h1>
            <p className="text-muted-foreground mt-2">
              Gerencie os exames oferecidos pelo seu laboratório
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
          <h1 className="text-3xl font-bold text-foreground">Serviços</h1>
          <p className="text-muted-foreground mt-2">
            Gerencie os exames oferecidos pelo seu laboratório
          </p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 shadow-sm">
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Serviço
        </Button>
      </div>

      <Card className="border-border shadow-sm">
        <CardHeader className="pb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <TestTube className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl font-semibold text-foreground">Catálogo de Serviços</CardTitle>
              <CardDescription className="text-muted-foreground">
                Exames disponíveis para venda
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {services.length === 0 ? (
            <div className="text-center py-12">
              <TestTube className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Nenhum serviço cadastrado ainda</p>
              <Button className="mt-4 bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Primeiro Serviço
              </Button>
            </div>
          ) : (
            <div className="border border-border rounded-xl overflow-hidden bg-card">
              <Table>
                <TableHeader>
                  <TableRow className="border-border bg-muted/30">
                    <TableHead className="text-muted-foreground font-semibold py-4">Nome do Exame</TableHead>
                    <TableHead className="text-muted-foreground font-semibold">Código</TableHead>
                    <TableHead className="text-muted-foreground font-semibold">Categoria</TableHead>
                    <TableHead className="text-muted-foreground font-semibold">Preço</TableHead>
                    <TableHead className="text-muted-foreground font-semibold">Status</TableHead>
                    <TableHead className="text-muted-foreground font-semibold text-center">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {services.map((service) => (
                    <TableRow key={service.id} className="border-border hover:bg-muted/20 transition-colors">
                      <TableCell className="font-medium text-foreground py-4">{service.exam.name}</TableCell>
                      <TableCell className="text-foreground font-mono text-sm bg-muted/20 rounded px-2 py-1 w-fit">
                        {service.exam.code}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-primary/20 text-primary bg-primary/5">
                          {service.exam.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-foreground font-semibold">
                        R$ {service.price.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleToggleActive(service.id, service.active)}
                        >
                          {service.active ? (
                            <Badge className="bg-primary/10 text-primary border-primary/20">
                              Ativo
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="border-muted text-muted-foreground">
                              Inativo
                            </Badge>
                          )}
                        </Button>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2 justify-center">
                          <Button size="sm" variant="outline" className="border-border hover:bg-accent">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" className="border-border hover:bg-accent">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" className="border-destructive/20 text-destructive hover:bg-destructive/10">
                            <Trash2 className="h-4 w-4" />
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

export default ServiceManagement;
