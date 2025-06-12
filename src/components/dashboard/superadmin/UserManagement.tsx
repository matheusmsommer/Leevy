
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Eye, RotateCcw, Trash2, Users } from 'lucide-react';

interface PlatformUser {
  id: string;
  name: string;
  email: string;
  totalSpent: number;
  lastAccess: string;
  ordersCount: number;
}

interface UserManagementProps {
  platformUsers: PlatformUser[];
}

const UserManagement = ({ platformUsers }: UserManagementProps) => {
  return (
    <Card className="border-border shadow-sm">
      <CardHeader className="pb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl font-semibold text-foreground">Gestão de Usuários</CardTitle>
            <CardDescription className="text-muted-foreground">
              Clientes da plataforma
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
                <TableHead className="text-muted-foreground font-semibold">Total Gasto</TableHead>
                <TableHead className="text-muted-foreground font-semibold">Pedidos</TableHead>
                <TableHead className="text-muted-foreground font-semibold">Último Acesso</TableHead>
                <TableHead className="text-muted-foreground font-semibold text-center">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {platformUsers.map((user) => (
                <TableRow key={user.id} className="border-border hover:bg-muted/20 transition-colors">
                  <TableCell className="font-semibold text-foreground py-4">{user.name}</TableCell>
                  <TableCell className="text-foreground">{user.email}</TableCell>
                  <TableCell className="text-foreground font-semibold">
                    R$ {user.totalSpent.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-foreground font-medium">{user.ordersCount}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(user.lastAccess).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2 justify-center">
                      <Button size="sm" variant="outline" className="border-border hover:bg-accent">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="border-border hover:bg-accent">
                        <RotateCcw className="h-4 w-4" />
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

        {platformUsers.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Nenhum usuário cadastrado ainda</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserManagement;
