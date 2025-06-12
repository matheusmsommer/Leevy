import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, MapPin, Clock, DollarSign } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ServiceWithCompany {
  id: string;
  price: number;
  active: boolean;
  company: {
    id: string;
    name: string;
  };
  exam: {
    id: string;
    name: string;
    description?: string;
    category: string;
    synonyms?: string;
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
          company:companies!inner(
            id,
            name
          ),
          exam:exams!inner(
            id,
            name,
            description,
            category,
            synonyms
          )
        `)
        .eq('active', true)
        .order('exam.name');

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
    const synonymsList = service.exam.synonyms ? service.exam.synonyms.split(',').map(s => s.trim().toLowerCase()) : [];
    
    return service.exam.name.toLowerCase().includes(searchLower) ||
           service.exam.description?.toLowerCase().includes(searchLower) ||
           service.company.name.toLowerCase().includes(searchLower) ||
           service.exam.category.toLowerCase().includes(searchLower) ||
           synonymsList.some(synonym => synonym.includes(searchLower));
  });

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
                placeholder="Buscar por exame, categoria ou empresa..."
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
                    <div>
                      <CardTitle className="text-lg">{service.exam.name}</CardTitle>
                      <p className="text-sm text-muted-foreground font-medium">
                        {service.company.name}
                      </p>
                      {service.exam.synonyms && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Também conhecido como: {service.exam.synonyms}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">
                        R$ {service.price.toFixed(2)}
                      </p>
                      <span className="inline-block px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                        {service.exam.category}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {service.exam.description && (
                    <p className="text-muted-foreground mb-4">{service.exam.description}</p>
                  )}
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span>Preço: R$ {service.price.toFixed(2)}</span>
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
