
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Plus, Edit, Trash2, Clock, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Schedule {
  id: string;
  name: string;
  start_time: string;
  end_time: string;
  days_of_week: string[];
  active: boolean;
}

const ScheduleManagement = () => {
  const { toast } = useToast();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      const { data, error } = await supabase
        .from('collection_schedules')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching schedules:', error);
        toast({
          title: "Erro ao carregar horários",
          description: "Não foi possível carregar os horários.",
          variant: "destructive",
        });
        return;
      }

      setSchedules(data || []);
    } catch (error) {
      console.error('Error in fetchSchedules:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDays = (days: string[]) => {
    const dayNames: { [key: string]: string } = {
      monday: 'Seg',
      tuesday: 'Ter',
      wednesday: 'Qua',
      thursday: 'Qui',
      friday: 'Sex',
      saturday: 'Sáb',
      sunday: 'Dom'
    };

    return days.map(day => dayNames[day] || day).join(', ');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Horários de Coleta</h3>
          <p className="text-sm text-muted-foreground">
            Gerencie os horários disponíveis para coleta de exames
          </p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Horário
        </Button>
      </div>

      {schedules.length === 0 ? (
        <div className="text-center py-12">
          <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Nenhum horário cadastrado</p>
        </div>
      ) : (
        <div className="border border-border rounded-xl overflow-hidden bg-card">
          <Table>
            <TableHeader>
              <TableRow className="border-border bg-muted/30">
                <TableHead>Nome</TableHead>
                <TableHead>Horário</TableHead>
                <TableHead>Dias da Semana</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {schedules.map((schedule) => (
                <TableRow key={schedule.id} className="border-border hover:bg-muted/20">
                  <TableCell className="font-medium">{schedule.name}</TableCell>
                  <TableCell>
                    {schedule.start_time} - {schedule.end_time}
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {formatDays(schedule.days_of_week)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={schedule.active ? "default" : "secondary"}>
                      {schedule.active ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2 justify-center">
                      <HoverCard>
                        <HoverCardTrigger asChild>
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </HoverCardTrigger>
                        <HoverCardContent>
                          <p className="text-sm">Visualizar horário</p>
                        </HoverCardContent>
                      </HoverCard>

                      <HoverCard>
                        <HoverCardTrigger asChild>
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </HoverCardTrigger>
                        <HoverCardContent>
                          <p className="text-sm">Editar horário</p>
                        </HoverCardContent>
                      </HoverCard>

                      <HoverCard>
                        <HoverCardTrigger asChild>
                          <Button size="sm" variant="outline" className="text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </HoverCardTrigger>
                        <HoverCardContent>
                          <p className="text-sm">Excluir horário</p>
                        </HoverCardContent>
                      </HoverCard>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default ScheduleManagement;
