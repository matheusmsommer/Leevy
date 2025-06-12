
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MapPin, Star, Clock, Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  phone?: string;
  active: boolean;
}

interface LocationSelectionProps {
  selectedLocationId: string;
  onLocationChange: (locationId: string) => void;
  services: string[];
}

const LocationSelection = ({ selectedLocationId, onLocationChange, services }: LocationSelectionProps) => {
  const { toast } = useToast();
  const [searchLocation, setSearchLocation] = useState('');
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      console.log('Fetching active locations...');
      
      const { data, error } = await supabase
        .from('locations')
        .select('*')
        .eq('active', true)
        .order('name');

      if (error) {
        console.error('Error fetching locations:', error);
        toast({
          title: "Erro ao carregar locais",
          description: "Não foi possível carregar os locais disponíveis.",
          variant: "destructive",
        });
        return;
      }

      console.log('Locations loaded:', data);
      setLocations(data || []);
    } catch (error) {
      console.error('Error in fetchLocations:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLocations = locations.filter(location =>
    location.name.toLowerCase().includes(searchLocation.toLowerCase()) ||
    location.address.toLowerCase().includes(searchLocation.toLowerCase()) ||
    location.city.toLowerCase().includes(searchLocation.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Escolha o Local</h3>
          <p className="text-gray-600 text-sm">Carregando locais disponíveis...</p>
        </div>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

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
        {filteredLocations.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {searchLocation ? 'Nenhum local encontrado para sua busca' : 'Nenhum local disponível no momento'}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredLocations.map((location) => (
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
                      <Badge variant="outline" className="text-xs">
                        {location.city}, {location.state}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">{location.address}</p>
                    
                    <div className="flex gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{location.city}, {location.state}</span>
                      </div>
                      {location.phone && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{location.phone}</span>
                        </div>
                      )}
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
          ))
        )}
      </div>
    </div>
  );
};

export default LocationSelection;
