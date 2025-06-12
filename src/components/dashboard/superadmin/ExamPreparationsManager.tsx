
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Check, ChevronDown, X, Star } from 'lucide-react';
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

interface ExamPreparationsManagerProps {
  examId: string;
  onUpdate?: () => void;
}

const ExamPreparationsManager = ({ examId, onUpdate }: ExamPreparationsManagerProps) => {
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
          is_primary: examPreparations.length === 0 // First one is primary
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
      // If setting as primary, first remove primary from others
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
        <Label className="text-sm font-medium">Preparações do Exame</Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              role="combobox"
              aria-expanded={open}
              className="w-[200px] justify-between"
            >
              Adicionar preparação
              <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[400px] p-0">
            <Command>
              <CommandInput placeholder="Buscar preparação..." />
              <CommandList>
                <CommandEmpty>Nenhuma preparação encontrada.</CommandEmpty>
                <CommandGroup>
                  {availablePreparations.map((preparation) => (
                    <CommandItem
                      key={preparation.id}
                      value={preparation.name}
                      onSelect={() => addPreparation(preparation.id)}
                      disabled={loading}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          "opacity-0"
                        )}
                      />
                      <div className="flex-1">
                        <div className="font-medium">{preparation.name}</div>
                        <div className="text-xs text-muted-foreground truncate">
                          {preparation.instructions.substring(0, 100)}...
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

      <div className="space-y-2">
        {examPreparations.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nenhuma preparação configurada para este exame.
          </p>
        ) : (
          examPreparations.map((examPrep) => (
            <div
              key={examPrep.id}
              className="flex items-center justify-between p-3 border rounded-lg bg-muted/20"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{examPrep.preparation.name}</span>
                  {examPrep.is_primary && (
                    <Badge variant="default" className="text-xs">
                      <Star className="h-3 w-3 mr-1" />
                      Principal
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {examPrep.preparation.instructions.substring(0, 150)}...
                </p>
              </div>
              <div className="flex items-center gap-2">
                {!examPrep.is_primary && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => togglePrimary(examPrep.id, true)}
                    disabled={loading}
                  >
                    <Star className="h-3 w-3" />
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removePreparation(examPrep.id)}
                  disabled={loading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ExamPreparationsManager;
