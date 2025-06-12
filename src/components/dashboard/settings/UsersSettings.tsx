
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Users, Plus, Mail, UserX, Shield } from 'lucide-react';

interface UsersSettingsProps {
  companyId: string;
}

interface CompanyUser {
  id: string;
  name: string;
  email: string;
  role: string;
  lastAccess: string;
}

const UsersSettings: React.FC<UsersSettingsProps> = ({ companyId }) => {
  const [users, setUsers] = useState<CompanyUser[]>([]);
  const [inviteEmail, setInviteEmail] = useState('');

  const handleInviteUser = () => {
    if (inviteEmail) {
      console.log('Convidar usuário:', inviteEmail);
      // TODO: Implementar envio de convite
      setInviteEmail('');
    }
  };

  const handleRemoveUser = (userId: string) => {
    console.log('Remover usuário:', userId);
    // TODO: Implementar remoção
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Usuários da Empresa
        </CardTitle>
        <CardDescription>
          Gerencie quem tem acesso ao painel administrativo
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex gap-2">
          <Input
            placeholder="email@exemplo.com"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            className="flex-1"
          />
          <Button onClick={handleInviteUser}>
            <Mail className="h-4 w-4 mr-2" />
            Convidar
          </Button>
        </div>

        {users.length === 0 ? (
          <div className="text-center py-8">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              Nenhum usuário adicional cadastrado
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Cargo</TableHead>
                <TableHead>Último Acesso</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-primary" />
                      {user.role}
                    </div>
                  </TableCell>
                  <TableCell>{user.lastAccess}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveUser(user.id)}
                    >
                      <UserX className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default UsersSettings;
