
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Preparation {
  id: string;
  name: string;
}

interface DeletePreparationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preparation: Preparation | null;
  onSuccess: () => void;
}

const DeletePreparationModal = ({ open, onOpenChange, preparation, onSuccess }: DeletePreparationModalProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!preparation) return;

    setLoading(true);
    try {
      // Verificar se há serviços usando esta preparação
      const { data: services, error: servicesError } = await supabase
        .from('services')
        .select('id')
        .eq('preparation_id', preparation.id);

      if (servicesError) throw servicesError;

      if (services && services.length > 0) {
        toast({
          title: "Não é possível excluir",
          description: `Esta preparação está sendo usada por ${services.length} serviço(s). Remova ou altere os serviços primeiro.`,
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('standard_preparations')
        .delete()
        .eq('id', preparation.id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Preparação excluída com sucesso.",
      });

      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error deleting preparation:', error);
      toast({
        title: "Erro ao excluir preparação",
        description: error.message || "Não foi possível excluir a preparação.",
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
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Excluir Preparação
          </DialogTitle>
          <DialogDescription>
            Esta ação não pode ser desfeita.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm">
              <strong>Preparação:</strong> {preparation.name}
            </p>
          </div>

          <p className="text-sm text-muted-foreground">
            Tem certeza que deseja excluir esta preparação? Todos os dados relacionados serão perdidos permanentemente.
          </p>

          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={loading} className="flex-1">
              {loading ? 'Excluindo...' : 'Excluir'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeletePreparationModal;
