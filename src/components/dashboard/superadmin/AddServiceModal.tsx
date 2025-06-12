
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
import ServicePreparationsManager from './ServicePreparationsManager';
import CategorySelector from './CategorySelector';

interface AddServiceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const AddServiceModal = ({ open, onOpenChange, onSuccess }: AddServiceModalProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
  const [createdServiceId, setCreatedServiceId] = useState<string | null>(null);
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
    if (open) {
      fetchCategories();
      setCreatedServiceId(null);
      setSelectedSubcategories([]);
    }
  }, [open]);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('service_categories')
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
        .from('service_subcategories')
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

  const createServiceSubcategories = async (serviceId: string, subcategoryIds: string[]) => {
    try {
      if (subcategoryIds.length > 0) {
        const associations = subcategoryIds.map(subcategoryId => ({
          service_id: serviceId,
          subcategory_id: subcategoryId
        }));

        const { error } = await supabase
          .from('service_subcategory_associations')
          .insert(associations);

        if (error) throw error;
      }

      console.log('Service subcategories created successfully');
    } catch (error: any) {
      console.error('Error creating service subcategories:', error);
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
        .from('services')
        .insert([formData])
        .select()
        .single();

      if (error) throw error;

      // Criar associações de subcategorias
      await createServiceSubcategories(data.id, selectedSubcategories);

      toast({
        title: "Sucesso",
        description: "Serviço criado com sucesso. Agora você pode adicionar preparações.",
      });

      setCreatedServiceId(data.id);
      setFormData({
        name: '',
        code: '',
        category: '',
        category_id: '',
        description: '',
        synonyms: '',
        related_diseases: '',
        preparation: ''
      });
      setSelectedSubcategories([]);
    } catch (error: any) {
      console.error('Error creating service:', error);
      toast({
        title: "Erro ao criar serviço",
        description: error.message || "Não foi possível criar o serviço.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (createdServiceId) {
      onSuccess();
    }
    setCreatedServiceId(null);
    setFormData({
      name: '',
      code: '',
      category: '',
      category_id: '',
      description: '',
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
            {createdServiceId ? 'Configurar Preparações' : 'Adicionar Novo Serviço'}
          </DialogTitle>
          <DialogDescription>
            {createdServiceId 
              ? 'Serviço criado! Agora você pode adicionar preparações específicas.' 
              : 'Preencha as informações do novo serviço'
            }
          </DialogDescription>
        </DialogHeader>

        {!createdServiceId ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nome do Serviço *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Nome do serviço"
                  required
                />
              </div>

              <div>
                <Label htmlFor="code">Código *</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                  placeholder="Código do serviço"
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
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Descrição do serviço"
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

            <Separator />

            <div>
              <Label htmlFor="preparation">Preparação</Label>
              <Textarea
                id="preparation"
                value={formData.preparation}
                onChange={(e) => setFormData(prev => ({ ...prev, preparation: e.target.value }))}
                placeholder="Instruções de preparo para o serviço"
                rows={4}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
                Cancelar
              </Button>
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? 'Criando...' : 'Criar Serviço'}
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div>
              <Label className="text-sm font-medium text-foreground mb-3 block">Preparações Padronizadas</Label>
              <ServicePreparationsManager serviceId={createdServiceId} />
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

export default AddServiceModal;
