
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Minus, Clock } from 'lucide-react';

interface Service {
  id: string;
  name: string;
  price: number;
  delivery_time: string;
  popular?: boolean;
}

interface ServiceSelectionProps {
  selectedServices: string[];
  onServicesChange: (services: string[]) => void;
  onTotalChange: (total: number) => void;
}

const ServiceSelection = ({ selectedServices, onServicesChange, onTotalChange }: ServiceSelectionProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const mockServices: Service[] = [
    {
      id: '1',
      name: 'Hemograma Completo',
      price: 45.00,
      delivery_time: '1 dia útil',
      popular: true
    },
    {
      id: '2',
      name: 'Glicemia em Jejum',
      price: 25.00,
      delivery_time: '1 dia útil',
      popular: true
    },
    {
      id: '3',
      name: 'Colesterol Total',
      price: 30.00,
      delivery_time: '1 dia útil'
    },
    {
      id: '4',
      name: 'TSH',
      price: 35.00,
      delivery_time: '1 dia útil',
      popular: true
    },
    {
      id: '5',
      name: 'Raio-X Tórax',
      price: 65.00,
      delivery_time: '2 horas'
    }
  ];

  const filteredServices = mockServices.filter(service =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const popularServices = mockServices.filter(service => service.popular);

  const handleServiceToggle = (serviceId: string) => {
    const newServices = selectedServices.includes(serviceId)
      ? selectedServices.filter(id => id !== serviceId)
      : [...selectedServices, serviceId];
    
    onServicesChange(newServices);
    
    const total = newServices.reduce((sum, id) => {
      const service = mockServices.find(s => s.id === id);
      return sum + (service?.price || 0);
    }, 0);
    onTotalChange(total);
  };

  const selectedServicesData = mockServices.filter(service => 
    selectedServices.includes(service.id)
  );

  const totalAmount = selectedServicesData.reduce((sum, service) => sum + service.price, 0);

  return (
    <div className="space-y-6">
      {/* Busca */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Buscar exames..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Exames populares */}
      {searchTerm === '' && (
        <div>
          <h3 className="font-semibold mb-3">Mais Populares</h3>
          <div className="grid grid-cols-1 gap-3">
            {popularServices.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                isSelected={selectedServices.includes(service.id)}
                onToggle={() => handleServiceToggle(service.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Todos os exames */}
      <div>
        <h3 className="font-semibold mb-3">
          {searchTerm ? 'Resultados' : 'Todos os Exames'}
        </h3>
        <div className="space-y-3">
          {filteredServices.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              isSelected={selectedServices.includes(service.id)}
              onToggle={() => handleServiceToggle(service.id)}
            />
          ))}
        </div>
      </div>

      {/* Resumo */}
      {selectedServices.length > 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="space-y-2 mb-3">
              {selectedServicesData.map((service) => (
                <div key={service.id} className="flex justify-between text-sm">
                  <span>{service.name}</span>
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
            <h4 className="font-medium">{service.name}</h4>
            {service.popular && (
              <Badge variant="secondary" className="text-xs">Popular</Badge>
            )}
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{service.delivery_time}</span>
            </div>
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
