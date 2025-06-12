
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MapPin, Star, Clock, DollarSign, Navigation } from 'lucide-react';

interface Location {
  id: string;
  name: string;
  company_name: string;
  address: string;
  city: string;
  delivery_time: string;
  price_modifier: number;
  rating?: number;
  distance?: string;
  available_services: string[];
}

interface LocationSelectionProps {
  selectedLocationId: string;
  onLocationChange: (locationId: string) => void;
  services: string[];
}

const LocationSelection = ({ selectedLocationId, onLocationChange, services }: LocationSelectionProps) => {
  const [searchLocation, setSearchLocation] = useState('');
  const [sortBy, setSortBy] = useState<'distance' | 'price' | 'rating'>('distance');

  // Mock data - seria substituído por dados reais
  const mockLocations: Location[] = [
    {
      id: '1',
      name: 'Laboratório Central - Centro',
      company_name: 'Laboratório Central',
      address: 'Rua XV de Novembro, 123 - Centro',
      city: 'São Paulo',
      delivery_time: '1 dia útil',
      price_modifier: 0,
      rating: 4.5,
      distance: '2.1 km',
      available_services: ['1', '2', '4']
    },
    {
      id: '2',
      name: 'Lab Central - Vila Madalena',
      company_name: 'Laboratório Central',
      address: 'Rua Harmonia, 456 - Vila Madalena',
      city: 'São Paulo',
      delivery_time: '1 dia útil',
      price_modifier: 5,
      rating: 4.8,
      distance: '3.5 km',
      available_services: ['1', '2', '3']
    },
    {
      id: '3',
      name: 'Clínica CardioVida - Itaim',
      company_name: 'Clínica CardioVida',
      address: 'Av. Brigadeiro Faria Lima, 789 - Itaim',
      city: 'São Paulo',
      delivery_time: 'Imediato',
      price_modifier: 15,
      rating: 4.9,
      distance: '5.2 km',
      available_services: ['3', '5']
    },
    {
      id: '4',
      name: 'Centro Médico Premium - Moema',
      company_name: 'Centro Médico Premium',
      address: 'Rua dos Açores, 321 - Moema',
      city: 'São Paulo',
      delivery_time: '2 horas',
      price_modifier: 20,
      rating: 4.7,
      distance: '4.8 km',
      available_services: ['4', '5']
    }
  ];

  // Filtrar locais que oferecem os serviços selecionados
  const availableLocations = mockLocations.filter(location =>
    services.some(serviceId => location.available_services.includes(serviceId))
  );

  const filteredLocations = availableLocations.filter(location =>
    location.name.toLowerCase().includes(searchLocation.toLowerCase()) ||
    location.address.toLowerCase().includes(searchLocation.toLowerCase()) ||
    location.city.toLowerCase().includes(searchLocation.toLowerCase())
  );

  // Ordenar locais
  const sortedLocations = [...filteredLocations].sort((a, b) => {
    switch (sortBy) {
      case 'distance':
        return parseFloat(a.distance || '0') - parseFloat(b.distance || '0');
      case 'price':
        return a.price_modifier - b.price_modifier;
      case 'rating':
        return (b.rating || 0) - (a.rating || 0);
      default:
        return 0;
    }
  });

  const calculateTotalPrice = (basePrice: number, modifier: number) => {
    return basePrice + modifier;
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Escolha o Local</h3>
        <p className="text-muted-foreground">
          Selecione onde você gostaria de realizar os serviços agendados
        </p>
      </div>

      {/* Filtros */}
      <div className="space-y-4">
        <div className="relative">
          <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por cidade, bairro ou endereço..."
            value={searchLocation}
            onChange={(e) => setSearchLocation(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <Button
            variant={sortBy === 'distance' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSortBy('distance')}
          >
            <Navigation className="h-4 w-4 mr-1" />
            Mais Próximo
          </Button>
          <Button
            variant={sortBy === 'price' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSortBy('price')}
          >
            <DollarSign className="h-4 w-4 mr-1" />
            Menor Preço
          </Button>
          <Button
            variant={sortBy === 'rating' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSortBy('rating')}
          >
            <Star className="h-4 w-4 mr-1" />
            Melhor Avaliado
          </Button>
        </div>
      </div>

      {/* Lista de locais */}
      <div className="space-y-4">
        {sortedLocations.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                Nenhum local encontrado que ofereça os serviços selecionados
              </p>
            </CardContent>
          </Card>
        ) : (
          sortedLocations.map((location) => (
            <Card
              key={location.id}
              className={`cursor-pointer transition-all ${
                selectedLocationId === location.id
                  ? 'ring-2 ring-primary bg-primary/5'
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
                    
                    <p className="text-sm text-muted-foreground mb-1">
                      {location.company_name}
                    </p>
                    
                    <p className="text-sm text-muted-foreground mb-3">
                      {location.address}
                    </p>
                    
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Navigation className="h-4 w-4 text-muted-foreground" />
                        <span>{location.distance}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{location.delivery_time}</span>
                      </div>
                      {location.price_modifier > 0 && (
                        <Badge variant="outline" className="text-xs">
                          +R$ {location.price_modifier.toFixed(2)}
                        </Badge>
                      )}
                      {location.price_modifier === 0 && (
                        <Badge variant="secondary" className="text-xs">
                          Preço padrão
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right ml-4">
                    <Button
                      variant={selectedLocationId === location.id ? 'default' : 'outline'}
                      size="sm"
                    >
                      {selectedLocationId === location.id ? 'Selecionado' : 'Selecionar'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Informação sobre geolocalização */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-800 mb-1">📍 Locais Próximos</h4>
        <p className="text-sm text-blue-700">
          Os locais são ordenados por proximidade baseado na sua localização atual. 
          As distâncias são aproximadas e podem variar dependendo do trânsito.
        </p>
      </div>
    </div>
  );
};

export default LocationSelection;
