
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Star, StarOff, Trash2, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface ServicePreparation {
  id: string;
  is_primary: boolean;
  preparation: {
    id: string;
    name: string;
    instructions: string;
  };
}

interface StandardPreparation {
  id: string;
  name: string;
  instructions: string;
}

interface ImprovedServicePreparationsManagerProps {
  serviceId: string;
  onUpdate?: () => void;
}

const ImprovedServicePreparationsManager = ({ serviceId, onUpdate }: ImprovedServicePreparationsManagerProps) => {
  const { toast } = useToast();
  const [servicePreparations, setServicePreparations] = useState<ServicePreparation[]>([]);
  const [standardPreparations, setStandardPreparations] = useState<StandardPreparation[]>([]);
  const [filteredPreparations, setFilteredPreparations] = useState<StandardPreparation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedPreparation, setSelectedPreparation] = useState<StandardPreparation | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);

  useEffect(() => {
    if (serviceId) {
      fetchServicePreparations();
      fetchStandardPreparations();
    }
  }, [serviceId]);

  useEffect(() => {
    if (searchTerm.trim()) {
      const available = standardPreparations.filter(
        sp => !servicePreparations.some(ep => ep.preparation.id === sp.id)
      );
      const filtered = available.filter(prep => 
        prep.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPreparations(filtered);
      setShowSearchResults(true);
    } else {
      setFilteredPreparations([]);
      setShowSearchResults(false);
    }
  }, [searchTerm, standardPreparations, servicePreparations]);

  const fetchServicePreparations = async () => {
    try {
      console.log('Fetching service preparations for service:', serviceId);
      const { data, error } = await supabase
        .from('service_preparations')
        .select(`
          id,
          is_primary,
          preparation:standard_preparations (
            id,
            name,
            instructions
          )
        `)
        .eq('service_id', serviceId);

      if (error) {
        console.error('Error fetching service preparations:', error);
        return;
      }

      console.log('Service preparations loaded:', data);
      setServicePreparations(data || []);
    } catch (error) {
      console.error('Error in fetchServicePreparations:', error);
    }
  };

  const fetchStandardPreparations = async () => {
    try {
      const { data, error } = await supabase
        .from('standard_preparations')
        .select('*')
        .eq('active', true)
        .order('name');

      if (error) {
        console.error('Error fetching standard preparations:', error);
        return;
      }

      setStandardPreparations(data || []);
    } catch (error) {
      console.error('Error in fetchStandardPreparations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPreparation = async (preparationId: string) => {
    try {
      // Verificar se já existe
      const existing = servicePreparations.find(
        sp => sp.preparation.id === preparationId
      );

      if (existing) {
        toast({
          title: "Preparação já adicionada",
          description: "Esta preparação já está associada ao serviço.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('service_preparations')
        .insert({
          service_id: serviceId,
          preparation_id: preparationId,
          is_primary: servicePreparations.length === 0 // Primeira preparação é primária
        });

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Preparação adicionada com sucesso.",
      });

      setSearchTerm('');
      setShowSearchResults(false);
      fetchServicePreparations();
      onUpdate?.();
    } catch (error: any) {
      console.error('Error adding preparation:', error);
      toast({
        title: "Erro ao adicionar preparação",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSetPrimary = async (preparationId: string) => {
    try {
      // Remover primária de todas
      await supabase
        .from('service_preparations')
        .update({ is_primary: false })
        .eq('service_id', serviceId);

      // Definir a selecionada como primária
      const { error } = await supabase
        .from('service_preparations')
        .update({ is_primary: true })
        .eq('service_id', serviceId)
        .eq('id', preparationId);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Preparação primária atualizada.",
      });

      fetchServicePreparations();
      onUpdate?.();
    } catch (error: any) {
      console.error('Error setting primary:', error);
      toast({
        title: "Erro ao definir preparação primária",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleRemovePreparation = async (preparationId: string) => {
    try {
      const { error } = await supabase
        .from('service_preparations')
        .delete()
        .eq('id', preparationId);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Preparação removida com sucesso.",
      });

      fetchServicePreparations();
      onUpdate?.();
    } catch (error: any) {
      console.error('Error removing preparation:', error);
      toast({
        title: "Erro ao remover preparação",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleViewPreparation = (preparation: StandardPreparation) => {
    setSelectedPreparation(preparation);
    setShowViewModal(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h4 className="text-sm font-semibold">Preparações Associadas</h4>
          <p className="text-xs text-muted-foreground">
            {servicePreparations.length} preparação(ões) configurada(s)
          </p>
        </div>
      </div>

      {/* Campo de busca para adicionar preparações */}
      <div className="relative">
        <Input
          placeholder="Buscar preparação para adicionar..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
        
        {/* Resultados da busca */}
        {showSearchResults && (
          <div className="absolute top-full left-0 right-0 z-50 bg-background border border-border rounded-md shadow-lg mt-1 max-h-48 overflow-y-auto">
            {filteredPreparations.length > 0 ? (
              filteredPreparations.map((prep) => (
                <div 
                  key={prep.id}
                  className="p-3 hover:bg-muted cursor-pointer border-b border-border last:border-0"
                  onClick={() => handleAddPreparation(prep.id)}
                >
                  <div className="font-medium text-sm">{prep.name}</div>
                  <div className="text-xs text-muted-foreground line-clamp-2">
                    {prep.instructions}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-3 text-sm text-muted-foreground text-center">
                Nenhuma preparação encontrada
              </div>
            )}
          </div>
        )}
      </div>

      {servicePreparations.length === 0 ? (
        <Card>
          <CardContent className="text-center py-6">
            <p className="text-sm text-muted-foreground">
              Nenhuma preparação associada ainda
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {servicePreparations.map((servicePrep) => (
            <Card key={servicePrep.id} className="relative">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h5 className="font-medium">{servicePrep.preparation.name}</h5>
                      {servicePrep.is_primary && (
                        <Badge variant="default" className="text-xs">
                          <Star className="h-3 w-3 mr-1" />
                          Primária
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {servicePrep.preparation.instructions}
                    </p>
                  </div>
                  <div className="flex gap-1 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewPreparation(servicePrep.preparation)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSetPrimary(servicePrep.id)}
                      disabled={servicePrep.is_primary}
                    >
                      {servicePrep.is_primary ? (
                        <Star className="h-4 w-4 text-yellow-500" />
                      ) : (
                        <StarOff className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemovePreparation(servicePrep.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Modal para visualizar preparação */}
      <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedPreparation?.name}</DialogTitle>
            <DialogDescription>Detalhes da preparação</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Instruções:</h4>
              <p className="text-sm text-gray-600 whitespace-pre-wrap">
                {selectedPreparation?.instructions}
              </p>
            </div>
            <div className="flex justify-end">
              <Button onClick={() => setShowViewModal(false)}>
                Fechar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ImprovedServicePreparationsManager;
