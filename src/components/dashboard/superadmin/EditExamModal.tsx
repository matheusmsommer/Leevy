
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
  category_id?: string;
  subcategory_id?: string;
  preparation_id?: string;
  preparation?: string;
  description?: string;
  synonyms?: string;
}

interface Category {
  id: string;
  name: string;
}

interface Subcategory {
  id: string;
  name: string;
  category_id: string;
}

interface Preparation {
  id: string;
  name: string;
  instructions: string;
}

interface EditExamModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  exam: GlobalExam | null;
  onExamUpdated: () => void;
}

const EditExamModal = ({ open, onOpenChange, exam, onExamUpdated }: EditExamModalProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [preparations, setPreparations] = useState<Preparation[]>([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState<Subcategory[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    category_id: '',
    subcategory_id: '',
    preparation_id: '',
    description: '',
    synonyms: ''
  });

  useEffect(() => {
    if (open) {
      fetchCategories();
      fetchSubcategories();
      fetchPreparations();
    }
  }, [open]);

  useEffect(() => {
    if (exam) {
      setFormData({
        name: exam.name || '',
        code: exam.code || '',
        category_id: exam.category_id || '',
        subcategory_id: exam.subcategory_id || '',
        preparation_id: exam.preparation_id || '',
        description: exam.description || '',
        synonyms: exam.synonyms || ''
      });
    }
  }, [exam]);

  useEffect(() => {
    if (formData.category_id) {
      const filtered = subcategories.filter(sub => sub.category_id === formData.category_id);
      setFilteredSubcategories(filtered);
      // Reset subcategory if it doesn't belong to the selected category
      if (formData.subcategory_id && !filtered.find(sub => sub.id === formData.subcategory_id)) {
        setFormData(prev => ({ ...prev, subcategory_id: '' }));
      }
    } else {
      setFilteredSubcategories([]);
    }
  }, [formData.category_id, subcategories]);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('exam_categories')
        .select('id, name')
        .eq('active', true)
        .order('name');

      if (error) {
        console.error('Error fetching categories:', error);
        return;
      }

      setCategories(data || []);
    } catch (error) {
      console.error('Error in fetchCategories:', error);
    }
  };

  const fetchSubcategories = async () => {
    try {
      const { data, error } = await supabase
        .from('exam_subcategories')
        .select('id, name, category_id')
        .eq('active', true)
        .order('name');

      if (error) {
        console.error('Error fetching subcategories:', error);
        return;
      }

      setSubcategories(data || []);
    } catch (error) {
      console.error('Error in fetchSubcategories:', error);
    }
  };

  const fetchPreparations = async () => {
    try {
      const { data, error } = await supabase
        .from('standard_preparations')
        .select('id, name, instructions')
        .eq('active', true)
        .order('name');

      if (error) {
        console.error('Error fetching preparations:', error);
        return;
      }

      setPreparations(data || []);
    } catch (error) {
      console.error('Error in fetchPreparations:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!exam) return;

    if (!formData.name.trim() || !formData.code.trim() || !formData.category_id) {
      toast({
        title: "Erro de validação",
        description: "Nome, código e categoria são obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Get the selected category name for the legacy category field
      const selectedCategory = categories.find(cat => cat.id === formData.category_id);
      
      // Get preparation instructions if a preparation is selected
      const selectedPreparation = preparations.find(prep => prep.id === formData.preparation_id);

      const { error } = await supabase
        .from('exams')
        .update({
          name: formData.name.trim(),
          code: formData.code.trim().toUpperCase(),
          category: selectedCategory?.name || '', // Legacy field
          category_id: formData.category_id,
          subcategory_id: formData.subcategory_id || null,
          preparation_id: formData.preparation_id || null,
          preparation: selectedPreparation?.instructions || null, // Legacy field
          description: formData.description.trim() || null,
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
              value={formData.category_id} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, category_id: value }))}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {formData.category_id && filteredSubcategories.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="edit-subcategory">Subcategoria</Label>
              <Select 
                value={formData.subcategory_id} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, subcategory_id: value }))}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma subcategoria (opcional)" />
                </SelectTrigger>
                <SelectContent>
                  {filteredSubcategories.map((subcategory) => (
                    <SelectItem key={subcategory.id} value={subcategory.id}>
                      {subcategory.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="edit-preparation">Preparação Padrão</Label>
            <Select 
              value={formData.preparation_id} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, preparation_id: value }))}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma preparação (opcional)" />
              </SelectTrigger>
              <SelectContent>
                {preparations.map((preparation) => (
                  <SelectItem key={preparation.id} value={preparation.id}>
                    {preparation.name}
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
