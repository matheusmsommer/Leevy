
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

interface Schedule {
  id: string;
  name: string;
  start_time: string;
  end_time: string;
  days_of_week: string[];
  active: boolean;
  created_at: string;
  updated_at: string;
}

interface ViewScheduleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  schedule: Schedule | null;
}

const ViewScheduleModal = ({ open, onOpenChange, schedule }: ViewScheduleModalProps) => {
  if (!schedule) return null;

  const formatDays = (days: string[]) => {
    const dayNames: { [key: string]: string } = {
      monday: 'Segunda-feira',
      tuesday: 'Terça-feira',
      wednesday: 'Quarta-feira',
      thursday: 'Quinta-feira',
      friday: 'Sexta-feira',
      saturday: 'Sábado',
      sunday: 'Domingo'
    };

    return days.map(day => dayNames[day] || day).join(', ');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Detalhes do Horário</DialogTitle>
          <DialogDescription>
            Informações completas do horário de coleta
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Nome</label>
            <p className="text-foreground font-medium">{schedule.name}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">Horário</label>
            <p className="text-foreground mt-1">
              {schedule.start_time} - {schedule.end_time}
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">Dias da Semana</label>
            <p className="text-foreground mt-1">{formatDays(schedule.days_of_week)}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">Status</label>
            <div className="mt-1">
              <Badge variant={schedule.active ? "default" : "secondary"}>
                {schedule.active ? 'Ativo' : 'Inativo'}
              </Badge>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">Criado em</label>
            <p className="text-foreground mt-1">
              {new Date(schedule.created_at).toLocaleDateString('pt-BR')}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewScheduleModal;
