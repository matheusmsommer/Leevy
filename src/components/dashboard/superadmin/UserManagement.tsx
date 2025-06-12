
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Eye, RotateCcw, Trash2 } from 'lucide-react';

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
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="text-foreground">Gestão de Usuários</CardTitle>
        <CardDescription className="text-muted-foreground">
          Clientes da plataforma
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="border border-border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead className="text-muted-foreground">Nome</TableHead>
                <TableHead className="text-muted-foreground">E-mail</TableHead>
                <TableHead className="text-muted-foreground">Total Gasto</TableHead>
                <TableHead className="text-muted-foreground">Pedidos</TableHead>
                <TableHead className="text-muted-foreground">Último Acesso</TableHead>
                <TableHead className="text-muted-foreground">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {platformUsers.map((user) => (
                <TableRow key={user.id} className="border-border hover:bg-muted/50">
                  <TableCell className="font-medium text-foreground">{user.name}</TableCell>
                  <TableCell className="text-foreground">{user.email}</TableCell>
                  <TableCell className="text-foreground">
                    R$ {user.totalSpent.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-foreground">{user.ordersCount}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(user.lastAccess).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="border-border hover:bg-accent">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="border-border hover:bg-accent">
                        <RotateCcw className="h-4 w-4" />
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
      </CardContent>
    </Card>
  );
};

export default UserManagement;
