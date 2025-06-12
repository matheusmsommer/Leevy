
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { File, Plus, Download, Edit } from 'lucide-react';
import { Service } from '@/types/business';

interface ExamCatalogSettingsProps {
  companyId: string;
}

const ExamCatalogSettings: React.FC<ExamCatalogSettingsProps> = ({ companyId }) => {
  const [exams, setExams] = useState<Service[]>([]);

  const handleAddExam = () => {
    console.log('Adicionar novo exame');
    // TODO: Implementar modal para adicionar exame
  };

  const handleImportExams = () => {
    console.log('Importar exames da base Leevy');
    // TODO: Implementar modal de importação com IA
  };

  const handleEditExam = (examId: string) => {
    console.log('Editar exame:', examId);
    // TODO: Implementar modal de edição
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <File className="h-5 w-5" />
          Catálogo de Exames
        </CardTitle>
        <CardDescription>
          Gerencie todos os exames oferecidos pela sua empresa
        </CardDescription>
      </CardHeader>
      <CardContent>
        {exams.length === 0 ? (
          <div className="text-center py-8">
            <File className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">
              Nenhum exame cadastrado ainda
            </p>
            <div className="flex gap-2 justify-center">
              <Button onClick={handleAddExam}>
                <Plus className="h-4 w-4 mr-2" />
                Criar Exame
              </Button>
              <Button variant="outline" onClick={handleImportExams}>
                <Download className="h-4 w-4 mr-2" />
                Importar da Base Leevy
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                {exams.length} exames cadastrados
              </p>
              <div className="flex gap-2">
                <Button onClick={handleAddExam}>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Exame
                </Button>
                <Button variant="outline" onClick={handleImportExams}>
                  <Download className="h-4 w-4 mr-2" />
                  Importar
                </Button>
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Preço</TableHead>
                  <TableHead>Prazo</TableHead>
                  <TableHead>Origem</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {exams.map((exam) => (
                  <TableRow key={exam.id}>
                    <TableCell className="font-medium">{exam.name}</TableCell>
                    <TableCell className="capitalize">{exam.type}</TableCell>
                    <TableCell>R$ {exam.price.toFixed(2)}</TableCell>
                    <TableCell>{exam.delivery_time}</TableCell>
                    <TableCell>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Manual
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditExam(exam.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
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

export default ExamCatalogSettings;
