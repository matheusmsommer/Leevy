
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
      <Card className="border-border shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5 text-primary" />
            Categorias de Exames
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="border-border shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Tag className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Categorias de Exames</CardTitle>
                <CardDescription>
                  Gerencie as categorias disponíveis para classificar os exames
                </CardDescription>
              </div>
            </div>
            <HoverCard>
              <HoverCardTrigger asChild>
                <Button onClick={() => setShowAddModal(true)} className="bg-primary hover:bg-primary/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Categoria
                </Button>
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold">Adicionar Nova Categoria</h4>
                  <p className="text-sm text-muted-foreground">
                    Cria uma nova categoria para classificar os exames do sistema.
                  </p>
                </div>
              </HoverCardContent>
            </HoverCard>
          </div>
        </CardHeader>
        <CardContent>
          {categories.length === 0 ? (
            <div className="text-center py-12">
              <Tag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Nenhuma categoria cadastrada</p>
              <Button onClick={() => setShowAddModal(true)} className="mt-4 bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Primeira Categoria
              </Button>
            </div>
          ) : (
            <div className="border border-border rounded-xl overflow-hidden bg-card">
              <Table>
                <TableHeader>
                  <TableRow className="border-border bg-muted/30">
                    <TableHead className="text-muted-foreground font-semibold">Nome</TableHead>
                    <TableHead className="text-muted-foreground font-semibold">Descrição</TableHead>
                    <TableHead className="text-muted-foreground font-semibold">Status</TableHead>
                    <TableHead className="text-muted-foreground font-semibold text-center">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((category) => (
                    <TableRow key={category.id} className="border-border hover:bg-muted/20 transition-colors">
                      <TableCell className="font-medium text-foreground">{category.name}</TableCell>
                      <TableCell className="text-foreground max-w-xs">
                        <div className="truncate" title={category.description || 'Sem descrição'}>
                          {category.description || 'Sem descrição'}
                        </div>
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
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => handleView(category)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </HoverCardTrigger>
                            <HoverCardContent className="w-64">
                              <div className="space-y-1">
                                <h4 className="text-sm font-semibold">Visualizar Categoria</h4>
                                <p className="text-sm text-muted-foreground">
                                  Ver detalhes completos da categoria.
                                </p>
                              </div>
                            </HoverCardContent>
                          </HoverCard>

                          <HoverCard>
                            <HoverCardTrigger asChild>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => handleEdit(category)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </HoverCardTrigger>
                            <HoverCardContent className="w-64">
                              <div className="space-y-1">
                                <h4 className="text-sm font-semibold">Editar Categoria</h4>
                                <p className="text-sm text-muted-foreground">
                                  Modificar nome, descrição ou status da categoria.
                                </p>
                              </div>
                            </HoverCardContent>
                          </HoverCard>

                          <HoverCard>
                            <HoverCardTrigger asChild>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="border-destructive/20 text-destructive hover:bg-destructive/10"
                                onClick={() => handleDelete(category)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </HoverCardTrigger>
                            <HoverCardContent className="w-64">
                              <div className="space-y-1">
                                <h4 className="text-sm font-semibold text-destructive">Excluir Categoria</h4>
                                <p className="text-sm text-muted-foreground">
                                  Remove a categoria permanentemente. Só é possível se não estiver sendo usada.
                                </p>
                              </div>
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
        </CardContent>
      </Card>

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
    </>
  );
};

export default CategoryManagement;
