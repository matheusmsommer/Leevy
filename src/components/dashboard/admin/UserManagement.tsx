
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Users, Eye } from 'lucide-react';

const UserManagement = () => {
  const users = [
    { id: '1', name: 'Carlos Silva', email: 'carlos@laboratorio.com', role: 'Gerente', active: true, lastAccess: '2024-03-15' },
    { id: '2', name: 'Ana Santos', email: 'ana@laboratorio.com', role: 'Atendente', active: true, lastAccess: '2024-03-14' },
    { id: '3', name: 'Pedro Costa', email: 'pedro@laboratorio.com', role: 'Técnico', active: true, lastAccess: '2024-03-13' },
    { id: '4', name: 'Maria Oliveira', email: 'maria@laboratorio.com', role: 'Atendente', active: false, lastAccess: '2024-03-10' },
  ];

  const getRoleBadge = (role: string) => {
    switch (role.toLowerCase()) {
      case 'gerente':
        return <Badge className="bg-primary/10 text-primary border-primary/20">Gerente</Badge>;
      case 'atendente':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Atendente</Badge>;
      case 'técnico':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Técnico</Badge>;
      default:
        return <Badge variant="outline" className="border-muted text-muted-foreground">{role}</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Usuários</h1>
          <p className="text-muted-foreground mt-2">
            Gerencie a equipe do seu laboratório
          </p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 shadow-sm">
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Usuário
        </Button>
      </div>

      <Card className="border-border shadow-sm">
        <CardHeader className="pb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl font-semibold text-foreground">Equipe do Laboratório</CardTitle>
              <CardDescription className="text-muted-foreground">
                Usuários com acesso ao sistema
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border border-border rounded-xl overflow-hidden bg-card">
            <Table>
              <TableHeader>
                <TableRow className="border-border bg-muted/30">
                  <TableHead className="text-muted-foreground font-semibold py-4">Nome</TableHead>
                  <TableHead className="text-muted-foreground font-semibold">E-mail</TableHead>
                  <TableHead className="text-muted-foreground font-semibold">Cargo</TableHead>
                  <TableHead className="text-muted-foreground font-semibold">Status</TableHead>
                  <TableHead className="text-muted-foreground font-semibold">Último Acesso</TableHead>
                  <TableHead className="text-muted-foreground font-semibold text-center">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id} className="border-border hover:bg-muted/20 transition-colors">
                    <TableCell className="font-semibold text-foreground py-4">{user.name}</TableCell>
                    <TableCell className="text-foreground">{user.email}</TableCell>
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                    <TableCell>
                      {user.active ? (
                        <Badge className="bg-primary/10 text-primary border-primary/20">
                          Ativo
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="border-muted text-muted-foreground">
                          Inativo
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(user.lastAccess).toLocaleDateString('pt-BR')}
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

          {users.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Nenhum usuário cadastrado ainda</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;
