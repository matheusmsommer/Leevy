
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

interface Preparation {
  id: string;
  name: string;
  instructions: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

interface ViewPreparationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preparation: Preparation | null;
}

const ViewPreparationModal = ({ open, onOpenChange, preparation }: ViewPreparationModalProps) => {
  if (!preparation) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Detalhes da Preparação</DialogTitle>
          <DialogDescription>
            Informações completas da preparação
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Nome</label>
            <p className="text-foreground font-medium">{preparation.name}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">Status</label>
            <div className="mt-1">
              <Badge variant={preparation.active ? "default" : "secondary"}>
                {preparation.active ? 'Ativa' : 'Inativa'}
              </Badge>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">Instruções</label>
            <div className="mt-1 p-3 bg-muted rounded-lg">
              <p className="text-foreground text-sm whitespace-pre-line">{preparation.instructions}</p>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">Criada em</label>
            <p className="text-foreground mt-1">
              {new Date(preparation.created_at).toLocaleDateString('pt-BR')}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewPreparationModal;
