
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

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

interface AddExamModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onExamAdded: () => void;
}

const AddExamModal = ({ open, onOpenChange, onExamAdded }: AddExamModalProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [synonymInput, setSynonymInput] = useState('');
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
    synonyms: [] as string[],
    description: ''
  });

  useEffect(() => {
    if (open) {
      fetchCategories();
      fetchSubcategories();
      fetchPreparations();
    }
  }, [open]);

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

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddSynonym = () => {
    if (synonymInput.trim() && !formData.synonyms.includes(synonymInput.trim())) {
      setFormData(prev => ({
        ...prev,
        synonyms: [...prev.synonyms, synonymInput.trim()]
      }));
      setSynonymInput('');
    }
  };

  const handleRemoveSynonym = (synonymToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      synonyms: prev.synonyms.filter(synonym => synonym !== synonymToRemove)
    }));
  };

  const handleSynonymKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSynonym();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.code || !formData.category_id) {
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

      // Get the selected category name for the legacy category field
      const selectedCategory = categories.find(cat => cat.id === formData.category_id);
      
      // Get preparation instructions if a preparation is selected
      const selectedPreparation = preparations.find(prep => prep.id === formData.preparation_id);

      const { data, error } = await supabase
        .from('exams')
        .insert([
          {
            name: formData.name,
            code: formData.code.toUpperCase(),
            category: selectedCategory?.name || '', // Legacy field
            category_id: formData.category_id,
            subcategory_id: formData.subcategory_id || null,
            preparation_id: formData.preparation_id || null,
            preparation: selectedPreparation?.instructions || null, // Legacy field
            synonyms: formData.synonyms.length > 0 ? formData.synonyms.join(',') : null,
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
        category_id: '',
        subcategory_id: '',
        preparation_id: '',
        synonyms: [],
        description: ''
      });
      setSynonymInput('');

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
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
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
                disabled={isLoading}
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
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Categoria *</Label>
            <Select 
              value={formData.category_id} 
              onValueChange={(value) => handleInputChange('category_id', value)}
              disabled={isLoading}
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
              <Label htmlFor="subcategory">Subcategoria</Label>
              <Select 
                value={formData.subcategory_id} 
                onValueChange={(value) => handleInputChange('subcategory_id', value)}
                disabled={isLoading}
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
            <Label htmlFor="preparation">Preparação Padrão</Label>
            <Select 
              value={formData.preparation_id} 
              onValueChange={(value) => handleInputChange('preparation_id', value)}
              disabled={isLoading}
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
            <Label htmlFor="synonyms">Sinônimos / Nomes Alternativos</Label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  id="synonyms"
                  value={synonymInput}
                  onChange={(e) => setSynonymInput(e.target.value)}
                  onKeyPress={handleSynonymKeyPress}
                  placeholder="Ex: CBC, Hemograma simples"
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddSynonym}
                  disabled={!synonymInput.trim() || isLoading}
                >
                  Adicionar
                </Button>
              </div>
              {formData.synonyms.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.synonyms.map((synonym, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {synonym}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => handleRemoveSynonym(synonym)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                Adicione nomes alternativos para facilitar a busca (ex: CBC para Hemograma Completo)
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição do Exame</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Descrição detalhada do que o exame avalia"
              rows={3}
              disabled={isLoading}
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
