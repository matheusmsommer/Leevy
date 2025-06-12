
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import ExamPreparationsManager from './ExamPreparationsManager';
import CategorySelector from './CategorySelector';

interface AddExamModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const AddExamModal = ({ open, onOpenChange, onSuccess }: AddExamModalProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
  const [createdExamId, setCreatedExamId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    category: '',
    category_id: '',
    description: '',
    patient_friendly_description: '',
    synonyms: '',
    related_diseases: '',
    preparation: ''
  });

  useEffect(() => {
    if (open) {
      fetchCategories();
      setCreatedExamId(null);
      setSelectedSubcategories([]);
    }
  }, [open]);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('exam_categories')
        .select('*')
        .eq('active', true)
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error: any) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchSubcategories = async (categoryId: string) => {
    try {
      const { data, error } = await supabase
        .from('exam_subcategories')
        .select('*')
        .eq('category_id', categoryId)
        .eq('active', true)
        .order('name');

      if (error) throw error;
      setSubcategories(data || []);
    } catch (error: any) {
      console.error('Error fetching subcategories:', error);
    }
  };

  const handleCategorySelect = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    setFormData(prev => ({
      ...prev,
      category_id: categoryId,
      category: category?.name || ''
    }));
    setSelectedSubcategories([]);
    fetchSubcategories(categoryId);
    setSubcategories([]);
  };

  const handleSubcategoryToggle = (subcategoryId: string) => {
    setSelectedSubcategories(prev => {
      const newSelection = prev.includes(subcategoryId)
        ? prev.filter(id => id !== subcategoryId)
        : [...prev, subcategoryId];
      
      console.log('Subcategories selection changed to:', newSelection);
      return newSelection;
    });
  };

  const createExamSubcategories = async (examId: string, subcategoryIds: string[]) => {
    try {
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

      console.log('Exam subcategories created successfully');
    } catch (error: any) {
      console.error('Error creating exam subcategories:', error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.code.trim() || !formData.category.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Nome, código e categoria são obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('exams')
        .insert([formData])
        .select()
        .single();

      if (error) throw error;

      // Criar associações de subcategorias
      await createExamSubcategories(data.id, selectedSubcategories);

      toast({
        title: "Sucesso",
        description: "Exame criado com sucesso. Agora você pode adicionar preparações.",
      });

      setCreatedExamId(data.id);
      setFormData({
        name: '',
        code: '',
        category: '',
        category_id: '',
        description: '',
        patient_friendly_description: '',
        synonyms: '',
        related_diseases: '',
        preparation: ''
      });
      setSelectedSubcategories([]);
    } catch (error: any) {
      console.error('Error creating exam:', error);
      toast({
        title: "Erro ao criar exame",
        description: error.message || "Não foi possível criar o exame.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (createdExamId) {
      onSuccess();
    }
    setCreatedExamId(null);
    setFormData({
      name: '',
      code: '',
      category: '',
      category_id: '',
      description: '',
      patient_friendly_description: '',
      synonyms: '',
      related_diseases: '',
      preparation: ''
    });
    setSelectedSubcategories([]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {createdExamId ? 'Configurar Preparações' : 'Adicionar Novo Exame'}
          </DialogTitle>
          <DialogDescription>
            {createdExamId 
              ? 'Exame criado! Agora você pode adicionar preparações específicas.' 
              : 'Preencha as informações do novo exame'
            }
          </DialogDescription>
        </DialogHeader>

        {!createdExamId ? (
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
              <Label>Categoria *</Label>
              <div className="mt-2">
                <CategorySelector
                  categories={categories}
                  selectedCategoryId={formData.category_id}
                  onCategorySelect={handleCategorySelect}
                />
              </div>
              {formData.category_id && (
                <p className="text-xs text-muted-foreground mt-2">
                  Categoria selecionada: {formData.category}
                </p>
              )}
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
              <Label htmlFor="description">Descrição Técnica</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Descrição técnica do exame"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="patient_friendly_description">Descrição Amigável para o Paciente</Label>
              <Textarea
                id="patient_friendly_description"
                value={formData.patient_friendly_description}
                onChange={(e) => setFormData(prev => ({ ...prev, patient_friendly_description: e.target.value }))}
                placeholder="Descrição simplificada para o paciente entender"
                rows={3}
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
              <Label htmlFor="preparation">Observação (Texto Livre)</Label>
              <Textarea
                id="preparation"
                value={formData.preparation}
                onChange={(e) => setFormData(prev => ({ ...prev, preparation: e.target.value }))}
                placeholder="Observações ou instruções específicas em texto livre"
                rows={4}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
                Cancelar
              </Button>
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? 'Criando...' : 'Criar Exame'}
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div>
              <Label className="text-sm font-medium text-foreground mb-3 block">Preparações</Label>
              <ExamPreparationsManager examId={createdExamId} />
            </div>
            
            <div className="flex justify-end pt-4">
              <Button onClick={handleClose}>
                Concluir
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddExamModal;
