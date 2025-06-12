
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Plus, Edit, Trash2, List, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import AddSubcategoryModal from './AddSubcategoryModal';
import ViewSubcategoryModal from './ViewSubcategoryModal';
import EditSubcategoryModal from './EditSubcategoryModal';
import DeleteSubcategoryModal from './DeleteSubcategoryModal';

interface Subcategory {
  id: string;
  name: string;
  description?: string;
  category_id: string;
  active: boolean;
  created_at: string;
  updated_at: string;
  service_categories?: {
    name: string;
  };
}

const SubcategoryManagement = () => {
  const { toast } = useToast();
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubcategory, setSelectedSubcategory] = useState<Subcategory | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  useEffect(() => {
    fetchSubcategories();
  }, []);

  const fetchSubcategories = async () => {
    try {
      const { data, error } = await supabase
        .from('service_subcategories')
        .select(`
          *,
          service_categories (
            name
          )
        `)
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching subcategories:', error);
        toast({
          title: "Erro ao carregar subcategorias",
          description: "Não foi possível carregar as subcategorias.",
          variant: "destructive",
        });
        return;
      }

      setSubcategories(data || []);
    } catch (error) {
      console.error('Error in fetchSubcategories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleView = (subcategory: Subcategory) => {
    setSelectedSubcategory(subcategory);
    setViewModalOpen(true);
  };

  const handleEdit = (subcategory: Subcategory) => {
    setSelectedSubcategory(subcategory);
    setEditModalOpen(true);
  };

  const handleDelete = (subcategory: Subcategory) => {
    setSelectedSubcategory(subcategory);
    setDeleteModalOpen(true);
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
          <h3 className="text-lg font-semibold">Subcategorias de Serviços</h3>
          <p className="text-sm text-muted-foreground">
            Gerencie as subcategorias para uma classificação mais detalhada
          </p>
        </div>
        <Button className="bg-primary hover:bg-primary/90" onClick={() => setAddModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Subcategoria
        </Button>
      </div>

      {subcategories.length === 0 ? (
        <div className="text-center py-12">
          <List className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Nenhuma subcategoria cadastrada</p>
        </div>
      ) : (
        <div className="border border-border rounded-xl overflow-hidden bg-card">
          <Table>
            <TableHeader>
              <TableRow className="border-border bg-muted/30">
                <TableHead>Nome</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subcategories.map((subcategory) => (
                <TableRow key={subcategory.id} className="border-border hover:bg-muted/20">
                  <TableCell className="font-medium">{subcategory.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {subcategory.service_categories?.name || 'N/A'}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {subcategory.description || 'Sem descrição'}
                  </TableCell>
                  <TableCell>
                    <Badge variant={subcategory.active ? "default" : "secondary"}>
                      {subcategory.active ? 'Ativa' : 'Inativa'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2 justify-center">
                      <HoverCard>
                        <HoverCardTrigger asChild>
                          <Button size="sm" variant="outline" onClick={() => handleView(subcategory)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </HoverCardTrigger>
                        <HoverCardContent>
                          <p className="text-sm">Visualizar subcategoria</p>
                        </HoverCardContent>
                      </HoverCard>

                      <HoverCard>
                        <HoverCardTrigger asChild>
                          <Button size="sm" variant="outline" onClick={() => handleEdit(subcategory)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </HoverCardTrigger>
                        <HoverCardContent>
                          <p className="text-sm">Editar subcategoria</p>
                        </HoverCardContent>
                      </HoverCard>

                      <HoverCard>
                        <HoverCardTrigger asChild>
                          <Button size="sm" variant="outline" className="text-destructive" onClick={() => handleDelete(subcategory)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </HoverCardTrigger>
                        <HoverCardContent>
                          <p className="text-sm">Excluir subcategoria</p>
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

      <AddSubcategoryModal
        open={addModalOpen}
        onOpenChange={setAddModalOpen}
        onSuccess={fetchSubcategories}
      />

      <ViewSubcategoryModal
        open={viewModalOpen}
        onOpenChange={setViewModalOpen}
        subcategory={selectedSubcategory}
      />

      <EditSubcategoryModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        subcategory={selectedSubcategory}
        onSuccess={fetchSubcategories}
      />

      <DeleteSubcategoryModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        subcategory={selectedSubcategory}
        onSuccess={fetchSubcategories}
      />
    </div>
  );
};

export default SubcategoryManagement;
