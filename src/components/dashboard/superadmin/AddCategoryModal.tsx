
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { TestTube, Scan, Stethoscope, Scissors, UserCheck, HardHat, Settings } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface AddCategoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCategoryAdded: () => void;
}

const availableIcons = [
  { name: 'TestTube', component: TestTube, label: 'Exames Laboratoriais' },
  { name: 'Scan', component: Scan, label: 'Exames de Imagem' },
  { name: 'Stethoscope', component: Stethoscope, label: 'Exames Médicos' },
  { name: 'Scissors', component: Scissors, label: 'Procedimentos' },
  { name: 'UserCheck', component: UserCheck, label: 'Consultas' },
  { name: 'HardHat', component: HardHat, label: 'Ocupacional' },
  { name: 'Settings', component: Settings, label: 'Serviços Gerais' },
];

const AddCategoryModal = ({ open, onOpenChange, onCategoryAdded }: AddCategoryModalProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: 'Settings',
    active: true
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast({
        title: "Erro de validação",
        description: "Nome da categoria é obrigatório.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('exam_categories')
        .insert({
          name: formData.name.trim(),
          description: formData.description.trim() || null,
          icon: formData.icon,
          active: formData.active
        });

      if (error) {
        console.error('Error adding category:', error);
        toast({
          title: "Erro ao adicionar categoria",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Sucesso",
        description: "Categoria adicionada com sucesso!",
      });

      setFormData({ name: '', description: '', icon: 'Settings', active: true });
      onCategoryAdded();
      onOpenChange(false);
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      toast({
        title: "Erro inesperado",
        description: "Ocorreu um erro ao adicionar a categoria.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Adicionar Nova Categoria</DialogTitle>
          <DialogDescription>
            Crie uma nova categoria para classificar os exames
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome da Categoria *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Ex: Cardiologia"
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Descrição da categoria..."
              rows={3}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label>Ícone da Categoria</Label>
            <div className="grid grid-cols-3 gap-2">
              {availableIcons.map((icon) => {
                const IconComponent = icon.component;
                const isSelected = formData.icon === icon.name;
                
                return (
                  <Card
                    key={icon.name}
                    className={cn(
                      "cursor-pointer transition-all duration-200 border-2",
                      isSelected 
                        ? "border-primary bg-primary/5" 
                        : "border-border hover:border-primary/50"
                    )}
                    onClick={() => setFormData(prev => ({ ...prev, icon: icon.name }))}
                  >
                    <CardContent className="p-3 text-center">
                      <div className={cn(
                        "mx-auto p-2 rounded-full w-fit transition-colors",
                        isSelected 
                          ? "bg-primary text-primary-foreground" 
                          : "bg-muted text-muted-foreground"
                      )}>
                        <IconComponent className="h-4 w-4" />
                      </div>
                      <p className="text-xs mt-1 text-muted-foreground">
                        {icon.label}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="active"
              checked={formData.active}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, active: checked }))}
              disabled={loading}
            />
            <Label htmlFor="active">Categoria ativa</Label>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              {loading ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCategoryModal;
