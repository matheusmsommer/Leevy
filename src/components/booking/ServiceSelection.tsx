
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Minus, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Service {
  id: string;
  price: number;
  active: boolean;
  service: {
    id: string;
    name: string;
    description?: string;
    category: string;
    synonyms?: string;
  };
}

interface ServiceSelectionProps {
  selectedServices: string[];
  onServicesChange: (services: string[]) => void;
  onTotalChange: (total: number) => void;
}

const ServiceSelection = ({ selectedServices, onServicesChange, onTotalChange }: ServiceSelectionProps) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    calculateTotal();
  }, [selectedServices, services]);

  const fetchServices = async () => {
    try {
      console.log('Fetching available services...');
      
      const { data, error } = await supabase
        .from('company_services')
        .select(`
          id,
          price,
          active,
          service:services!inner(
            id,
            name,
            description,
            category,
            synonyms
          )
        `)
        .eq('active', true)
        .order('service.name');

      if (error) {
        console.error('Error fetching services:', error);
        toast({
          title: "Erro ao carregar serviços",
          description: "Não foi possível carregar os serviços disponíveis.",
          variant: "destructive",
        });
        return;
      }

      console.log('Services loaded:', data);
      setServices(data || []);
    } catch (error) {
      console.error('Error in fetchServices:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    const total = selectedServices.reduce((sum, serviceId) => {
      const service = services.find(s => s.id === serviceId);
      return sum + (service?.price || 0);
    }, 0);
    onTotalChange(total);
  };

  const filteredServices = services.filter(service => {
    const searchLower = searchTerm.toLowerCase();
    const synonymsList = service.service.synonyms ? service.service.synonyms.split(',').map(s => s.trim().toLowerCase()) : [];
    
    return service.service.name.toLowerCase().includes(searchLower) ||
           service.service.category.toLowerCase().includes(searchLower) ||
           (service.service.description && service.service.description.toLowerCase().includes(searchLower)) ||
           synonymsList.some(synonym => synonym.includes(searchLower));
  });

  const handleServiceToggle = (serviceId: string) => {
    const newServices = selectedServices.includes(serviceId)
      ? selectedServices.filter(id => id !== serviceId)
      : [...selectedServices, serviceId];
    
    onServicesChange(newServices);
  };

  const selectedServicesData = services.filter(service => 
    selectedServices.includes(service.id)
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="font-semibold mb-3">Carregando serviços...</h3>
        </div>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  const totalAmount = selectedServicesData.reduce((sum, service) => sum + service.price, 0);

  return (
    <div className="space-y-6">
      {/* Busca */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Buscar serviços..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Lista de serviços */}
      <div>
        <h3 className="font-semibold mb-3">
          {searchTerm ? 'Resultados da busca' : 'Serviços Disponíveis'}
        </h3>
        <div className="space-y-3">
          {filteredServices.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">
                  {searchTerm ? 'Nenhum serviço encontrado para sua busca' : 'Nenhum serviço disponível no momento'}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredServices.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                isSelected={selectedServices.includes(service.id)}
                onToggle={() => handleServiceToggle(service.id)}
              />
            ))
          )}
        </div>
      </div>

      {/* Resumo */}
      {selectedServices.length > 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="space-y-2 mb-3">
              {selectedServicesData.map((service) => (
                <div key={service.id} className="flex justify-between text-sm">
                  <span>{service.service.name}</span>
                  <span>R$ {service.price.toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-blue-200 pt-2">
              <div className="flex justify-between font-bold">
                <span>Total:</span>
                <span className="text-blue-600">R$ {totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

const ServiceCard = ({ service, isSelected, onToggle }: {
  service: Service;
  isSelected: boolean;
  onToggle: () => void;
}) => (
  <Card className={`cursor-pointer transition-all ${isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:shadow-md'}`}>
    <CardContent className="p-4">
      <div className="flex justify-between items-center">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-medium">{service.service.name}</h4>
            <Badge variant="secondary" className="text-xs">{service.service.category}</Badge>
          </div>
          {service.service.synonyms && (
            <p className="text-xs text-gray-500 mb-1">
              Também conhecido como: {service.service.synonyms}
            </p>
          )}
          {service.service.description && (
            <p className="text-sm text-gray-600 mb-2">{service.service.description}</p>
          )}
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span className="font-semibold text-blue-600">R$ {service.price.toFixed(2)}</span>
          </div>
        </div>
        <Button
          onClick={onToggle}
          variant={isSelected ? "default" : "outline"}
          size="sm"
        >
          {isSelected ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
        </Button>
      </div>
    </CardContent>
  </Card>
);

export default ServiceSelection;
