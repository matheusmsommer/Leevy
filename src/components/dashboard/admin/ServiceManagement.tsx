
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, TestTube, Eye } from 'lucide-react';

const ServiceManagement = () => {
  const services = [
    { id: '1', name: 'Hemograma Completo', code: 'HEM001', category: 'Sangue', price: 45.00, active: true },
    { id: '2', name: 'Glicemia de Jejum', code: 'GLI001', category: 'Sangue', price: 25.00, active: true },
    { id: '3', name: 'Ultrassom Abdome Total', code: 'USG001', category: 'Imagem', price: 120.00, active: true },
    { id: '4', name: 'Colesterol Total', code: 'COL001', category: 'Sangue', price: 30.00, active: false },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Serviços</h1>
          <p className="text-muted-foreground mt-2">
            Gerencie os exames oferecidos pelo seu laboratório
          </p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 shadow-sm">
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Serviço
        </Button>
      </div>

      <Card className="border-border shadow-sm">
        <CardHeader className="pb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <TestTube className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl font-semibold text-foreground">Catálogo de Serviços</CardTitle>
              <CardDescription className="text-muted-foreground">
                Exames disponíveis para venda
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border border-border rounded-xl overflow-hidden bg-card">
            <Table>
              <TableHeader>
                <TableRow className="border-border bg-muted/30">
                  <TableHead className="text-muted-foreground font-semibold py-4">Nome do Exame</TableHead>
                  <TableHead className="text-muted-foreground font-semibold">Código</TableHead>
                  <TableHead className="text-muted-foreground font-semibold">Categoria</TableHead>
                  <TableHead className="text-muted-foreground font-semibold">Preço</TableHead>
                  <TableHead className="text-muted-foreground font-semibold">Status</TableHead>
                  <TableHead className="text-muted-foreground font-semibold text-center">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {services.map((service) => (
                  <TableRow key={service.id} className="border-border hover:bg-muted/20 transition-colors">
                    <TableCell className="font-medium text-foreground py-4">{service.name}</TableCell>
                    <TableCell className="text-foreground font-mono text-sm bg-muted/20 rounded px-2 py-1 w-fit">
                      {service.code}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-primary/20 text-primary bg-primary/5">
                        {service.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-foreground font-semibold">
                      R$ {service.price.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      {service.active ? (
                        <Badge className="bg-primary/10 text-primary border-primary/20">
                          Ativo
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="border-muted text-muted-foreground">
                          Inativo
                        </Badge>
                      )}
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

          {services.length === 0 && (
            <div className="text-center py-12">
              <TestTube className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Nenhum serviço cadastrado ainda</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ServiceManagement;
