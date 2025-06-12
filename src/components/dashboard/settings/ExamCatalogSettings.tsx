
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { File, Plus, Download, Edit } from 'lucide-react';
import { Service } from '@/types/business';

interface ServiceCatalogSettingsProps {
  companyId: string;
}

const ServiceCatalogSettings: React.FC<ServiceCatalogSettingsProps> = ({ companyId }) => {
  const [services, setServices] = useState<Service[]>([]);

  const handleAddService = () => {
    console.log('Adicionar novo serviço');
    // TODO: Implementar modal para adicionar serviço
  };

  const handleImportServices = () => {
    console.log('Importar serviços da base Leevy');
    // TODO: Implementar modal de importação com IA
  };

  const handleEditService = (serviceId: string) => {
    console.log('Editar serviço:', serviceId);
    // TODO: Implementar modal de edição
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <File className="h-5 w-5" />
          Catálogo de Serviços
        </CardTitle>
        <CardDescription>
          Gerencie todos os serviços oferecidos pela sua empresa
        </CardDescription>
      </CardHeader>
      <CardContent>
        {services.length === 0 ? (
          <div className="text-center py-8">
            <File className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">
              Nenhum serviço cadastrado ainda
            </p>
            <div className="flex gap-2 justify-center">
              <Button onClick={handleAddService}>
                <Plus className="h-4 w-4 mr-2" />
                Criar Serviço
              </Button>
              <Button variant="outline" onClick={handleImportServices}>
                <Download className="h-4 w-4 mr-2" />
                Importar da Base Leevy
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                {services.length} serviços cadastrados
              </p>
              <div className="flex gap-2">
                <Button onClick={handleAddService}>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Serviço
                </Button>
                <Button variant="outline" onClick={handleImportServices}>
                  <Download className="h-4 w-4 mr-2" />
                  Importar
                </Button>
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Preço</TableHead>
                  <TableHead>Prazo</TableHead>
                  <TableHead>Origem</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {services.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell className="font-medium">{service.name}</TableCell>
                    <TableCell className="capitalize">{service.type}</TableCell>
                    <TableCell>R$ {service.price.toFixed(2)}</TableCell>
                    <TableCell>{service.delivery_time}</TableCell>
                    <TableCell>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Manual
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditService(service.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ServiceCatalogSettings;
