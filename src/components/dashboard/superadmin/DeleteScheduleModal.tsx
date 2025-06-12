
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Schedule {
  id: string;
  name: string;
  start_time: string;
  end_time: string;
}

interface DeleteScheduleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  schedule: Schedule | null;
  onSuccess: () => void;
}

const DeleteScheduleModal = ({ open, onOpenChange, schedule, onSuccess }: DeleteScheduleModalProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!schedule) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('collection_schedules')
        .delete()
        .eq('id', schedule.id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Horário excluído com sucesso.",
      });

      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error deleting schedule:', error);
      toast({
        title: "Erro ao excluir horário",
        description: error.message || "Não foi possível excluir o horário.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!schedule) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Excluir Horário
          </DialogTitle>
          <DialogDescription>
            Esta ação não pode ser desfeita.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm">
              <strong>Horário:</strong> {schedule.name}
            </p>
            <p className="text-sm text-muted-foreground">
              <strong>Período:</strong> {schedule.start_time} - {schedule.end_time}
            </p>
          </div>

          <p className="text-sm text-muted-foreground">
            Tem certeza que deseja excluir este horário? Todos os dados relacionados serão perdidos permanentemente.
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

export default DeleteScheduleModal;
