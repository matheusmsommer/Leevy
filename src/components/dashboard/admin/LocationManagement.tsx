
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, MapPin, Phone, Mail } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  phone?: string;
  email?: string;
  active: boolean;
}

const LocationManagement = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLocations();
  }, [user]);

  const fetchLocations = async () => {
    if (!user) return;

    try {
      console.log('Fetching locations for user:', user.id);
      
      // Primeiro, buscar o perfil do usuário para obter company_id
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error('Error fetching user profile:', profileError);
        return;
      }

      if (!profile?.company_id) {
        console.log('User has no company_id');
        setLocations([]);
        setLoading(false);
        return;
      }

      // Buscar locais da empresa
      const { data, error } = await supabase
        .from('locations')
        .select('*')
        .eq('company_id', profile.company_id)
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
      setLocations(data || []);
    } catch (error) {
      console.error('Error in fetchLocations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (locationId: string, currentActive: boolean) => {
    try {
      const { error } = await supabase
        .from('locations')
        .update({ active: !currentActive })
        .eq('id', locationId);

      if (error) {
        console.error('Error updating location status:', error);
        toast({
          title: "Erro",
          description: "Não foi possível atualizar o status do local.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Sucesso",
        description: `Local ${!currentActive ? 'ativado' : 'desativado'} com sucesso.`,
      });

      // Recarregar dados
      fetchLocations();
    } catch (error) {
      console.error('Error in handleToggleActive:', error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Locais</h1>
            <p className="text-muted-foreground mt-2">
              Gerencie as unidades do seu laboratório
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Locais</h1>
          <p className="text-muted-foreground mt-2">
            Gerencie as unidades do seu laboratório
          </p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 shadow-sm">
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Local
        </Button>
      </div>

      {locations.length === 0 ? (
        <Card className="border-border shadow-sm">
          <CardContent className="text-center py-12">
            <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Nenhum local cadastrado ainda</p>
            <Button className="mt-4 bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Primeiro Local
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {locations.map((location) => (
            <Card key={location.id} className="border-border shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-semibold text-foreground">{location.name}</CardTitle>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleToggleActive(location.id, location.active)}
                  >
                    {location.active ? (
                      <Badge className="bg-primary/10 text-primary border-primary/20">
                        Ativa
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="border-muted text-muted-foreground">
                        Inativa
                      </Badge>
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
                    <div className="text-sm">
                      <p className="text-foreground">{location.address}</p>
                      <p className="text-muted-foreground">{location.city}, {location.state} - {location.zip_code}</p>
                    </div>
                  </div>

                  {location.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <span className="text-sm text-foreground">{location.phone}</span>
                    </div>
                  )}

                  {location.email && (
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <span className="text-sm text-foreground">{location.email}</span>
                    </div>
                  )}
                </div>

                <div className="border-t border-border pt-4">
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1 border-border hover:bg-accent">
                      <Edit className="h-4 w-4 mr-2" />
                      Editar
                    </Button>
                    <Button size="sm" variant="outline" className="border-destructive/20 text-destructive hover:bg-destructive/10">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default LocationManagement;
