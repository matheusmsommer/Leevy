
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface GlobalExam {
  id: string;
  name: string;
  code: string;
  category: string;
  preparation?: string;
  description?: string;
  synonyms?: string;
}

interface ViewExamModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  exam: GlobalExam | null;
}

const ViewExamModal = ({ open, onOpenChange, exam }: ViewExamModalProps) => {
  if (!exam) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-foreground">
            Detalhes do Exame
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Visualizar informações completas do exame
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Nome do Exame</label>
              <p className="text-foreground font-medium">{exam.name}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-muted-foreground">Código</label>
              <p className="text-foreground font-mono text-sm bg-muted/20 rounded px-2 py-1 w-fit">
                {exam.code}
              </p>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">Categoria</label>
            <div className="mt-1">
              <Badge variant="outline" className="border-primary/20 text-primary bg-primary/5">
                {exam.category}
              </Badge>
            </div>
          </div>

          <Separator />

          {exam.description && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">Descrição</label>
              <p className="text-foreground mt-1 leading-relaxed">{exam.description}</p>
            </div>
          )}

          {exam.preparation && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">Preparação</label>
              <p className="text-foreground mt-1 leading-relaxed">{exam.preparation}</p>
            </div>
          )}

          {exam.synonyms && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">Sinônimos</label>
              <p className="text-foreground mt-1 leading-relaxed">{exam.synonyms}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewExamModal;
