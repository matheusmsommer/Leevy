
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Plus, Edit, Trash2, TestTube, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import AddServiceModal from './AddServiceModal';
import ViewServiceModal from './ViewServiceModal';
import EditServiceModal from './EditServiceModal';
import DeleteServiceModal from './DeleteServiceModal';

interface ServicePreparation {
  id: string;
  is_primary: boolean;
  preparation: {
    id: string;
    name: string;
    instructions: string;
  };
}

interface GlobalService {
  id: string;
  name: string;
  code: string;
  category: string;
  preparation?: string;
  description?: string;
  synonyms?: string;
  service_preparations?: ServicePreparation[];
  subcategory_names?: string[];
}

interface ServiceManagementProps {
  globalServices: GlobalService[];
  onAddService: () => void;
}

const ServiceManagement = ({ globalServices: initialServices, onAddService }: ServiceManagementProps) => {
  const { toast } = useToast();
  const [services, setServices] = useState<GlobalService[]>(initialServices);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedService, setSelectedService] = useState<GlobalService | null>(null);

  useEffect(() => {
    fetchGlobalServices();
  }, []);

  const fetchGlobalServices = async () => {
    try {
      console.log('Fetching global services with preparations and subcategories...');
      
      // Buscar serviços com suas preparações associadas
      const { data: servicesData, error: servicesError } = await supabase
        .from('services')
        .select(`
          *,
          service_preparations (
            id,
            is_primary,
            preparation:standard_preparations (
              id,
              name,
              instructions
            )
          )
        `)
        .order('name', { ascending: true });

      if (servicesError) {
        console.error('Error fetching services:', servicesError);
        toast({
          title: "Erro ao carregar serviços",
          description: "Não foi possível carregar os serviços.",
          variant: "destructive",
        });
        return;
      }

      // Buscar subcategorias para cada serviço
      const servicesWithSubcategories = await Promise.all(
        (servicesData || []).map(async (service) => {
          const { data: subcategoryData } = await supabase
            .from('service_subcategory_associations')
            .select(`
              service_subcategories(name)
            `)
            .eq('service_id', service.id);

          const subcategory_names = subcategoryData
            ?.map(item => (item as any).service_subcategories?.name)
            .filter(name => name) || [];

          return {
            ...service,
            subcategory_names
          };
        })
      );

      console.log('Global services loaded with preparations and subcategories:', servicesWithSubcategories);
      setServices(servicesWithSubcategories);
    } catch (error) {
      console.error('Error in fetchGlobalServices:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPreparationDisplay = (service: GlobalService) => {
    // Verificar se há preparações no novo formato (service_preparations)
    if (service.service_preparations && service.service_preparations.length > 0) {
      const primaryPreparation = service.service_preparations.find(ep => ep.is_primary);
      if (primaryPreparation) {
        return primaryPreparation.preparation.name;
      }
      // Se não há preparação primária, pegar a primeira
      return service.service_preparations[0].preparation.name;
    }
    
    // Fallback para o formato antigo (preparation em texto livre)
    if (service.preparation && service.preparation.trim()) {
      return service.preparation;
    }
    
    return 'Sem preparação especial';
  };

  const handleAddService = () => {
    setShowAddModal(true);
  };

  const handleViewService = (service: GlobalService) => {
    setSelectedService(service);
    setShowViewModal(true);
  };

  const handleEditService = (service: GlobalService) => {
    setSelectedService(service);
    setShowEditModal(true);
  };

  const handleDeleteService = (service: GlobalService) => {
    setSelectedService(service);
    setShowDeleteModal(true);
  };

  const handleServiceAdded = () => {
    fetchGlobalServices();
  };

  const handleServiceUpdated = () => {
    fetchGlobalServices();
  };

  const handleServiceDeleted = () => {
    fetchGlobalServices();
  };

  if (loading) {
    return (
      <Card className="border-border shadow-sm">
        <CardHeader className="pb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <TestTube className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl font-semibold text-foreground">Catálogo Global de Serviços</CardTitle>
              <CardDescription className="text-muted-foreground">
                Carregando serviços...
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
    <>
      <Card className="border-border shadow-sm">
        <CardHeader className="pb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <TestTube className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl font-semibold text-foreground">Catálogo Global de Serviços</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Serviços disponíveis para todas as empresas
                </CardDescription>
              </div>
            </div>
            <HoverCard>
              <HoverCardTrigger asChild>
                <Button onClick={handleAddService} className="bg-primary hover:bg-primary/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Serviço
                </Button>
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold">Adicionar Novo Serviço</h4>
                  <p className="text-sm text-muted-foreground">
                    Cadastra um novo serviço no catálogo global que ficará disponível para todas as empresas do sistema.
                  </p>
                </div>
              </HoverCardContent>
            </HoverCard>
          </div>
        </CardHeader>
        <CardContent>
          {services.length === 0 ? (
            <div className="text-center py-12">
              <TestTube className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Nenhum serviço cadastrado ainda</p>
              <Button onClick={handleAddService} className="mt-4 bg-primary hover:bg-primary/90">
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
                    <TableHead className="text-muted-foreground font-semibold">Subcategorias</TableHead>
                    <TableHead className="text-muted-foreground font-semibold">Preparação</TableHead>
                    <TableHead className="text-muted-foreground font-semibold text-center">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {services.map((service) => (
                    <TableRow key={service.id} className="border-border hover:bg-muted/20 transition-colors">
                      <TableCell className="font-medium text-foreground py-4">{service.name}</TableCell>
                      <TableCell className="text-foreground font-mono text-sm bg-muted/20 rounded px-2 py-1 w-fit">
                        {service.code}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-primary/20 text-primary bg-primary/5">
                          {service.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {service.subcategory_names && service.subcategory_names.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {service.subcategory_names.slice(0, 2).map((name, index) => (
                              <Badge key={index} variant="outline" className="border-secondary/20 text-secondary bg-secondary/5 text-xs">
                                {name}
                              </Badge>
                            ))}
                            {service.subcategory_names.length > 2 && (
                              <Badge variant="outline" className="border-muted text-muted-foreground text-xs">
                                +{service.subcategory_names.length - 2}
                              </Badge>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">Nenhuma</span>
                        )}
                      </TableCell>
                      <TableCell className="text-foreground max-w-xs">
                        <div className="truncate" title={getPreparationDisplay(service)}>
                          {getPreparationDisplay(service)}
                        </div>
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
                                  Ver todas as informações detalhadas do serviço.
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
                                  Modificar as informações do serviço como nome, código, categoria e descrição.
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
                                <h4 className="text-sm font-semibold text-destructive">Excluir Serviço</h4>
                                <p className="text-sm text-muted-foreground">
                                  Remove permanentemente o serviço do sistema. Só é possível se não estiver sendo usado por empresas.
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

      <AddServiceModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
        onSuccess={handleServiceAdded}
      />

      <ViewServiceModal
        open={showViewModal}
        onOpenChange={setShowViewModal}
        service={selectedService}
      />

      <EditServiceModal
        open={showEditModal}
        onOpenChange={setShowEditModal}
        service={selectedService}
        onSuccess={handleServiceUpdated}
      />

      <DeleteServiceModal
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        service={selectedService}
        onServiceDeleted={handleServiceDeleted}
      />
    </>
  );
};

export default ServiceManagement;
