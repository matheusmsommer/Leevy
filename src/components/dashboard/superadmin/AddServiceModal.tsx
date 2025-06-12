
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
import CategorySelector from './CategorySelector';

interface AddServiceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

interface StandardPreparation {
  id: string;
  name: string;
  instructions: string;
}

const AddServiceModal = ({ open, onOpenChange, onSuccess }: AddServiceModalProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
  const [standardPreparations, setStandardPreparations] = useState<StandardPreparation[]>([]);
  const [selectedPreparations, setSelectedPreparations] = useState<string[]>([]);
  const [primaryPreparation, setPrimaryPreparation] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    category: '',
    category_id: '',
    description: '',
    synonyms: '',
    related_diseases: '',
    preparation: '',
    patient_friendly_description: ''
  });

  useEffect(() => {
    if (open) {
      fetchCategories();
      fetchStandardPreparations();
      setSelectedSubcategories([]);
      setSelectedPreparations([]);
      setPrimaryPreparation('');
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

  const fetchStandardPreparations = async () => {
    try {
      const { data, error } = await supabase
        .from('standard_preparations')
        .select('*')
        .eq('active', true)
        .order('name');

      if (error) throw error;
      setStandardPreparations(data || []);
    } catch (error: any) {
      console.error('Error fetching standard preparations:', error);
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

  const handlePreparationToggle = (preparationId: string) => {
    setSelectedPreparations(prev => {
      const newSelection = prev.includes(preparationId)
        ? prev.filter(id => id !== preparationId)
        : [...prev, preparationId];
      
      // Se removeu a preparação primária, limpar
      if (!newSelection.includes(primaryPreparation)) {
        setPrimaryPreparation('');
      }
      
      // Se é a primeira preparação selecionada, torná-la primária
      if (newSelection.length === 1 && !primaryPreparation) {
        setPrimaryPreparation(newSelection[0]);
      }
      
      return newSelection;
    });
  };

  const handleSetPrimary = (preparationId: string) => {
    setPrimaryPreparation(preparationId);
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

  const createServicePreparations = async (serviceId: string, preparationIds: string[], primaryId: string) => {
    try {
      if (preparationIds.length > 0) {
        const associations = preparationIds.map(preparationId => ({
          service_id: serviceId,
          preparation_id: preparationId,
          is_primary: preparationId === primaryId
        }));

        const { error } = await supabase
          .from('service_preparations')
          .insert(associations);

        if (error) throw error;
      }

      console.log('Service preparations created successfully');
    } catch (error: any) {
      console.error('Error creating service preparations:', error);
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
      // Preparar dados para criação
      const createData = {
        name: formData.name.trim(),
        code: formData.code.trim(),
        category: formData.category.trim() || 'Sem categoria',
        category_id: formData.category_id && formData.category_id.trim() !== '' ? formData.category_id.trim() : null,
        description: formData.description && formData.description.trim() !== '' ? formData.description.trim() : null,
        synonyms: formData.synonyms && formData.synonyms.trim() !== '' ? formData.synonyms.trim() : null,
        related_diseases: formData.related_diseases && formData.related_diseases.trim() !== '' ? formData.related_diseases.trim() : null,
        preparation: formData.preparation && formData.preparation.trim() !== '' ? formData.preparation.trim() : null,
        patient_friendly_description: formData.patient_friendly_description && formData.patient_friendly_description.trim() !== '' ? formData.patient_friendly_description.trim() : null
      };

      const { data, error } = await supabase
        .from('services')
        .insert([createData])
        .select()
        .single();

      if (error) throw error;

      // Criar associações de subcategorias
      await createServiceSubcategories(data.id, selectedSubcategories);

      // Criar associações de preparações
      await createServicePreparations(data.id, selectedPreparations, primaryPreparation);

      toast({
        title: "Sucesso",
        description: "Serviço criado com sucesso.",
      });

      handleClose();
      onSuccess();
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
    setFormData({
      name: '',
      code: '',
      category: '',
      category_id: '',
      description: '',
      synonyms: '',
      related_diseases: '',
      preparation: '',
      patient_friendly_description: ''
    });
    setSelectedSubcategories([]);
    setSelectedPreparations([]);
    setPrimaryPreparation('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Serviço</DialogTitle>
          <DialogDescription>
            Preencha as informações do novo serviço
          </DialogDescription>
        </DialogHeader>

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
            <Label>Categoria</Label>
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
            <Label htmlFor="patient_friendly_description">Descrição Amigável</Label>
            <Textarea
              id="patient_friendly_description"
              value={formData.patient_friendly_description}
              onChange={(e) => setFormData(prev => ({ ...prev, patient_friendly_description: e.target.value }))}
              placeholder="Descrição em linguagem simples para o paciente"
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
            <Label className="text-sm font-medium text-foreground mb-3 block">Preparações Padronizadas</Label>
            {standardPreparations.length > 0 ? (
              <div className="space-y-3">
                <div className="max-h-48 overflow-y-auto border rounded-md p-3 space-y-2">
                  {standardPreparations.map((prep) => (
                    <div key={prep.id} className="flex items-start space-x-3 p-2 border rounded">
                      <Checkbox
                        id={`prep-${prep.id}`}
                        checked={selectedPreparations.includes(prep.id)}
                        onCheckedChange={() => handlePreparationToggle(prep.id)}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <Label
                            htmlFor={`prep-${prep.id}`}
                            className="text-sm font-medium cursor-pointer"
                          >
                            {prep.name}
                          </Label>
                          {selectedPreparations.includes(prep.id) && (
                            <div className="flex items-center gap-2">
                              {primaryPreparation === prep.id && (
                                <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                                  Primária
                                </span>
                              )}
                              {primaryPreparation !== prep.id && (
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  className="text-xs"
                                  onClick={() => handleSetPrimary(prep.id)}
                                >
                                  Tornar Primária
                                </Button>
                              )}
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {prep.instructions}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  Selecionadas: {selectedPreparations.length} preparação(ões)
                  {primaryPreparation && ` • Primária: ${standardPreparations.find(p => p.id === primaryPreparation)?.name}`}
                </p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Nenhuma preparação padronizada disponível
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="preparation">Observação</Label>
            <Textarea
              id="preparation"
              value={formData.preparation}
              onChange={(e) => setFormData(prev => ({ ...prev, preparation: e.target.value }))}
              placeholder="Observações adicionais sobre o serviço"
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
      </DialogContent>
    </Dialog>
  );
};

export default AddServiceModal;
