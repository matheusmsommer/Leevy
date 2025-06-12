
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { File, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Service {
  id: string;
  name: string;
  type: string;
  price: number;
  active: boolean;
}

interface Checkup {
  id: string;
  name: string;
  description: string;
  price: number;
  active: boolean;
}

interface ServiceManagementProps {
  companyId: string | null;
}

const ServiceManagement: React.FC<ServiceManagementProps> = ({ companyId }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [services, setServices] = useState<Service[]>([]);
  const [checkups, setCheckups] = useState<Checkup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (companyId) {
      fetchServices();
    } else {
      setLoading(false);
    }
  }, [companyId]);

  const fetchServices = async () => {
    if (!companyId) return;

    try {
      console.log('Fetching services for company:', companyId);
      
      const { data, error } = await supabase
        .from('company_services')
        .select(`
          id,
          price,
          active,
          service:services!inner(
            id,
            name,
            category
          )
        `)
        .eq('company_id', companyId);

      if (error) {
        console.error('Error fetching services:', error);
        toast({
          title: "Erro ao carregar serviços",
          description: "Não foi possível carregar os serviços da empresa.",
          variant: "destructive",
        });
        return;
      }

      console.log('Services loaded:', data);
      
      // Transformar os dados para o formato esperado
      const transformedServices: Service[] = (data || []).map(service => ({
        id: service.id,
        name: service.service.name,
        type: service.service.category,
        price: Number(service.price),
        active: service.active
      }));

      setServices(transformedServices);
      
      // Por enquanto, não temos checkups implementados
      setCheckups([]);
    } catch (error) {
      console.error('Error in fetchServices:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddService = () => {
    console.log('Adicionar novo serviço');
    toast({
      title: "Funcionalidade em desenvolvimento",
      description: "A criação de serviços será implementada em breve.",
    });
  };

  const handleAddCheckup = () => {
    console.log('Adicionar novo checkup');
    toast({
      title: "Funcionalidade em desenvolvimento",
      description: "A criação de checkups será implementada em breve.",
    });
  };

  if (!companyId) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Serviços não disponíveis</CardTitle>
          <CardDescription>
            Configure sua empresa primeiro para gerenciar serviços
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <File className="h-5 w-5" />
              Serviços
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <File className="h-5 w-5" />
            Serviços Individuais
          </CardTitle>
          <CardDescription>
            Exames, consultas e outros serviços oferecidos
          </CardDescription>
        </CardHeader>
        <CardContent>
          {services.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                Nenhum serviço cadastrado ainda
              </p>
              <Button onClick={handleAddService}>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Primeiro Serviço
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                  {services.length} serviços cadastrados
                </p>
                <Button onClick={handleAddService}>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Serviço
                </Button>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Preço</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {services.map((service) => (
                    <TableRow key={service.id}>
                      <TableCell className="font-medium">{service.name}</TableCell>
                      <TableCell className="capitalize">{service.type}</TableCell>
                      <TableCell>R$ {service.price.toFixed(2)}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          service.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {service.active ? 'Ativo' : 'Inativo'}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Checkups e Pacotes</CardTitle>
          <CardDescription>
            Combine serviços em pacotes promocionais
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              Funcionalidade de checkups será implementada em breve
            </p>
            <Button variant="outline" onClick={handleAddCheckup} disabled>
              <Plus className="h-4 w-4 mr-2" />
              Criar Primeiro Checkup
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ServiceManagement;
