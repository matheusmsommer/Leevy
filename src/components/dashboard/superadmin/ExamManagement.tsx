
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

interface ExamPreparation {
  id: string;
  is_primary: boolean;
  preparation: {
    id: string;
    name: string;
    instructions: string;
  };
}

interface GlobalExam {
  id: string;
  name: string;
  code: string;
  category: string;
  preparation?: string;
  description?: string;
  synonyms?: string;
  exam_preparations?: ExamPreparation[];
  subcategory_names?: string[];
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
      console.log('Fetching global exams with preparations and subcategories...');
      
      // Buscar exames com suas preparações associadas
      const { data: examsData, error: examsError } = await supabase
        .from('exams')
        .select(`
          *,
          exam_preparations (
            id,
            is_primary,
            preparation:standard_preparations (
              id,
              name,
              instructions
            )
          )
        `)
        .order('name', { ascending: true });

      if (examsError) {
        console.error('Error fetching exams:', examsError);
        toast({
          title: "Erro ao carregar exames",
          description: "Não foi possível carregar os exames.",
          variant: "destructive",
        });
        return;
      }

      // Buscar subcategorias para cada exame
      const examsWithSubcategories = await Promise.all(
        (examsData || []).map(async (exam) => {
          const { data: subcategoryData } = await supabase
            .from('exam_subcategory_associations')
            .select(`
              exam_subcategories(name)
            `)
            .eq('exam_id', exam.id);

          const subcategory_names = subcategoryData
            ?.map(item => (item as any).exam_subcategories?.name)
            .filter(name => name) || [];

          return {
            ...exam,
            subcategory_names
          };
        })
      );

      console.log('Global exams loaded with preparations and subcategories:', examsWithSubcategories);
      setExams(examsWithSubcategories);
    } catch (error) {
      console.error('Error in fetchGlobalExams:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPreparationDisplay = (exam: GlobalExam) => {
    // Verificar se há preparações no novo formato (exam_preparations)
    if (exam.exam_preparations && exam.exam_preparations.length > 0) {
      const primaryPreparation = exam.exam_preparations.find(ep => ep.is_primary);
      if (primaryPreparation) {
        return primaryPreparation.preparation.name;
      }
      // Se não há preparação primária, pegar a primeira
      return exam.exam_preparations[0].preparation.name;
    }
    
    // Fallback para o formato antigo (preparation em texto livre)
    if (exam.preparation && exam.preparation.trim()) {
      return exam.preparation;
    }
    
    return 'Sem preparação especial';
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
                    <TableHead className="text-muted-foreground font-semibold">Subcategorias</TableHead>
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
                      <TableCell>
                        {exam.subcategory_names && exam.subcategory_names.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {exam.subcategory_names.slice(0, 2).map((name, index) => (
                              <Badge key={index} variant="outline" className="border-secondary/20 text-secondary bg-secondary/5 text-xs">
                                {name}
                              </Badge>
                            ))}
                            {exam.subcategory_names.length > 2 && (
                              <Badge variant="outline" className="border-muted text-muted-foreground text-xs">
                                +{exam.subcategory_names.length - 2}
                              </Badge>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">Nenhuma</span>
                        )}
                      </TableCell>
                      <TableCell className="text-foreground max-w-xs">
                        <div className="truncate" title={getPreparationDisplay(exam)}>
                          {getPreparationDisplay(exam)}
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
