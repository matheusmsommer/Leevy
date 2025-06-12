
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Edit, Trash2, TestTube } from 'lucide-react';

interface GlobalExam {
  id: string;
  name: string;
  code: string;
  category: string;
  preparation: string;
  description: string;
}

interface ExamManagementProps {
  globalExams: GlobalExam[];
  onAddExam: () => void;
}

const ExamManagement = ({ globalExams, onAddExam }: ExamManagementProps) => {
  return (
    <Card className="border-border shadow-sm">
      <CardHeader className="pb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <TestTube className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl font-semibold text-foreground">Gestão de Exames Globais</CardTitle>
            <CardDescription className="text-muted-foreground">
              Lista base de exames disponíveis para todos os laboratórios
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar exames por nome ou código..."
              className="pl-10 border-border focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <Button onClick={onAddExam} className="bg-primary hover:bg-primary/90 shadow-sm w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Exame
          </Button>
        </div>

        <div className="border border-border rounded-xl overflow-hidden bg-card">
          <Table>
            <TableHeader>
              <TableRow className="border-border bg-muted/30">
                <TableHead className="text-muted-foreground font-semibold py-4">Nome do Exame</TableHead>
                <TableHead className="text-muted-foreground font-semibold">Código</TableHead>
                <TableHead className="text-muted-foreground font-semibold">Categoria</TableHead>
                <TableHead className="text-muted-foreground font-semibold">Preparo</TableHead>
                <TableHead className="text-muted-foreground font-semibold text-center">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {globalExams.map((exam) => (
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
                  <TableCell className="text-muted-foreground max-w-xs">
                    <div className="truncate" title={exam.preparation}>
                      {exam.preparation}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2 justify-center">
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

        {globalExams.length === 0 && (
          <div className="text-center py-12">
            <TestTube className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Nenhum exame cadastrado ainda</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ExamManagement;
