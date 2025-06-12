
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MapPin, Plus, Edit, Trash2, Home } from 'lucide-react';
import { Location } from '@/types/business';

interface LocationSettingsProps {
  companyId: string;
}

const LocationSettings: React.FC<LocationSettingsProps> = ({ companyId }) => {
  const [locations, setLocations] = useState<Location[]>([]);

  const handleAddLocation = () => {
    console.log('Adicionar novo local');
    // TODO: Implementar modal para adicionar local
  };

  const handleEditLocation = (locationId: string) => {
    console.log('Editar local:', locationId);
    // TODO: Implementar modal para editar local
  };

  const handleDeleteLocation = (locationId: string) => {
    console.log('Excluir local:', locationId);
    // TODO: Implementar confirmação e exclusão
  };

  const handleSetMain = (locationId: string) => {
    console.log('Definir como unidade principal:', locationId);
    // TODO: Implementar definição de unidade principal
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Locais de Atendimento
        </CardTitle>
        <CardDescription>
          Gerencie os endereços onde sua empresa atende
        </CardDescription>
      </CardHeader>
      <CardContent>
        {locations.length === 0 ? (
          <div className="text-center py-8">
            <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">
              Nenhum local cadastrado ainda
            </p>
            <Button onClick={handleAddLocation}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Primeiro Local
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                {locations.length} locais cadastrados
              </p>
              <Button onClick={handleAddLocation}>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Local
              </Button>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Endereço</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {locations.map((location) => (
                  <TableRow key={location.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {location.name}
                        <Home className="h-4 w-4 text-primary" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p>{location.address}</p>
                        <p className="text-sm text-muted-foreground">
                          {location.city} - {location.state}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>{location.phone}</TableCell>
                    <TableCell>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Ativo
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditLocation(location.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSetMain(location.id)}
                        >
                          <Home className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteLocation(location.id)}
                        >
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
  );
};

export default LocationSettings;
