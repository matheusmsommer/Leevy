
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, MapPin, Clock, DollarSign } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';

const SearchServices = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');

  // Mock data - seria substituído por dados reais da API
  const mockServices = [
    {
      id: '1',
      name: 'Hemograma Completo',
      description: 'Exame de sangue completo para análise geral',
      price: 45.00,
      delivery_time: '1 dia útil',
      type: 'exame',
      company_name: 'Laboratório Central',
      locations: ['São Paulo - Centro', 'São Paulo - Vila Madalena']
    },
    {
      id: '2',
      name: 'Consulta Cardiologista',
      description: 'Consulta médica especializada em cardiologia',
      price: 180.00,
      delivery_time: 'Imediato',
      type: 'consulta',
      company_name: 'Clínica CardioVida',
      locations: ['São Paulo - Itaim']
    },
    {
      id: '3',
      name: 'Check-up Executivo',
      description: 'Pacote completo de exames para executivos',
      price: 350.00,
      delivery_time: '3 dias úteis',
      type: 'checkup',
      company_name: 'Centro Médico Premium',
      locations: ['São Paulo - Faria Lima', 'São Paulo - Moema']
    }
  ];

  const filteredServices = mockServices.filter(service =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleBookService = (serviceId: string) => {
    navigate(`/book/${serviceId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gradient">Buscar Serviços</h1>
          <p className="text-sm text-muted-foreground">Encontre exames, consultas e check-ups</p>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Filtros de busca */}
        <div className="mb-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por exame, consulta ou check-up..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cidade ou CEP..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        {/* Lista de serviços */}
        <div className="space-y-4">
          {filteredServices.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">Nenhum serviço encontrado</p>
              </CardContent>
            </Card>
          ) : (
            filteredServices.map((service) => (
              <Card key={service.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{service.name}</CardTitle>
                      <p className="text-sm text-muted-foreground font-medium">
                        {service.company_name}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">
                        R$ {service.price.toFixed(2)}
                      </p>
                      <span className="inline-block px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                        {service.type}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{service.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>Prazo: {service.delivery_time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>Locais: {service.locations.join(', ')}</span>
                    </div>
                  </div>

                  <Button 
                    onClick={() => handleBookService(service.id)}
                    className="w-full"
                  >
                    Agendar Serviço
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchServices;
