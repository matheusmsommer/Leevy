
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Plus, Edit, Trash2, Tag, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import AddCategoryModal from './AddCategoryModal';
import ViewCategoryModal from './ViewCategoryModal';
import EditCategoryModal from './EditCategoryModal';
import DeleteCategoryModal from './DeleteCategoryModal';

interface Category {
  id: string;
  name: string;
  description?: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

const CategoryManagement = () => {
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('exam_categories')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching categories:', error);
        toast({
          title: "Erro ao carregar categorias",
          description: "Não foi possível carregar as categorias.",
          variant: "destructive",
        });
        return;
      }

      setCategories(data || []);
    } catch (error) {
      console.error('Error in fetchCategories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleView = (category: Category) => {
    setSelectedCategory(category);
    setShowViewModal(true);
  };

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setShowEditModal(true);
  };

  const handleDelete = (category: Category) => {
    setSelectedCategory(category);
    setShowDeleteModal(true);
  };

  const handleCategoryAdded = () => {
    fetchCategories();
  };

  const handleCategoryUpdated = () => {
    fetchCategories();
  };

  const handleCategoryDeleted = () => {
    fetchCategories();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Categorias de Exames</h3>
          <p className="text-sm text-muted-foreground">
            Gerencie as categorias disponíveis para classificar os exames
          </p>
        </div>
        <Button className="bg-primary hover:bg-primary/90" onClick={() => setShowAddModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Categoria
        </Button>
      </div>

      {categories.length === 0 ? (
        <div className="text-center py-12">
          <Tag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Nenhuma categoria cadastrada</p>
        </div>
      ) : (
        <div className="border border-border rounded-xl overflow-hidden bg-card">
          <Table>
            <TableHeader>
              <TableRow className="border-border bg-muted/30">
                <TableHead>Nome</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id} className="border-border hover:bg-muted/20">
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell className="max-w-xs truncate">
                    {category.description || 'Sem descrição'}
                  </TableCell>
                  <TableCell>
                    <Badge variant={category.active ? "default" : "secondary"}>
                      {category.active ? 'Ativa' : 'Inativa'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2 justify-center">
                      <HoverCard>
                        <HoverCardTrigger asChild>
                          <Button size="sm" variant="outline" onClick={() => handleView(category)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </HoverCardTrigger>
                        <HoverCardContent>
                          <p className="text-sm">Visualizar categoria</p>
                        </HoverCardContent>
                      </HoverCard>

                      <HoverCard>
                        <HoverCardTrigger asChild>
                          <Button size="sm" variant="outline" onClick={() => handleEdit(category)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </HoverCardTrigger>
                        <HoverCardContent>
                          <p className="text-sm">Editar categoria</p>
                        </HoverCardContent>
                      </HoverCard>

                      <HoverCard>
                        <HoverCardTrigger asChild>
                          <Button size="sm" variant="outline" className="text-destructive" onClick={() => handleDelete(category)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </HoverCardTrigger>
                        <HoverCardContent>
                          <p className="text-sm">Excluir categoria</p>
                        </HoverCardContent>
                      </HoverCard>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <AddCategoryModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
        onCategoryAdded={handleCategoryAdded}
      />

      <ViewCategoryModal
        open={showViewModal}
        onOpenChange={setShowViewModal}
        category={selectedCategory}
      />

      <EditCategoryModal
        open={showEditModal}
        onOpenChange={setShowEditModal}
        category={selectedCategory}
        onCategoryUpdated={handleCategoryUpdated}
      />

      <DeleteCategoryModal
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        category={selectedCategory}
        onCategoryDeleted={handleCategoryDeleted}
      />
    </div>
  );
};

export default CategoryManagement;
