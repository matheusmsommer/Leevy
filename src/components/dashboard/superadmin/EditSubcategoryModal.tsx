
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Category {
  id: string;
  name: string;
}

interface Subcategory {
  id: string;
  name: string;
  description?: string;
  category_id: string;
  active: boolean;
}

interface EditSubcategoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subcategory: Subcategory | null;
  onSuccess: () => void;
}

const EditSubcategoryModal = ({ open, onOpenChange, subcategory, onSuccess }: EditSubcategoryModalProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category_id: '',
    active: true
  });

  useEffect(() => {
    if (open && subcategory) {
      setFormData({
        name: subcategory.name,
        description: subcategory.description || '',
        category_id: subcategory.category_id,
        active: subcategory.active
      });
      fetchCategories();
    }
  }, [open, subcategory]);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('exam_categories')
        .select('id, name')
        .eq('active', true)
        .order('name', { ascending: true });

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.category_id || !subcategory) {
      toast({
        title: "Campos obrigatórios",
        description: "Nome e categoria são obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('exam_subcategories')
        .update({
          name: formData.name,
          description: formData.description || null,
          category_id: formData.category_id,
          active: formData.active
        })
        .eq('id', subcategory.id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Subcategoria atualizada com sucesso.",
      });

      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error updating subcategory:', error);
      toast({
        title: "Erro ao atualizar subcategoria",
        description: error.message || "Não foi possível atualizar a subcategoria.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!subcategory) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Subcategoria</DialogTitle>
          <DialogDescription>
            Atualize as informações da subcategoria
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="category">Categoria *</Label>
            <Select value={formData.category_id} onValueChange={(value) => setFormData(prev => ({ ...prev, category_id: value }))}>
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
            <Label htmlFor="name">Nome *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Nome da subcategoria"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Descrição opcional da subcategoria"
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="active"
              checked={formData.active}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, active: checked }))}
            />
            <Label htmlFor="active">Ativa</Label>
          </div>

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

export default EditSubcategoryModal;
