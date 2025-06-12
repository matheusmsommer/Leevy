
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MapPin, Star, Clock, Search } from 'lucide-react';

interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  delivery_time: string;
  rating?: number;
  distance?: string;
}

interface LocationSelectionProps {
  selectedLocationId: string;
  onLocationChange: (locationId: string) => void;
  services: string[];
}

const LocationSelection = ({ selectedLocationId, onLocationChange, services }: LocationSelectionProps) => {
  const [searchLocation, setSearchLocation] = useState('');

  const mockLocations: Location[] = [
    {
      id: '1',
      name: 'Laboratório Central - Centro',
      address: 'Rua XV de Novembro, 123 - Centro',
      city: 'São Paulo',
      delivery_time: '1 dia útil',
      rating: 4.5,
      distance: '2.1 km'
    },
    {
      id: '2',
      name: 'Lab Central - Vila Madalena',
      address: 'Rua Harmonia, 456 - Vila Madalena',
      city: 'São Paulo',
      delivery_time: '1 dia útil',
      rating: 4.8,
      distance: '3.5 km'
    },
    {
      id: '3',
      name: 'Diagnóstico Rápido - Copacabana',
      address: 'Av. Nossa Senhora de Copacabana, 789',
      city: 'Rio de Janeiro',
      delivery_time: '2 horas',
      rating: 4.7,
      distance: '5.2 km'
    }
  ];

  const filteredLocations = mockLocations.filter(location =>
    location.name.toLowerCase().includes(searchLocation.toLowerCase()) ||
    location.address.toLowerCase().includes(searchLocation.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Escolha o Local</h3>
        <p className="text-gray-600 text-sm">Selecione onde realizar seus exames</p>
      </div>

      {/* Busca */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Buscar por local ou endereço..."
          value={searchLocation}
          onChange={(e) => setSearchLocation(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Lista de locais */}
      <div className="space-y-3">
        {filteredLocations.map((location) => (
          <Card
            key={location.id}
            className={`cursor-pointer transition-all ${
              selectedLocationId === location.id
                ? 'ring-2 ring-blue-500 bg-blue-50'
                : 'hover:shadow-md'
            }`}
            onClick={() => onLocationChange(location.id)}
          >
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-medium">{location.name}</h4>
                    {location.rating && (
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{location.rating}</span>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2">{location.address}</p>
                  
                  <div className="flex gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{location.distance}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{location.delivery_time}</span>
                    </div>
                  </div>
                </div>
                
                <Button
                  variant={selectedLocationId === location.id ? 'default' : 'outline'}
                  size="sm"
                >
                  {selectedLocationId === location.id ? 'Selecionado' : 'Selecionar'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default LocationSelection;
