
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building, MapPin, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Company } from '@/types/business';

interface DatabaseLocation {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  phone: string | null;
  email: string | null;
  active: boolean | null;
}

interface CompanyManagementProps {
  company: Company | null;
}

const CompanyManagement: React.FC<CompanyManagementProps> = ({ company }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [locations, setLocations] = useState<DatabaseLocation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (company) {
      fetchLocations();
    } else {
      setLoading(false);
    }
  }, [company]);

  const fetchLocations = async () => {
    if (!company) return;

    try {
      console.log('Fetching locations for company:', company.id);
      
      const { data, error } = await supabase
        .from('locations')
        .select('*')
        .eq('company_id', company.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching locations:', error);
        toast({
          title: "Erro ao carregar locais",
          description: "Não foi possível carregar os locais da empresa.",
          variant: "destructive",
        });
        return;
      }

      console.log('Locations loaded:', data);
      
      // Transformar os dados para o formato esperado
      const transformedLocations: DatabaseLocation[] = (data || []).map(location => ({
        id: location.id,
        name: location.name,
        address: location.address,
        city: location.city,
        state: location.state,
        zip_code: location.zip_code,
        phone: location.phone || '',
        email: location.email || '',
        active: location.active || false
      }));

      setLocations(transformedLocations);
    } catch (error) {
      console.error('Error in fetchLocations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddLocation = () => {
    console.log('Adicionar nova unidade');
    toast({
      title: "Funcionalidade em desenvolvimento",
      description: "A criação de unidades será implementada em breve.",
    });
  };

  if (!company) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Configurar Empresa
          </CardTitle>
          <CardDescription>
            Configure os dados da sua empresa para começar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => {
            toast({
              title: "Funcionalidade em desenvolvimento",
              description: "O cadastro de empresas será implementado em breve.",
            });
          }}>
            Cadastrar Empresa
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              {company.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            {company.name}
          </CardTitle>
          <CardDescription>
            {company.cnpj ? `CNPJ: ${company.cnpj}` : 'Empresa cadastrada'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              company.status === 'ativa' ? 'bg-green-100 text-green-800' :
              company.status === 'inativa' ? 'bg-red-100 text-red-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {company.status === 'ativa' ? 'Ativa' : 
               company.status === 'inativa' ? 'Inativa' : 'Em análise'}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Unidades de Atendimento
          </CardTitle>
          <CardDescription>
            Gerencie os locais onde sua empresa atende
          </CardDescription>
        </CardHeader>
        <CardContent>
          {locations.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                Nenhuma unidade cadastrada ainda
              </p>
              <Button onClick={handleAddLocation}>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Primeira Unidade
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {locations.map((location) => (
                <div key={location.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{location.name}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      location.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {location.active ? 'Ativa' : 'Inativa'}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {location.address}, {location.city} - {location.state}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    CEP: {location.zip_code}
                  </p>
                  {location.phone && (
                    <p className="text-sm text-muted-foreground">
                      Tel: {location.phone}
                    </p>
                  )}
                  {location.email && (
                    <p className="text-sm text-muted-foreground">
                      Email: {location.email}
                    </p>
                  )}
                </div>
              ))}
              <Button variant="outline" onClick={handleAddLocation}>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Unidade
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CompanyManagement;
