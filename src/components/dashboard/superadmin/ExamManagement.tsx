
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';

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
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="text-foreground">Gestão de Exames Globais</CardTitle>
        <CardDescription className="text-muted-foreground">
          Lista base de exames disponíveis para todos os laboratórios
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="relative w-96">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar exames..."
                className="pl-10"
              />
            </div>
            <Button onClick={onAddExam} className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Exame
            </Button>
          </div>

          <div className="border border-border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow className="border-border">
                  <TableHead className="text-muted-foreground">Nome</TableHead>
                  <TableHead className="text-muted-foreground">Código</TableHead>
                  <TableHead className="text-muted-foreground">Categoria</TableHead>
                  <TableHead className="text-muted-foreground">Preparo</TableHead>
                  <TableHead className="text-muted-foreground">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {globalExams.map((exam) => (
                  <TableRow key={exam.id} className="border-border hover:bg-muted/50">
                    <TableCell className="font-medium text-foreground">{exam.name}</TableCell>
                    <TableCell className="text-foreground font-mono">{exam.code}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-border">
                        {exam.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground max-w-xs truncate">{exam.preparation}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="border-border hover:bg-accent">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExamManagement;
