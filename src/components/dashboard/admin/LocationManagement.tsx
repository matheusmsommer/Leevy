
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, MapPin, Phone, Mail } from 'lucide-react';

const LocationManagement = () => {
  const locations = [
    {
      id: '1',
      name: 'Unidade Centro',
      address: 'Rua das Flores, 123 - Centro',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01234-567',
      phone: '(11) 1234-5678',
      email: 'centro@laboratorio.com',
      active: true
    },
    {
      id: '2',
      name: 'Unidade Zona Sul',
      address: 'Av. Paulista, 456 - Bela Vista',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01310-100',
      phone: '(11) 8765-4321',
      email: 'zonasul@laboratorio.com',
      active: true
    },
    {
      id: '3',
      name: 'Unidade Norte',
      address: 'Rua do Norte, 789 - Santana',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '02012-345',
      phone: '(11) 5555-0000',
      email: 'norte@laboratorio.com',
      active: false
    }
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Locais</h1>
          <p className="text-muted-foreground mt-2">
            Gerencie as unidades do seu laboratório
          </p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 shadow-sm">
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Local
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {locations.map((location) => (
          <Card key={location.id} className="border-border shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold text-foreground">{location.name}</CardTitle>
                  </div>
                </div>
                {location.active ? (
                  <Badge className="bg-primary/10 text-primary border-primary/20">
                    Ativa
                  </Badge>
                ) : (
                  <Badge variant="outline" className="border-muted text-muted-foreground">
                    Inativa
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="text-foreground">{location.address}</p>
                    <p className="text-muted-foreground">{location.city}, {location.state} - {location.zipCode}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-sm text-foreground">{location.phone}</span>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-sm text-foreground">{location.email}</span>
                </div>
              </div>

              <div className="border-t border-border pt-4">
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1 border-border hover:bg-accent">
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                  <Button size="sm" variant="outline" className="border-destructive/20 text-destructive hover:bg-destructive/10">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {locations.length === 0 && (
        <Card className="border-border shadow-sm">
          <CardContent className="text-center py-12">
            <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Nenhum local cadastrado ainda</p>
            <Button className="mt-4 bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Primeiro Local
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LocationManagement;
