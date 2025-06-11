
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { File, Plus } from 'lucide-react';
import { Service, Checkup } from '@/types/business';

interface ServiceManagementProps {
  companyId: string | null;
}

const ServiceManagement: React.FC<ServiceManagementProps> = ({ companyId }) => {
  const [services, setServices] = useState<Service[]>([]);
  const [checkups, setCheckups] = useState<Checkup[]>([]);

  const handleAddService = () => {
    console.log('Adicionar novo serviço');
    // TODO: Implementar modal para adicionar serviço
  };

  const handleAddCheckup = () => {
    console.log('Adicionar novo checkup');
    // TODO: Implementar modal para adicionar checkup
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
                    <TableHead>Tipo</TableHead>
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
          {checkups.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                Nenhum checkup cadastrado ainda
              </p>
              <Button variant="outline" onClick={handleAddCheckup}>
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeiro Checkup
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <Button variant="outline" onClick={handleAddCheckup}>
                <Plus className="h-4 w-4 mr-2" />
                Criar Checkup
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ServiceManagement;
