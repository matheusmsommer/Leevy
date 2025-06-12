
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Plus, Edit, Trash2, TestTube, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface CompanyService {
  id: string;
  price: number;
  active: boolean;
  service: {
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

      // Buscar serviços da empresa com informações do serviço
      const { data, error } = await supabase
        .from('company_services')
        .select(`
          id,
          price,
          active,
          service:services!inner(
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

  const handleViewService = (service: CompanyService) => {
    console.log('Viewing service:', service.id);
    // TODO: Implementar modal de visualização
  };

  const handleEditService = (service: CompanyService) => {
    console.log('Editing service:', service.id);
    // TODO: Implementar modal de edição
  };

  const handleDeleteService = (service: CompanyService) => {
    console.log('Deleting service:', service.id);
    // TODO: Implementar modal de exclusão
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Serviços</h1>
            <p className="text-muted-foreground mt-2">
              Gerencie os serviços oferecidos pelo seu laboratório
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
            Gerencie os serviços oferecidos pelo seu laboratório
          </p>
        </div>
        <HoverCard>
          <HoverCardTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 shadow-sm">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Serviço
            </Button>
          </HoverCardTrigger>
          <HoverCardContent className="w-80">
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">Adicionar Novo Serviço</h4>
              <p className="text-sm text-muted-foreground">
                Adiciona um serviço do catálogo global aos serviços oferecidos pelo seu laboratório com preço personalizado.
              </p>
            </div>
          </HoverCardContent>
        </HoverCard>
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
                Serviços disponíveis para venda
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
                    <TableHead className="text-muted-foreground font-semibold py-4">Nome do Serviço</TableHead>
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
                      <TableCell className="font-medium text-foreground py-4">{service.service.name}</TableCell>
                      <TableCell className="text-foreground font-mono text-sm bg-muted/20 rounded px-2 py-1 w-fit">
                        {service.service.code}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-primary/20 text-primary bg-primary/5">
                          {service.service.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-foreground font-semibold">
                        R$ {service.price.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <HoverCard>
                          <HoverCardTrigger asChild>
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
                          </HoverCardTrigger>
                          <HoverCardContent className="w-64">
                            <div className="space-y-1">
                              <h4 className="text-sm font-semibold">
                                {service.active ? 'Desativar' : 'Ativar'} Serviço
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                {service.active 
                                  ? 'Torna o serviço indisponível para agendamento pelos clientes.'
                                  : 'Torna o serviço disponível para agendamento pelos clientes.'
                                }
                              </p>
                            </div>
                          </HoverCardContent>
                        </HoverCard>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2 justify-center">
                          <HoverCard>
                            <HoverCardTrigger asChild>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="border-border hover:bg-accent"
                                onClick={() => handleViewService(service)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </HoverCardTrigger>
                            <HoverCardContent className="w-64">
                              <div className="space-y-1">
                                <h4 className="text-sm font-semibold">Visualizar Serviço</h4>
                                <p className="text-sm text-muted-foreground">
                                  Ver detalhes completos do serviço incluindo preço, descrição e estatísticas.
                                </p>
                              </div>
                            </HoverCardContent>
                          </HoverCard>

                          <HoverCard>
                            <HoverCardTrigger asChild>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="border-border hover:bg-accent"
                                onClick={() => handleEditService(service)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </HoverCardTrigger>
                            <HoverCardContent className="w-64">
                              <div className="space-y-1">
                                <h4 className="text-sm font-semibold">Editar Serviço</h4>
                                <p className="text-sm text-muted-foreground">
                                  Modificar preço, status e outras configurações específicas do seu laboratório.
                                </p>
                              </div>
                            </HoverCardContent>
                          </HoverCard>

                          <HoverCard>
                            <HoverCardTrigger asChild>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="border-destructive/20 text-destructive hover:bg-destructive/10"
                                onClick={() => handleDeleteService(service)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </HoverCardTrigger>
                            <HoverCardContent className="w-64">
                              <div className="space-y-1">
                                <h4 className="text-sm font-semibold text-destructive">Remover Serviço</h4>
                                <p className="text-sm text-muted-foreground">
                                  Remove o serviço da sua lista de ofertas. Clientes não poderão mais agendar este serviço.
                                </p>
                              </div>
                            </HoverCardContent>
                          </HoverCard>
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
