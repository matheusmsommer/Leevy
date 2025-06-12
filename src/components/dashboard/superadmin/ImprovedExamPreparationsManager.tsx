
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Check, ChevronDown, X, Star, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StandardPreparation {
  id: string;
  name: string;
  instructions: string;
  active: boolean;
}

interface ExamPreparation {
  id: string;
  preparation_id: string;
  is_primary: boolean;
  preparation: StandardPreparation;
}

interface ImprovedExamPreparationsManagerProps {
  examId: string;
  onUpdate?: () => void;
}

const ImprovedExamPreparationsManager = ({ examId, onUpdate }: ImprovedExamPreparationsManagerProps) => {
  const { toast } = useToast();
  const [preparations, setPreparations] = useState<StandardPreparation[]>([]);
  const [examPreparations, setExamPreparations] = useState<ExamPreparation[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPreparations();
    fetchExamPreparations();
  }, [examId]);

  const fetchPreparations = async () => {
    try {
      const { data, error } = await supabase
        .from('standard_preparations')
        .select('*')
        .eq('active', true)
        .order('name');

      if (error) throw error;
      setPreparations(data || []);
    } catch (error: any) {
      console.error('Error fetching preparations:', error);
      toast({
        title: "Erro ao carregar preparações",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const fetchExamPreparations = async () => {
    try {
      const { data, error } = await supabase
        .from('exam_preparations')
        .select(`
          id,
          preparation_id,
          is_primary,
          preparation:standard_preparations(*)
        `)
        .eq('exam_id', examId);

      if (error) throw error;
      setExamPreparations(data || []);
    } catch (error: any) {
      console.error('Error fetching exam preparations:', error);
      toast({
        title: "Erro ao carregar preparações do exame",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const addPreparation = async (preparationId: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('exam_preparations')
        .insert([{
          exam_id: examId,
          preparation_id: preparationId,
          is_primary: examPreparations.length === 0
        }]);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Preparação adicionada ao exame.",
      });

      fetchExamPreparations();
      onUpdate?.();
      setOpen(false);
    } catch (error: any) {
      console.error('Error adding preparation:', error);
      toast({
        title: "Erro ao adicionar preparação",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const removePreparation = async (examPreparationId: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('exam_preparations')
        .delete()
        .eq('id', examPreparationId);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Preparação removida do exame.",
      });

      fetchExamPreparations();
      onUpdate?.();
    } catch (error: any) {
      console.error('Error removing preparation:', error);
      toast({
        title: "Erro ao remover preparação",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const togglePrimary = async (examPreparationId: string, isPrimary: boolean) => {
    setLoading(true);
    try {
      if (isPrimary) {
        await supabase
          .from('exam_preparations')
          .update({ is_primary: false })
          .eq('exam_id', examId);
      }

      const { error } = await supabase
        .from('exam_preparations')
        .update({ is_primary: isPrimary })
        .eq('id', examPreparationId);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: isPrimary ? "Preparação definida como principal." : "Preparação removida como principal.",
      });

      fetchExamPreparations();
      onUpdate?.();
    } catch (error: any) {
      console.error('Error updating primary status:', error);
      toast({
        title: "Erro ao atualizar status",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const availablePreparations = preparations.filter(
    prep => !examPreparations.some(ep => ep.preparation_id === prep.id)
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Label className="text-base font-medium">Preparações Padronizadas</Label>
          <p className="text-sm text-muted-foreground">
            Configure as preparações específicas para este exame
          </p>
        </div>
        
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="gap-2 min-w-[180px]"
              disabled={loading}
            >
              <Plus className="h-4 w-4" />
              Adicionar preparação
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[500px] p-0" align="end">
            <Command>
              <CommandInput 
                placeholder="Busque por nome da preparação..." 
                className="h-12"
              />
              <CommandList className="max-h-[300px]">
                <CommandEmpty>
                  <div className="py-6 text-center">
                    <p className="text-sm text-muted-foreground">
                      Nenhuma preparação encontrada
                    </p>
                  </div>
                </CommandEmpty>
                <CommandGroup>
                  {availablePreparations.map((preparation) => (
                    <CommandItem
                      key={preparation.id}
                      value={preparation.name}
                      onSelect={() => addPreparation(preparation.id)}
                      disabled={loading}
                      className="p-4 cursor-pointer"
                    >
                      <div className="flex items-center gap-3 w-full">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <Check className="h-4 w-4 text-primary" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm">{preparation.name}</div>
                          <div className="text-xs text-muted-foreground line-clamp-2 mt-1">
                            {preparation.instructions.length > 120 
                              ? `${preparation.instructions.substring(0, 120)}...`
                              : preparation.instructions
                            }
                          </div>
                        </div>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-3">
        {examPreparations.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-muted-foreground">
                <Plus className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Nenhuma preparação configurada</p>
                <p className="text-xs mt-1">
                  Clique em "Adicionar preparação" para configurar
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          examPreparations.map((examPrep) => (
            <Card key={examPrep.id} className="border-l-4 border-l-primary/20">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium text-sm">{examPrep.preparation.name}</h4>
                      {examPrep.is_primary && (
                        <Badge variant="default" className="text-xs gap-1">
                          <Star className="h-3 w-3" />
                          Principal
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {examPrep.preparation.instructions}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {!examPrep.is_primary && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => togglePrimary(examPrep.id, true)}
                        disabled={loading}
                        className="gap-1"
                      >
                        <Star className="h-3 w-3" />
                        Tornar principal
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removePreparation(examPrep.id)}
                      disabled={loading}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default ImprovedExamPreparationsManager;
