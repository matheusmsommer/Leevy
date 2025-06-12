
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import ExamPreparationsManager from './ExamPreparationsManager';

interface EditExamModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  exam: any;
}

const EditExamModal = ({ open, onOpenChange, onSuccess, exam }: EditExamModalProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
  const [isInitializing, setIsInitializing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    category: '',
    category_id: '',
    description: '',
    synonyms: '',
    related_diseases: '',
    preparation: ''
  });

  useEffect(() => {
    if (exam && open) {
      setIsInitializing(true);
      console.log('Loading exam data:', exam);
      
      const examData = {
        name: exam.name || '',
        code: exam.code || '',
        category: exam.category || '',
        category_id: exam.category_id || '',
        description: exam.description || '',
        synonyms: exam.synonyms || '',
        related_diseases: exam.related_diseases || '',
        preparation: exam.preparation || ''
      };
      
      console.log('Setting form data:', examData);
      setFormData(examData);
      
      // Carregar categorias e depois subcategorias
      fetchCategories().then(() => {
        console.log('Categories loaded, now checking for subcategories...');
        if (exam.category_id && exam.category_id.trim() !== '') {
          console.log('Fetching subcategories for category_id:', exam.category_id);
          fetchSubcategories(exam.category_id).then(() => {
            // Carregar subcategorias associadas ao exame
            fetchExamSubcategories(exam.id).then(() => {
              setIsInitializing(false);
            });
          });
        } else {
          console.log('No category_id found, clearing subcategories');
          setSubcategories([]);
          setSelectedSubcategories([]);
          setIsInitializing(false);
        }
      });
    }
  }, [exam, open]);

  const fetchCategories = async () => {
    try {
      console.log('Fetching categories...');
      const { data, error } = await supabase
        .from('exam_categories')
        .select('*')
        .eq('active', true)
        .order('name');

      if (error) throw error;
      console.log('Categories loaded:', data);
      setCategories(data || []);
      return data;
    } catch (error: any) {
      console.error('Error fetching categories:', error);
      return [];
    }
  };

  const fetchSubcategories = async (categoryId: string) => {
    if (!categoryId || categoryId.trim() === '') {
      console.log('Category ID is empty, clearing subcategories');
      setSubcategories([]);
      return;
    }

    try {
      console.log('Fetching subcategories for category:', categoryId);
      const { data, error } = await supabase
        .from('exam_subcategories')
        .select('*')
        .eq('category_id', categoryId)
        .eq('active', true)
        .order('name');

      if (error) throw error;
      console.log('Subcategories loaded:', data);
      setSubcategories(data || []);
    } catch (error: any) {
      console.error('Error fetching subcategories:', error);
      setSubcategories([]);
    }
  };

  const fetchExamSubcategories = async (examId: string) => {
    try {
      console.log('Fetching exam subcategories for exam:', examId);
      const { data, error } = await supabase
        .from('exam_subcategory_associations')
        .select('subcategory_id')
        .eq('exam_id', examId);

      if (error) throw error;
      
      const subcategoryIds = data?.map(item => item.subcategory_id) || [];
      console.log('Current exam subcategories:', subcategoryIds);
      setSelectedSubcategories(subcategoryIds);
    } catch (error: any) {
      console.error('Error fetching exam subcategories:', error);
      setSelectedSubcategories([]);
    }
  };

  const handleCategoryChange = (categoryId: string) => {
    if (isInitializing) {
      console.log('Skipping category change during initialization');
      return;
    }

    const category = categories.find(c => c.id === categoryId);
    console.log('Category changed to:', categoryId, category);
    
    setFormData(prev => ({
      ...prev,
      category_id: categoryId,
      category: category?.name || ''
    }));
    
    // Limpar subcategorias selecionadas quando categoria muda
    setSelectedSubcategories([]);
    
    // Buscar subcategorias para a nova categoria
    if (categoryId && categoryId.trim() !== '') {
      fetchSubcategories(categoryId);
    } else {
      setSubcategories([]);
    }
  };

  const handleSubcategoryToggle = (subcategoryId: string) => {
    if (isInitializing) {
      console.log('Skipping subcategory change during initialization');
      return;
    }

    setSelectedSubcategories(prev => {
      const newSelection = prev.includes(subcategoryId)
        ? prev.filter(id => id !== subcategoryId)
        : [...prev, subcategoryId];
      
      console.log('Subcategories selection changed to:', newSelection);
      return newSelection;
    });
  };

  const updateExamSubcategories = async (examId: string, subcategoryIds: string[]) => {
    try {
      // Remover associações existentes
      await supabase
        .from('exam_subcategory_associations')
        .delete()
        .eq('exam_id', examId);

      // Adicionar novas associações
      if (subcategoryIds.length > 0) {
        const associations = subcategoryIds.map(subcategoryId => ({
          exam_id: examId,
          subcategory_id: subcategoryId
        }));

        const { error } = await supabase
          .from('exam_subcategory_associations')
          .insert(associations);

        if (error) throw error;
      }

      console.log('Exam subcategories updated successfully');
    } catch (error: any) {
      console.error('Error updating exam subcategories:', error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.code.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Nome e código são obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Preparar dados para atualização
      const updateData = {
        name: formData.name.trim(),
        code: formData.code.trim(),
        category: formData.category.trim() || 'Sem categoria',
        category_id: formData.category_id && formData.category_id.trim() !== '' ? formData.category_id.trim() : null,
        description: formData.description && formData.description.trim() !== '' ? formData.description.trim() : null,
        synonyms: formData.synonyms && formData.synonyms.trim() !== '' ? formData.synonyms.trim() : null,
        related_diseases: formData.related_diseases && formData.related_diseases.trim() !== '' ? formData.related_diseases.trim() : null,
        preparation: formData.preparation && formData.preparation.trim() !== '' ? formData.preparation.trim() : null
      };

      console.log('Form data before update:', formData);
      console.log('Update data being sent:', updateData);
      console.log('Selected subcategories:', selectedSubcategories);

      // Atualizar dados do exame
      const { data: updatedData, error } = await supabase
        .from('exams')
        .update(updateData)
        .eq('id', exam.id)
        .select()
        .single();

      if (error) {
        console.error('Update error:', error);
        throw error;
      }

      // Atualizar associações de subcategorias
      await updateExamSubcategories(exam.id, selectedSubcategories);

      console.log('Update successful, returned data:', updatedData);

      toast({
        title: "Sucesso",
        description: "Exame atualizado com sucesso.",
      });

      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error updating exam:', error);
      toast({
        title: "Erro ao atualizar exame",
        description: error.message || "Não foi possível atualizar o exame.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!exam) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Exame</DialogTitle>
          <DialogDescription>
            Modifique as informações do exame
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nome do Exame *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Nome do exame"
                required
              />
            </div>

            <div>
              <Label htmlFor="code">Código *</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                placeholder="Código do exame"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="category">Categoria</Label>
            <Select value={formData.category_id} onValueChange={handleCategoryChange}>
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
            <p className="text-xs text-muted-foreground mt-1">
              Atual: {formData.category_id || 'Nenhuma'}
            </p>
          </div>

          {formData.category_id && subcategories.length > 0 && (
            <div>
              <Label>Subcategorias</Label>
              <div className="mt-2 space-y-2 max-h-40 overflow-y-auto border rounded-md p-3">
                {subcategories.map((subcategory) => (
                  <div key={subcategory.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`subcategory-${subcategory.id}`}
                      checked={selectedSubcategories.includes(subcategory.id)}
                      onCheckedChange={() => handleSubcategoryToggle(subcategory.id)}
                    />
                    <Label
                      htmlFor={`subcategory-${subcategory.id}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {subcategory.name}
                    </Label>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Selecionadas: {selectedSubcategories.length} de {subcategories.length}
              </p>
            </div>
          )}

          <div>
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Descrição do exame"
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="synonyms">Sinônimos</Label>
            <Input
              id="synonyms"
              value={formData.synonyms}
              onChange={(e) => setFormData(prev => ({ ...prev, synonyms: e.target.value }))}
              placeholder="Sinônimos separados por vírgula"
            />
          </div>

          <div>
            <Label htmlFor="related_diseases">Doenças Relacionadas</Label>
            <Input
              id="related_diseases"
              value={formData.related_diseases}
              onChange={(e) => setFormData(prev => ({ ...prev, related_diseases: e.target.value }))}
              placeholder="Doenças relacionadas separadas por vírgula"
            />
          </div>

          <div>
            <Label htmlFor="preparation">Preparação Padrão (Texto Livre)</Label>
            <Textarea
              id="preparation"
              value={formData.preparation}
              onChange={(e) => setFormData(prev => ({ ...prev, preparation: e.target.value }))}
              placeholder="Instruções de preparação em texto livre"
              rows={4}
            />
          </div>

          <Separator />

          <ExamPreparationsManager examId={exam.id} />

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditExamModal;
