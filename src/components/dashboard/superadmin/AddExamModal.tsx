
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import ExamPreparationsManager from './ExamPreparationsManager';

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
  const [createdExamId, setCreatedExamId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    category: '',
    category_id: '',
    subcategory_id: '',
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

  const handleCategoryChange = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    setFormData(prev => ({
      ...prev,
      category_id: categoryId,
      category: category?.name || '',
      subcategory_id: ''
    }));
    fetchSubcategories(categoryId);
    setSubcategories([]);
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
        subcategory_id: '',
        description: '',
        patient_friendly_description: '',
        synonyms: '',
        related_diseases: '',
        preparation: ''
      });
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
      subcategory_id: '',
      description: '',
      patient_friendly_description: '',
      synonyms: '',
      related_diseases: '',
      preparation: ''
    });
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Categoria *</Label>
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
              </div>

              <div>
                <Label htmlFor="subcategory">Subcategoria</Label>
                <Select value={formData.subcategory_id} onValueChange={(value) => setFormData(prev => ({ ...prev, subcategory_id: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma subcategoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {subcategories.map((subcategory) => (
                      <SelectItem key={subcategory.id} value={subcategory.id}>
                        {subcategory.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

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
              <Label htmlFor="preparation">Preparação Padrão (Texto Livre)</Label>
              <Textarea
                id="preparation"
                value={formData.preparation}
                onChange={(e) => setFormData(prev => ({ ...prev, preparation: e.target.value }))}
                placeholder="Instruções de preparação em texto livre"
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
            <ExamPreparationsManager examId={createdExamId} />
            
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
