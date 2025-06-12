
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

interface Category {
  id: string;
  name: string;
  description?: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

interface ViewCategoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: Category | null;
}

const ViewCategoryModal = ({ open, onOpenChange, category }: ViewCategoryModalProps) => {
  if (!category) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Detalhes da Categoria</DialogTitle>
          <DialogDescription>
            Informações completas da categoria
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Nome</label>
            <p className="text-foreground font-medium">{category.name}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">Status</label>
            <div className="mt-1">
              <Badge variant={category.active ? "default" : "secondary"}>
                {category.active ? 'Ativa' : 'Inativa'}
              </Badge>
            </div>
          </div>

          {category.description && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">Descrição</label>
              <p className="text-foreground mt-1">{category.description}</p>
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-muted-foreground">Criada em</label>
            <p className="text-foreground mt-1">
              {new Date(category.created_at).toLocaleDateString('pt-BR')}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewCategoryModal;
