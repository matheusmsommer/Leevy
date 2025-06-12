
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Subcategory {
  id: string;
  name: string;
  exam_categories?: {
    name: string;
  };
}

interface DeleteSubcategoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subcategory: Subcategory | null;
  onSuccess: () => void;
}

const DeleteSubcategoryModal = ({ open, onOpenChange, subcategory, onSuccess }: DeleteSubcategoryModalProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!subcategory) return;

    setLoading(true);
    try {
      // Verificar se há exames usando esta subcategoria
      const { data: exams, error: examError } = await supabase
        .from('exams')
        .select('id')
        .eq('subcategory_id', subcategory.id);

      if (examError) throw examError;

      if (exams && exams.length > 0) {
        toast({
          title: "Não é possível excluir",
          description: `Esta subcategoria está sendo usada por ${exams.length} exame(s). Remova ou altere os exames primeiro.`,
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('exam_subcategories')
        .delete()
        .eq('id', subcategory.id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Subcategoria excluída com sucesso.",
      });

      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error deleting subcategory:', error);
      toast({
        title: "Erro ao excluir subcategoria",
        description: error.message || "Não foi possível excluir a subcategoria.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!subcategory) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Excluir Subcategoria
          </DialogTitle>
          <DialogDescription>
            Esta ação não pode ser desfeita.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm">
              <strong>Subcategoria:</strong> {subcategory.name}
            </p>
            <p className="text-sm text-muted-foreground">
              <strong>Categoria:</strong> {subcategory.exam_categories?.name || 'N/A'}
            </p>
          </div>

          <p className="text-sm text-muted-foreground">
            Tem certeza que deseja excluir esta subcategoria? Todos os dados relacionados serão perdidos permanentemente.
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

export default DeleteSubcategoryModal;
