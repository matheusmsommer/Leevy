
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Shield, Lock, Trash2 } from 'lucide-react';

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
    <Card>
      <CardHeader>
        <CardTitle>Gestão de Usuários</CardTitle>
        <CardDescription>Clientes da plataforma</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>E-mail</TableHead>
              <TableHead>Total Gasto</TableHead>
              <TableHead>Pedidos</TableHead>
              <TableHead>Último Acesso</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {platformUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>R$ {user.totalSpent.toFixed(2)}</TableCell>
                <TableCell>{user.ordersCount}</TableCell>
                <TableCell>
                  {new Date(user.lastAccess).toLocaleDateString('pt-BR')}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Shield className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Lock className="h-4 w-4" />
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
      </CardContent>
    </Card>
  );
};

export default UserManagement;
