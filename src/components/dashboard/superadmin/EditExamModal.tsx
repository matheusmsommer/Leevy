
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface GlobalExam {
  id: string;
  name: string;
  code: string;
  category: string;
  preparation?: string;
  description?: string;
  synonyms?: string;
}

interface EditExamModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  exam: GlobalExam | null;
  onExamUpdated: () => void;
}

const categories = [
  'Bioquímica',
  'Hematologia',
  'Microbiologia',
  'Imunologia',
  'Parasitologia',
  'Urinálise',
  'Endocrinologia',
  'Cardiologia',
  'Genética',
  'Toxicologia'
];

const EditExamModal = ({ open, onOpenChange, exam, onExamUpdated }: EditExamModalProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    category: '',
    description: '',
    preparation: '',
    synonyms: ''
  });

  useEffect(() => {
    if (exam) {
      setFormData({
        name: exam.name || '',
        code: exam.code || '',
        category: exam.category || '',
        description: exam.description || '',
        preparation: exam.preparation || '',
        synonyms: exam.synonyms || ''
      });
    }
  }, [exam]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!exam) return;

    if (!formData.name.trim() || !formData.code.trim() || !formData.category) {
      toast({
        title: "Erro de validação",
        description: "Nome, código e categoria são obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('exams')
        .update({
          name: formData.name.trim(),
          code: formData.code.trim().toUpperCase(),
          category: formData.category,
          description: formData.description.trim() || null,
          preparation: formData.preparation.trim() || null,
          synonyms: formData.synonyms.trim() || null
        })
        .eq('id', exam.id);

      if (error) {
        console.error('Error updating exam:', error);
        toast({
          title: "Erro ao atualizar exame",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Sucesso",
        description: "Exame atualizado com sucesso!",
      });

      onExamUpdated();
      onOpenChange(false);
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      toast({
        title: "Erro inesperado",
        description: "Ocorreu um erro ao atualizar o exame.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!exam) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-foreground">
            Editar Exame
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Atualize as informações do exame
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Nome do Exame *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Ex: Hemograma Completo"
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-code">Código *</Label>
              <Input
                id="edit-code"
                value={formData.code}
                onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                placeholder="Ex: HMG"
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-category">Categoria *</Label>
            <Select 
              value={formData.category} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-description">Descrição</Label>
            <Textarea
              id="edit-description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Descrição detalhada do exame..."
              rows={3}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-preparation">Preparação</Label>
            <Textarea
              id="edit-preparation"
              value={formData.preparation}
              onChange={(e) => setFormData(prev => ({ ...prev, preparation: e.target.value }))}
              placeholder="Instruções de preparação para o exame..."
              rows={3}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-synonyms">Sinônimos</Label>
            <Textarea
              id="edit-synonyms"
              value={formData.synonyms}
              onChange={(e) => setFormData(prev => ({ ...prev, synonyms: e.target.value }))}
              placeholder="Nomes alternativos ou sinônimos do exame..."
              rows={2}
              disabled={loading}
            />
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
              {loading ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditExamModal;
