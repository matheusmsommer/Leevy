
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Package, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Combo {
  id: string;
  name: string;
  description?: string;
  price: number;
  active: boolean;
  company_id: string;
  services: Array<{
    exam: {
      name: string;
    };
  }>;
}

const ComboManagement = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [combos, setCombos] = useState<Combo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCombos();
  }, [user]);

  const fetchCombos = async () => {
    if (!user) return;

    try {
      console.log('Fetching combos for user:', user.id);
      
      // Buscar o perfil do usuário para obter company_id
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
        setCombos([]);
        setLoading(false);
        return;
      }

      // Por enquanto, não temos tabela de combos, então deixamos vazio
      // Quando implementarmos combos no futuro, aqui será a query real
      setCombos([]);
    } catch (error) {
      console.error('Error in fetchCombos:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Combos</h1>
            <p className="text-muted-foreground mt-2">
              Gerencie pacotes de exames com preços especiais
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
          <h1 className="text-3xl font-bold text-foreground">Combos</h1>
          <p className="text-muted-foreground mt-2">
            Gerencie pacotes de exames com preços especiais
          </p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 shadow-sm">
          <Plus className="h-4 w-4 mr-2" />
          Criar Combo
        </Button>
      </div>

      <Card className="border-border shadow-sm">
        <CardContent className="text-center py-12">
          <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Nenhum combo cadastrado ainda</p>
          <p className="text-sm text-muted-foreground mt-2">
            Funcionalidade de combos será implementada em breve
          </p>
          <Button className="mt-4 bg-primary hover:bg-primary/90" disabled>
            <Plus className="h-4 w-4 mr-2" />
            Criar Primeiro Combo
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComboManagement;
