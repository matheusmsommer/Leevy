
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Star, Search, MapPin, Clock, DollarSign, Package, Building2, Phone, Globe } from 'lucide-react';

const PublicCatalog = () => {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');

  // Mock data da empresa
  const company = {
    id: companyId,
    name: 'Laboratório Central',
    logo: '/placeholder.svg',
    rating: 4.5,
    reviewCount: 127,
    description: 'Laboratório especializado em exames clínicos com mais de 20 anos de experiência.',
    phone: '(11) 3456-7890',
    website: 'www.labcentral.com.br',
    locations: [
      { id: '1', name: 'Centro', address: 'Rua XV de Novembro, 123 - Centro' },
      { id: '2', name: 'Vila Madalena', address: 'Rua Harmonia, 456 - Vila Madalena' }
    ]
  };

  // Mock data dos serviços
  const services = [
    {
      id: '1',
      name: 'Hemograma Completo',
      description: 'Exame de sangue completo para análise geral',
      price: 45.00,
      delivery_time: '1 dia útil',
      type: 'Laboratorial',
      category: 'sangue',
      locations: ['1', '2'],
      popular: true
    },
    {
      id: '2',
      name: 'Glicemia em Jejum',
      description: 'Dosagem de açúcar no sangue',
      price: 25.00,
      delivery_time: '1 dia útil',
      type: 'Laboratorial',
      category: 'sangue',
      locations: ['1', '2'],
      popular: true
    },
    {
      id: '3',
      name: 'TSH - Hormônio da Tireoide',
      description: 'Avaliação da função da tireoide',
      price: 35.00,
      delivery_time: '2 dias úteis',
      type: 'Laboratorial',
      category: 'hormonio',
      locations: ['1']
    },
    {
      id: '4',
      name: 'Raio-X Tórax',
      description: 'Exame de imagem do tórax',
      price: 65.00,
      delivery_time: '2 horas',
      type: 'Imagem',
      category: 'imagem',
      locations: ['2']
    }
  ];

  const combos = [
    {
      id: 'combo1',
      name: 'Check-up Básico',
      description: 'Pacote completo para avaliação geral de saúde',
      services: ['Hemograma Completo', 'Glicemia em Jejum', 'TSH'],
      originalPrice: 105.00,
      discountPrice: 85.00,
      discount: 19,
      delivery_time: '2 dias úteis',
      locations: ['1', '2']
    },
    {
      id: 'combo2',
      name: 'Check-up Executivo',
      description: 'Avaliação completa para profissionais',
      services: ['Hemograma', 'Glicemia', 'TSH', 'Colesterol Total', 'Triglicérides'],
      originalPrice: 180.00,
      discountPrice: 140.00,
      discount: 22,
      delivery_time: '3 dias úteis',
      locations: ['1', '2']
    }
  ];

  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = selectedLocation === 'all' || service.locations.includes(selectedLocation);
    const matchesType = selectedType === 'all' || service.type.toLowerCase() === selectedType;
    const matchesPrice = priceFilter === 'all' ||
      (priceFilter === 'low' && service.price <= 30) ||
      (priceFilter === 'medium' && service.price > 30 && service.price <= 60) ||
      (priceFilter === 'high' && service.price > 60);
    
    return matchesSearch && matchesLocation && matchesType && matchesPrice;
  });

  const handleScheduleService = (serviceId: string) => {
    navigate(`/book/${serviceId}`, { state: { companyId } });
  };

  const handleScheduleCombo = (comboId: string) => {
    navigate(`/book/combo/${comboId}`, { state: { companyId } });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header da empresa */}
      <header className="bg-card border-b shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center">
              <Building2 className="h-10 w-10 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-card-foreground mb-2">{company.name}</h1>
              <div className="flex items-center gap-4 mb-3">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{company.rating}</span>
                  <span className="text-muted-foreground">({company.reviewCount} avaliações)</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>{company.phone}</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Globe className="h-4 w-4" />
                  <span>{company.website}</span>
                </div>
              </div>
              <p className="text-muted-foreground max-w-2xl">{company.description}</p>
            </div>
            <Button variant="outline">
              Ver mais informações
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Filtros de busca */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar exames (ex: hemograma, glicemia, colesterol...)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 text-lg py-6"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger>
                <SelectValue placeholder="Local de atendimento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os locais</SelectItem>
                {company.locations.map((location) => (
                  <SelectItem key={location.id} value={location.id}>
                    {location.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo de exame" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                <SelectItem value="laboratorial">Laboratorial</SelectItem>
                <SelectItem value="imagem">Imagem</SelectItem>
                <SelectItem value="consulta">Consulta</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priceFilter} onValueChange={setPriceFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Faixa de preço" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os preços</SelectItem>
                <SelectItem value="low">Até R$ 30</SelectItem>
                <SelectItem value="medium">R$ 31 - R$ 60</SelectItem>
                <SelectItem value="high">Acima de R$ 60</SelectItem>
              </SelectContent>
            </Select>

            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm('');
                setSelectedLocation('all');
                setSelectedType('all');
                setPriceFilter('all');
              }}
            >
              Limpar filtros
            </Button>
          </div>
        </div>

        {/* Combos em destaque */}
        {combos.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-foreground">Checkups e Combos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {combos.map((combo) => (
                <Card key={combo.id} className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Package className="h-5 w-5 text-primary" />
                          {combo.name}
                        </CardTitle>
                        <p className="text-muted-foreground mt-1">{combo.description}</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">
                        {combo.discount}% OFF
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 mb-4">
                      <div>
                        <p className="text-sm font-medium text-foreground mb-1">Inclui:</p>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {combo.services.map((service, index) => (
                            <li key={index}>• {service}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{combo.delivery_time}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{combo.locations.length} locais</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground line-through">
                          R$ {combo.originalPrice.toFixed(2)}
                        </p>
                        <p className="text-2xl font-bold text-primary">
                          R$ {combo.discountPrice.toFixed(2)}
                        </p>
                      </div>
                      <Button onClick={() => handleScheduleCombo(combo.id)}>
                        Agendar Combo
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Exames populares */}
        {searchTerm === '' && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-foreground">Exames Populares</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {services.filter(s => s.popular).map((service) => (
                <ServiceCard 
                  key={service.id} 
                  service={service} 
                  company={company}
                  onSchedule={() => handleScheduleService(service.id)} 
                />
              ))}
            </div>
          </div>
        )}

        {/* Lista de exames */}
        <div>
          <h2 className="text-2xl font-bold mb-4 text-foreground">
            {searchTerm || selectedLocation !== 'all' || selectedType !== 'all' || priceFilter !== 'all' 
              ? 'Resultados da busca' 
              : 'Todos os Exames'}
          </h2>
          
          {filteredServices.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Nenhum exame encontrado com os filtros selecionados</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredServices.map((service) => (
                <ServiceCard 
                  key={service.id} 
                  service={service} 
                  company={company}
                  onSchedule={() => handleScheduleService(service.id)}
                  horizontal
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ServiceCard = ({ service, company, onSchedule, horizontal = false }: {
  service: any;
  company: any;
  onSchedule: () => void;
  horizontal?: boolean;
}) => {
  const getLocationNames = (locationIds: string[]) => {
    return locationIds.map(id => 
      company.locations.find((loc: any) => loc.id === id)?.name
    ).filter(Boolean).join(', ');
  };

  if (horizontal) {
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-semibold text-card-foreground">{service.name}</h3>
                {service.popular && (
                  <Badge variant="secondary" className="text-xs">Popular</Badge>
                )}
                <Badge variant="outline" className="text-xs">{service.type}</Badge>
              </div>
              <p className="text-muted-foreground mb-3">{service.description}</p>
              
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{service.delivery_time}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{getLocationNames(service.locations)}</span>
                </div>
              </div>
            </div>
            
            <div className="text-right ml-6">
              <p className="text-2xl font-bold text-primary mb-2">
                R$ {service.price.toFixed(2)}
              </p>
              <Button onClick={onSchedule}>
                Agendar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{service.name}</CardTitle>
            {service.popular && (
              <Badge variant="secondary" className="text-xs mt-1">Popular</Badge>
            )}
          </div>
          <Badge variant="outline" className="text-xs">{service.type}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">{service.description}</p>
        
        <div className="space-y-2 mb-4 text-sm">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{service.delivery_time}</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>{getLocationNames(service.locations)}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-xl font-bold text-primary">
            R$ {service.price.toFixed(2)}
          </p>
          <Button onClick={onSchedule}>
            Agendar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PublicCatalog;
