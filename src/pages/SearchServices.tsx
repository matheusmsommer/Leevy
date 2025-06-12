import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, MapPin, Clock, DollarSign, Calendar } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ServiceWithCompany {
  id: string;
  price: number;
  active: boolean;
  delivery_days?: number;
  available_days?: string[];
  custom_preparation?: string;
  lab_notes?: string;
  company: {
    id: string;
    name: string;
  };
  service: {
    id: string;
    name: string;
    description?: string;
    patient_friendly_description?: string;
    category: string;
    synonyms?: string;
    related_diseases?: string;
    service_categories?: {
      name: string;
    };
    service_subcategories?: {
      name: string;
    };
    standard_preparations?: {
      name: string;
      instructions: string;
    };
  };
}

const SearchServices = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [services, setServices] = useState<ServiceWithCompany[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      console.log('Fetching available services for search...');
      
      const { data, error } = await supabase
        .from('company_services')
        .select(`
          id,
          price,
          active,
          delivery_days,
          available_days,
          custom_preparation,
          lab_notes,
          company:companies!inner(
            id,
            name
          ),
          service:services!inner(
            id,
            name,
            description,
            patient_friendly_description,
            category,
            synonyms,
            related_diseases,
            service_categories(
              name
            ),
            service_subcategories(
              name
            ),
            standard_preparations(
              name,
              instructions
            )
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

      console.log('Services loaded for search:', data);
      setServices(data || []);
    } catch (error) {
      console.error('Error in fetchServices:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredServices = services.filter(service => {
    const searchLower = searchTerm.toLowerCase();
    const synonymsList = service.service.synonyms ? service.service.synonyms.split(',').map(s => s.trim().toLowerCase()) : [];
    const diseasesList = service.service.related_diseases ? service.service.related_diseases.split(',').map(s => s.trim().toLowerCase()) : [];
    const categoryName = service.service.service_categories?.name || service.service.category;
    const subcategoryName = service.service.service_subcategories?.name || '';
    const preparationName = service.service.standard_preparations?.name || '';
    
    return service.service.name.toLowerCase().includes(searchLower) ||
           service.service.description?.toLowerCase().includes(searchLower) ||
           service.service.patient_friendly_description?.toLowerCase().includes(searchLower) ||
           service.company.name.toLowerCase().includes(searchLower) ||
           categoryName.toLowerCase().includes(searchLower) ||
           subcategoryName.toLowerCase().includes(searchLower) ||
           preparationName.toLowerCase().includes(searchLower) ||
           synonymsList.some(synonym => synonym.includes(searchLower)) ||
           diseasesList.some(disease => disease.includes(searchLower));
  });

  const formatAvailableDays = (days?: string[]) => {
    if (!days || days.length === 0) return 'Consultar laboratório';
    
    const dayNames: { [key: string]: string } = {
      'monday': 'Seg',
      'tuesday': 'Ter', 
      'wednesday': 'Qua',
      'thursday': 'Qui',
      'friday': 'Sex',
      'saturday': 'Sáb',
      'sunday': 'Dom'
    };
    
    return days.map(day => dayNames[day] || day).join(', ');
  };

  if (isLoading || loading) {
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
                placeholder="Buscar por exame, categoria, empresa ou doença..."
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
                <p className="text-muted-foreground">
                  {searchTerm ? 'Nenhum serviço encontrado para sua busca' : 'Nenhum serviço disponível no momento'}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredServices.map((service) => (
              <Card key={service.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{service.service.name}</CardTitle>
                      <p className="text-sm text-muted-foreground font-medium">
                        {service.company.name}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className="inline-block px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                          {service.service.service_categories?.name || service.service.category}
                        </span>
                        {service.service.service_subcategories?.name && (
                          <span className="inline-block px-2 py-1 bg-secondary/10 text-secondary text-xs rounded-full">
                            {service.service.service_subcategories.name}
                          </span>
                        )}
                        {service.service.standard_preparations?.name && (
                          <span className="inline-block px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                            {service.service.standard_preparations.name}
                          </span>
                        )}
                      </div>
                      {service.service.synonyms && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Também conhecido como: {service.service.synonyms}
                        </p>
                      )}
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-2xl font-bold text-primary">
                        R$ {service.price.toFixed(2)}
                      </p>
                      {service.delivery_days && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                          <Clock className="h-3 w-3" />
                          <span>{service.delivery_days} dias</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Descrição amigável prioritária */}
                  {service.service.patient_friendly_description ? (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                      <p className="text-sm text-blue-800">{service.service.patient_friendly_description}</p>
                    </div>
                  ) : service.service.description && (
                    <p className="text-muted-foreground mb-4">{service.service.description}</p>
                  )}
                  
                  {/* Preparação (personalizada ou padrão) */}
                  {(service.custom_preparation || service.service.standard_preparations?.instructions) && (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
                      <p className="text-sm font-medium text-orange-800 mb-1">Preparação:</p>
                      <p className="text-sm text-orange-700">
                        {service.custom_preparation || service.service.standard_preparations?.instructions}
                      </p>
                    </div>
                  )}

                  {/* Observações do laboratório */}
                  {service.lab_notes && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                      <p className="text-sm font-medium text-yellow-800 mb-1">Observações do laboratório:</p>
                      <p className="text-sm text-yellow-700">{service.lab_notes}</p>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span>R$ {service.price.toFixed(2)}</span>
                    </div>
                    {service.delivery_days && (
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>Entrega: {service.delivery_days} dias</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{formatAvailableDays(service.available_days)}</span>
                    </div>
                  </div>

                  {/* Doenças relacionadas */}
                  {service.service.related_diseases && (
                    <div className="mb-4">
                      <p className="text-xs font-medium text-muted-foreground mb-1">Doenças relacionadas:</p>
                      <div className="flex flex-wrap gap-1">
                        {service.service.related_diseases.split(',').map((disease, index) => (
                          <span key={index} className="inline-block px-2 py-1 bg-red-50 text-red-700 text-xs rounded border border-red-200">
                            {disease.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

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
