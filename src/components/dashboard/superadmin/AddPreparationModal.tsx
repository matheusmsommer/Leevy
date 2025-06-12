
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AddPreparationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const AddPreparationModal = ({ open, onOpenChange, onSuccess }: AddPreparationModalProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    instructions: '',
    active: true
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.instructions.trim()) {
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
        .insert([formData]);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Preparação criada com sucesso.",
      });

      setFormData({ name: '', instructions: '', active: true });
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error creating preparation:', error);
      toast({
        title: "Erro ao criar preparação",
        description: error.message || "Não foi possível criar a preparação.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Adicionar Preparação</DialogTitle>
          <DialogDescription>
            Crie uma nova preparação padronizada
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
              {loading ? 'Criando...' : 'Criar Preparação'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddPreparationModal;
