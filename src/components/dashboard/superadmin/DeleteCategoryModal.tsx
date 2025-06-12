
import React, { useState } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Category {
  id: string;
  name: string;
  description?: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

interface DeleteCategoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: Category | null;
  onCategoryDeleted: () => void;
}

const DeleteCategoryModal = ({ open, onOpenChange, category, onCategoryDeleted }: DeleteCategoryModalProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!category) return;

    setLoading(true);

    try {
      // Check if category is being used
      const { data: exams, error: examError } = await supabase
        .from('exams')
        .select('id')
        .eq('category_id', category.id)
        .limit(1);

      if (examError) {
        console.error('Error checking exams:', examError);
        toast({
          title: "Erro ao verificar dependências",
          description: "Não foi possível verificar se a categoria está sendo usada.",
          variant: "destructive",
        });
        return;
      }

      if (exams && exams.length > 0) {
        toast({
          title: "Não é possível excluir",
          description: "Esta categoria está sendo usada por exames. Remova dos exames antes de excluir.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('exam_categories')
        .delete()
        .eq('id', category.id);

      if (error) {
        console.error('Error deleting category:', error);
        toast({
          title: "Erro ao excluir categoria",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Sucesso",
        description: "Categoria excluída com sucesso!",
      });

      onCategoryDeleted();
      onOpenChange(false);
    } catch (error) {
      console.error('Error in handleDelete:', error);
      toast({
        title: "Erro inesperado",
        description: "Ocorreu um erro ao excluir a categoria.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!category) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-destructive">
            Excluir Categoria
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>
              Tem certeza que deseja excluir a categoria <strong>"{category.name}"</strong>?
            </p>
            <p className="text-sm text-muted-foreground">
              Esta ação não pode ser desfeita. A categoria será removida permanentemente do sistema.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={loading}
            className="bg-destructive hover:bg-destructive/90"
          >
            {loading ? 'Excluindo...' : 'Excluir'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteCategoryModal;
