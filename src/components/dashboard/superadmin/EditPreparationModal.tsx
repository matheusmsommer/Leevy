
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Preparation {
  id: string;
  name: string;
  instructions: string;
  active: boolean;
}

interface EditPreparationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preparation: Preparation | null;
  onSuccess: () => void;
}

const EditPreparationModal = ({ open, onOpenChange, preparation, onSuccess }: EditPreparationModalProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    instructions: '',
    active: true
  });

  useEffect(() => {
    if (open && preparation) {
      setFormData({
        name: preparation.name,
        instructions: preparation.instructions,
        active: preparation.active
      });
    }
  }, [open, preparation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.instructions.trim() || !preparation) {
      toast({
        title: "Campos obrigatórios",
        description: "Nome e instruções são obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('standard_preparations')
        .update(formData)
        .eq('id', preparation.id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Preparação atualizada com sucesso.",
      });

      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error updating preparation:', error);
      toast({
        title: "Erro ao atualizar preparação",
        description: error.message || "Não foi possível atualizar a preparação.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!preparation) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Preparação</DialogTitle>
          <DialogDescription>
            Atualize as informações da preparação
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nome *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Nome da preparação"
              required
            />
          </div>

          <div>
            <Label htmlFor="instructions">Instruções *</Label>
            <Textarea
              id="instructions"
              value={formData.instructions}
              onChange={(e) => setFormData(prev => ({ ...prev, instructions: e.target.value }))}
              placeholder="Instruções detalhadas da preparação"
              rows={4}
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="active"
              checked={formData.active}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, active: checked }))}
            />
            <Label htmlFor="active">Ativa</Label>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditPreparationModal;
