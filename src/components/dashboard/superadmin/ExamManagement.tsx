
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, TestTube, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface GlobalExam {
  id: string;
  name: string;
  code: string;
  category: string;
  preparation?: string;
  description?: string;
}

interface ExamManagementProps {
  globalExams: GlobalExam[];
  onAddExam: () => void;
}

const ExamManagement = ({ globalExams: initialExams, onAddExam }: ExamManagementProps) => {
  const { toast } = useToast();
  const [exams, setExams] = useState<GlobalExam[]>(initialExams);
  const [loading, setLoading] = useState(true);

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
          <Button onClick={onAddExam} className="bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Exame
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {exams.length === 0 ? (
          <div className="text-center py-12">
            <TestTube className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Nenhum exame cadastrado ainda</p>
            <Button onClick={onAddExam} className="mt-4 bg-primary hover:bg-primary/90">
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
                        <Button size="sm" variant="outline" className="border-border hover:bg-accent">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="border-border hover:bg-accent">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="border-destructive/20 text-destructive hover:bg-destructive/10">
                          <Trash2 className="h-4 w-4" />
                        </Button>
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
  );
};

export default ExamManagement;
