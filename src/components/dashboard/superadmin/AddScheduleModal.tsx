
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AddScheduleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const AddScheduleModal = ({ open, onOpenChange, onSuccess }: AddScheduleModalProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    start_time: '',
    end_time: '',
    days_of_week: [] as string[],
    active: true
  });

  const daysOfWeek = [
    { id: 'monday', label: 'Segunda-feira' },
    { id: 'tuesday', label: 'Terça-feira' },
    { id: 'wednesday', label: 'Quarta-feira' },
    { id: 'thursday', label: 'Quinta-feira' },
    { id: 'friday', label: 'Sexta-feira' },
    { id: 'saturday', label: 'Sábado' },
    { id: 'sunday', label: 'Domingo' }
  ];

  const handleDayChange = (dayId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      days_of_week: checked
        ? [...prev.days_of_week, dayId]
        : prev.days_of_week.filter(d => d !== dayId)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.start_time || !formData.end_time || formData.days_of_week.length === 0) {
      toast({
        title: "Campos obrigatórios",
        description: "Todos os campos são obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    if (formData.start_time >= formData.end_time) {
      toast({
        title: "Horário inválido",
        description: "O horário de início deve ser anterior ao horário de fim.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('collection_schedules')
        .insert([formData]);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Horário criado com sucesso.",
      });

      setFormData({ name: '', start_time: '', end_time: '', days_of_week: [], active: true });
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error creating schedule:', error);
      toast({
        title: "Erro ao criar horário",
        description: error.message || "Não foi possível criar o horário.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Adicionar Horário de Coleta</DialogTitle>
          <DialogDescription>
            Crie um novo horário para coleta de exames
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nome *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Nome do horário"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="start_time">Início *</Label>
              <Input
                id="start_time"
                type="time"
                value={formData.start_time}
                onChange={(e) => setFormData(prev => ({ ...prev, start_time: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="end_time">Fim *</Label>
              <Input
                id="end_time"
                type="time"
                value={formData.end_time}
                onChange={(e) => setFormData(prev => ({ ...prev, end_time: e.target.value }))}
                required
              />
            </div>
          </div>

          <div>
            <Label>Dias da Semana *</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {daysOfWeek.map((day) => (
                <div key={day.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={day.id}
                    checked={formData.days_of_week.includes(day.id)}
                    onCheckedChange={(checked) => handleDayChange(day.id, checked as boolean)}
                  />
                  <Label htmlFor={day.id} className="text-sm">{day.label}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="active"
              checked={formData.active}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, active: checked }))}
            />
            <Label htmlFor="active">Ativo</Label>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Criando...' : 'Criar Horário'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddScheduleModal;
