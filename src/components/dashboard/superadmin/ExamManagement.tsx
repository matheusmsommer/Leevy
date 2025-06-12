
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Plus, Edit, Trash2, TestTube, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import AddExamModal from './AddExamModal';
import ViewExamModal from './ViewExamModal';
import EditExamModal from './EditExamModal';
import DeleteExamModal from './DeleteExamModal';

interface GlobalExam {
  id: string;
  name: string;
  code: string;
  category: string;
  preparation?: string;
  description?: string;
  synonyms?: string;
}

interface ExamManagementProps {
  globalExams: GlobalExam[];
  onAddExam: () => void;
}

const ExamManagement = ({ globalExams: initialExams, onAddExam }: ExamManagementProps) => {
  const { toast } = useToast();
  const [exams, setExams] = useState<GlobalExam[]>(initialExams);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedExam, setSelectedExam] = useState<GlobalExam | null>(null);

  useEffect(() => {
    fetchGlobalExams();
  }, []);

  const fetchGlobalExams = async () => {
    try {
      console.log('Fetching global exams...');
      
      const { data, error } = await supabase
        .from('exams')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching exams:', error);
        toast({
          title: "Erro ao carregar exames",
          description: "Não foi possível carregar os exames.",
          variant: "destructive",
        });
        return;
      }

      console.log('Global exams loaded:', data);
      setExams(data || []);
    } catch (error) {
      console.error('Error in fetchGlobalExams:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddExam = () => {
    setShowAddModal(true);
  };

  const handleViewExam = (exam: GlobalExam) => {
    setSelectedExam(exam);
    setShowViewModal(true);
  };

  const handleEditExam = (exam: GlobalExam) => {
    setSelectedExam(exam);
    setShowEditModal(true);
  };

  const handleDeleteExam = (exam: GlobalExam) => {
    setSelectedExam(exam);
    setShowDeleteModal(true);
  };

  const handleExamAdded = () => {
    fetchGlobalExams();
  };

  const handleExamUpdated = () => {
    fetchGlobalExams();
  };

  const handleExamDeleted = () => {
    fetchGlobalExams();
  };

  if (loading) {
    return (
      <Card className="border-border shadow-sm">
        <CardHeader className="pb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <TestTube className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl font-semibold text-foreground">Catálogo Global de Exames</CardTitle>
              <CardDescription className="text-muted-foreground">
                Carregando exames...
              </CardDescription>
            </div>
          </div>
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
        <CardHeader className="pb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <TestTube className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl font-semibold text-foreground">Catálogo Global de Exames</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Exames disponíveis para todas as empresas
                </CardDescription>
              </div>
            </div>
            <HoverCard>
              <HoverCardTrigger asChild>
                <Button onClick={handleAddExam} className="bg-primary hover:bg-primary/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Exame
                </Button>
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold">Adicionar Novo Exame</h4>
                  <p className="text-sm text-muted-foreground">
                    Cadastra um novo exame no catálogo global que ficará disponível para todas as empresas do sistema.
                  </p>
                </div>
              </HoverCardContent>
            </HoverCard>
          </div>
        </CardHeader>
        <CardContent>
          {exams.length === 0 ? (
            <div className="text-center py-12">
              <TestTube className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Nenhum exame cadastrado ainda</p>
              <Button onClick={handleAddExam} className="mt-4 bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Primeiro Exame
              </Button>
            </div>
          ) : (
            <div className="border border-border rounded-xl overflow-hidden bg-card">
              <Table>
                <TableHeader>
                  <TableRow className="border-border bg-muted/30">
                    <TableHead className="text-muted-foreground font-semibold py-4">Nome do Exame</TableHead>
                    <TableHead className="text-muted-foreground font-semibold">Código</TableHead>
                    <TableHead className="text-muted-foreground font-semibold">Categoria</TableHead>
                    <TableHead className="text-muted-foreground font-semibold">Preparação</TableHead>
                    <TableHead className="text-muted-foreground font-semibold text-center">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {exams.map((exam) => (
                    <TableRow key={exam.id} className="border-border hover:bg-muted/20 transition-colors">
                      <TableCell className="font-medium text-foreground py-4">{exam.name}</TableCell>
                      <TableCell className="text-foreground font-mono text-sm bg-muted/20 rounded px-2 py-1 w-fit">
                        {exam.code}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-primary/20 text-primary bg-primary/5">
                          {exam.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-foreground max-w-xs">
                        <div className="truncate" title={exam.preparation || 'Sem preparação especial'}>
                          {exam.preparation || 'Sem preparação especial'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2 justify-center">
                          <HoverCard>
                            <HoverCardTrigger asChild>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="border-border hover:bg-accent"
                                onClick={() => handleViewExam(exam)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </HoverCardTrigger>
                            <HoverCardContent className="w-64">
                              <div className="space-y-1">
                                <h4 className="text-sm font-semibold">Visualizar Exame</h4>
                                <p className="text-sm text-muted-foreground">
                                  Ver todas as informações detalhadas do exame.
                                </p>
                              </div>
                            </HoverCardContent>
                          </HoverCard>

                          <HoverCard>
                            <HoverCardTrigger asChild>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="border-border hover:bg-accent"
                                onClick={() => handleEditExam(exam)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </HoverCardTrigger>
                            <HoverCardContent className="w-64">
                              <div className="space-y-1">
                                <h4 className="text-sm font-semibold">Editar Exame</h4>
                                <p className="text-sm text-muted-foreground">
                                  Modificar as informações do exame como nome, código, categoria e descrição.
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
                                onClick={() => handleDeleteExam(exam)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </HoverCardTrigger>
                            <HoverCardContent className="w-64">
                              <div className="space-y-1">
                                <h4 className="text-sm font-semibold text-destructive">Excluir Exame</h4>
                                <p className="text-sm text-muted-foreground">
                                  Remove permanentemente o exame do sistema. Só é possível se não estiver sendo usado por empresas.
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

      <AddExamModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
        onSuccess={handleExamAdded}
      />

      <ViewExamModal
        open={showViewModal}
        onOpenChange={setShowViewModal}
        exam={selectedExam}
      />

      <EditExamModal
        open={showEditModal}
        onOpenChange={setShowEditModal}
        exam={selectedExam}
        onSuccess={handleExamUpdated}
      />

      <DeleteExamModal
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        exam={selectedExam}
        onExamDeleted={handleExamDeleted}
      />
    </>
  );
};

export default ExamManagement;
