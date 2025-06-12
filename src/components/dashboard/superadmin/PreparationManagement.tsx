
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Plus, Edit, Trash2, FileText, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import AddPreparationModal from './AddPreparationModal';
import ViewPreparationModal from './ViewPreparationModal';
import EditPreparationModal from './EditPreparationModal';
import DeletePreparationModal from './DeletePreparationModal';

interface Preparation {
  id: string;
  name: string;
  instructions: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

const PreparationManagement = () => {
  const { toast } = useToast();
  const [preparations, setPreparations] = useState<Preparation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPreparation, setSelectedPreparation] = useState<Preparation | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  useEffect(() => {
    fetchPreparations();
  }, []);

  const fetchPreparations = async () => {
    try {
      const { data, error } = await supabase
        .from('standard_preparations')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching preparations:', error);
        toast({
          title: "Erro ao carregar preparações",
          description: "Não foi possível carregar as preparações.",
          variant: "destructive",
        });
        return;
      }

      setPreparations(data || []);
    } catch (error) {
      console.error('Error in fetchPreparations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleView = (preparation: Preparation) => {
    setSelectedPreparation(preparation);
    setViewModalOpen(true);
  };

  const handleEdit = (preparation: Preparation) => {
    setSelectedPreparation(preparation);
    setEditModalOpen(true);
  };

  const handleDelete = (preparation: Preparation) => {
    setSelectedPreparation(preparation);
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
          <h3 className="text-lg font-semibold">Preparações Padronizadas</h3>
          <p className="text-sm text-muted-foreground">
            Gerencie as instruções de preparação para os exames
          </p>
        </div>
        <Button className="bg-primary hover:bg-primary/90" onClick={() => setAddModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Preparação
        </Button>
      </div>

      {preparations.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Nenhuma preparação cadastrada</p>
        </div>
      ) : (
        <div className="border border-border rounded-xl overflow-hidden bg-card">
          <Table>
            <TableHeader>
              <TableRow className="border-border bg-muted/30">
                <TableHead>Nome</TableHead>
                <TableHead>Instruções</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {preparations.map((preparation) => (
                <TableRow key={preparation.id} className="border-border hover:bg-muted/20">
                  <TableCell className="font-medium">{preparation.name}</TableCell>
                  <TableCell className="max-w-md">
                    <div className="truncate" title={preparation.instructions}>
                      {preparation.instructions}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={preparation.active ? "default" : "secondary"}>
                      {preparation.active ? 'Ativa' : 'Inativa'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2 justify-center">
                      <HoverCard>
                        <HoverCardTrigger asChild>
                          <Button size="sm" variant="outline" onClick={() => handleView(preparation)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </HoverCardTrigger>
                        <HoverCardContent>
                          <p className="text-sm">Visualizar preparação</p>
                        </HoverCardContent>
                      </HoverCard>

                      <HoverCard>
                        <HoverCardTrigger asChild>
                          <Button size="sm" variant="outline" onClick={() => handleEdit(preparation)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </HoverCardTrigger>
                        <HoverCardContent>
                          <p className="text-sm">Editar preparação</p>
                        </HoverCardContent>
                      </HoverCard>

                      <HoverCard>
                        <HoverCardTrigger asChild>
                          <Button size="sm" variant="outline" className="text-destructive" onClick={() => handleDelete(preparation)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </HoverCardTrigger>
                        <HoverCardContent>
                          <p className="text-sm">Excluir preparação</p>
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

      <AddPreparationModal
        open={addModalOpen}
        onOpenChange={setAddModalOpen}
        onSuccess={fetchPreparations}
      />

      <ViewPreparationModal
        open={viewModalOpen}
        onOpenChange={setViewModalOpen}
        preparation={selectedPreparation}
      />

      <EditPreparationModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        preparation={selectedPreparation}
        onSuccess={fetchPreparations}
      />

      <DeletePreparationModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        preparation={selectedPreparation}
        onSuccess={fetchPreparations}
      />
    </div>
  );
};

export default PreparationManagement;
