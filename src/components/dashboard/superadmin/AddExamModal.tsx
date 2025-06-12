
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface AddExamModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onExamAdded: () => void;
}

const AddExamModal = ({ open, onOpenChange, onExamAdded }: AddExamModalProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    category: '',
    preparation: '',
    description: ''
  });

  const categories = [
    'sangue',
    'urina',
    'fezes',
    'imagem',
    'cardiologia',
    'neurologia',
    'endocrinologia',
    'ginecologia',
    'urologia',
    'dermatologia',
    'oftalmologia',
    'otorrinolaringologia',
    'outros'
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.code || !formData.category) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha nome, código e categoria.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      console.log('Adding new exam:', formData);

      const { data, error } = await supabase
        .from('exams')
        .insert([
          {
            name: formData.name,
            code: formData.code.toUpperCase(),
            category: formData.category,
            preparation: formData.preparation || null,
            description: formData.description || null
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Error adding exam:', error);
        toast({
          title: "Erro ao adicionar exame",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      console.log('Exam added successfully:', data);
      toast({
        title: "Exame adicionado",
        description: "O exame foi adicionado com sucesso ao catálogo global.",
      });

      // Reset form
      setFormData({
        name: '',
        code: '',
        category: '',
        preparation: '',
        description: ''
      });

      onExamAdded();
      onOpenChange(false);
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      toast({
        title: "Erro inesperado",
        description: "Ocorreu um erro ao adicionar o exame.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Exame</DialogTitle>
          <DialogDescription>
            Adicione um novo exame ao catálogo global. Este exame ficará disponível para todas as empresas.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Exame *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Ex: Hemograma Completo"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="code">Código *</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => handleInputChange('code', e.target.value)}
                placeholder="Ex: HEM001"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Categoria *</Label>
            <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="preparation">Preparação</Label>
            <Textarea
              id="preparation"
              value={formData.preparation}
              onChange={(e) => handleInputChange('preparation', e.target.value)}
              placeholder="Ex: Jejum de 8 horas"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Descrição detalhada do exame"
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Adicionando...' : 'Adicionar Exame'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddExamModal;
