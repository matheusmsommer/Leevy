
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Plus, Edit, Trash2, List, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Subcategory {
  id: string;
  name: string;
  description?: string;
  category_id: string;
  active: boolean;
  exam_categories?: {
    name: string;
  };
}

const SubcategoryManagement = () => {
  const { toast } = useToast();
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubcategories();
  }, []);

  const fetchSubcategories = async () => {
    try {
      const { data, error } = await supabase
        .from('exam_subcategories')
        .select(`
          *,
          exam_categories (
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
          <h3 className="text-lg font-semibold">Subcategorias de Exames</h3>
          <p className="text-sm text-muted-foreground">
            Gerencie as subcategorias para uma classificação mais detalhada
          </p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
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
                      {subcategory.exam_categories?.name || 'N/A'}
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
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </HoverCardTrigger>
                        <HoverCardContent>
                          <p className="text-sm">Visualizar subcategoria</p>
                        </HoverCardContent>
                      </HoverCard>

                      <HoverCard>
                        <HoverCardTrigger asChild>
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </HoverCardTrigger>
                        <HoverCardContent>
                          <p className="text-sm">Editar subcategoria</p>
                        </HoverCardContent>
                      </HoverCard>

                      <HoverCard>
                        <HoverCardTrigger asChild>
                          <Button size="sm" variant="outline" className="text-destructive">
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
    </div>
  );
};

export default SubcategoryManagement;
