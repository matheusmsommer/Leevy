
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

interface Subcategory {
  id: string;
  name: string;
  description?: string;
  active: boolean;
  created_at: string;
  updated_at: string;
  exam_categories?: {
    name: string;
  };
}

interface ViewSubcategoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subcategory: Subcategory | null;
}

const ViewSubcategoryModal = ({ open, onOpenChange, subcategory }: ViewSubcategoryModalProps) => {
  if (!subcategory) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Detalhes da Subcategoria</DialogTitle>
          <DialogDescription>
            Informações completas da subcategoria
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Nome</label>
            <p className="text-foreground font-medium">{subcategory.name}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">Categoria</label>
            <div className="mt-1">
              <Badge variant="outline">
                {subcategory.exam_categories?.name || 'N/A'}
              </Badge>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">Status</label>
            <div className="mt-1">
              <Badge variant={subcategory.active ? "default" : "secondary"}>
                {subcategory.active ? 'Ativa' : 'Inativa'}
              </Badge>
            </div>
          </div>

          {subcategory.description && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">Descrição</label>
              <p className="text-foreground mt-1">{subcategory.description}</p>
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-muted-foreground">Criada em</label>
            <p className="text-foreground mt-1">
              {new Date(subcategory.created_at).toLocaleDateString('pt-BR')}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewSubcategoryModal;
