
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Minus, Clock, DollarSign } from 'lucide-react';

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
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
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock data - seria substituído por dados reais
  const mockServices: Service[] = [
    {
      id: '1',
      name: 'Hemograma Completo',
      description: 'Exame de sangue completo para análise geral',
      price: 45.00,
      category: 'laboratorial',
      delivery_time: '1 dia útil',
      popular: true
    },
    {
      id: '2',
      name: 'Glicemia em Jejum',
      description: 'Dosagem de açúcar no sangue',
      price: 25.00,
      category: 'laboratorial',
      delivery_time: '1 dia útil',
      popular: true
    },
    {
      id: '3',
      name: 'Consulta Cardiologista',
      description: 'Consulta médica especializada em cardiologia',
      price: 180.00,
      category: 'consulta',
      delivery_time: 'Imediato'
    },
    {
      id: '4',
      name: 'Raio-X Tórax',
      description: 'Exame de imagem do tórax',
      price: 65.00,
      category: 'imagem',
      delivery_time: '2 horas'
    },
    {
      id: '5',
      name: 'Check-up Executivo',
      description: 'Pacote completo de exames para executivos',
      price: 350.00,
      category: 'checkup',
      delivery_time: '3 dias úteis',
      popular: true
    }
  ];

  const categories = [
    { id: 'all', name: 'Todos' },
    { id: 'laboratorial', name: 'Laboratoriais' },
    { id: 'imagem', name: 'Imagem' },
    { id: 'consulta', name: 'Consultas' },
    { id: 'checkup', name: 'Check-ups' }
  ];

  const filteredServices = mockServices.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const popularServices = mockServices.filter(service => service.popular);

  const handleServiceToggle = (serviceId: string) => {
    const newServices = selectedServices.includes(serviceId)
      ? selectedServices.filter(id => id !== serviceId)
      : [...selectedServices, serviceId];
    
    onServicesChange(newServices);
    
    // Calculate total
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
      {/* Search and filters */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar exames, consultas ou check-ups..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Popular services */}
      {searchTerm === '' && selectedCategory === 'all' && (
        <div>
          <h3 className="font-semibold mb-3">Mais Populares</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

      {/* All services */}
      <div>
        <h3 className="font-semibold mb-3">
          {searchTerm || selectedCategory !== 'all' ? 'Resultados da Busca' : 'Todos os Serviços'}
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

      {/* Selected services summary */}
      {selectedServices.length > 0 && (
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg">Serviços Selecionados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 mb-4">
              {selectedServicesData.map((service) => (
                <div key={service.id} className="flex justify-between items-center">
                  <span className="text-sm">{service.name}</span>
                  <span className="font-medium">R$ {service.price.toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t pt-2">
              <div className="flex justify-between items-center font-bold text-lg">
                <span>Total:</span>
                <span className="text-primary">R$ {totalAmount.toFixed(2)}</span>
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
  <Card className={`cursor-pointer transition-all ${isSelected ? 'ring-2 ring-primary bg-primary/5' : 'hover:shadow-md'}`}>
    <CardContent className="p-4">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="font-medium">{service.name}</h4>
            {service.popular && (
              <Badge variant="secondary" className="text-xs">Popular</Badge>
            )}
            <Badge variant="outline" className="text-xs">{service.category}</Badge>
          </div>
          <p className="text-sm text-muted-foreground mb-2">{service.description}</p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{service.delivery_time}</span>
            </div>
            <div className="flex items-center gap-1">
              <DollarSign className="h-3 w-3" />
              <span className="font-medium text-primary">R$ {service.price.toFixed(2)}</span>
            </div>
          </div>
        </div>
        <Button
          onClick={onToggle}
          variant={isSelected ? "default" : "outline"}
          size="sm"
          className="ml-4"
        >
          {isSelected ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
        </Button>
      </div>
    </CardContent>
  </Card>
);

export default ServiceSelection;
