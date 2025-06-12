
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Eye, UserCheck, Lock, Users, Mail } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PlatformUser {
  id: string;
  name: string;
  email: string;
  totalSpent: number;
  lastAccess: string;
  ordersCount: number;
}

const UserManagement = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<PlatformUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlatformUsers();
  }, []);

  const fetchPlatformUsers = async () => {
    try {
      console.log('Fetching platform users...');
      
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'user')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching users:', error);
        toast({
          title: "Erro ao carregar usuários",
          description: "Não foi possível carregar os usuários da plataforma.",
          variant: "destructive",
        });
        return;
      }

      console.log('Platform users loaded:', profiles);

      // Para cada usuário, buscar estatísticas de pedidos
      const usersWithStats = await Promise.all(
        (profiles || []).map(async (profile) => {
          // Buscar pedidos do usuário
          const { data: orders } = await supabase
            .from('orders')
            .select('total_amount, created_at')
            .eq('user_id', profile.id);

          const totalSpent = orders?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0;
          const ordersCount = orders?.length || 0;
          
          // Último acesso seria do auth, mas não temos acesso direto
          // Por enquanto usando created_at como placeholder
          const lastAccess = profile.created_at;

          return {
            id: profile.id,
            name: profile.full_name || 'Usuário',
            email: profile.email,
            totalSpent,
            lastAccess,
            ordersCount
          };
        })
      );

      setUsers(usersWithStats);
    } catch (error) {
      console.error('Error in fetchPlatformUsers:', error);
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
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl font-semibold text-foreground">Gestão de Usuários</CardTitle>
              <CardDescription className="text-muted-foreground">
                Carregando usuários...
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
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl font-semibold text-foreground">Gestão de Usuários</CardTitle>
            <CardDescription className="text-muted-foreground">
              Usuários finais da plataforma
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {users.length === 0 ? (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Nenhum usuário cadastrado ainda</p>
          </div>
        ) : (
          <div className="border border-border rounded-xl overflow-hidden bg-card">
            <Table>
              <TableHeader>
                <TableRow className="border-border bg-muted/30">
                  <TableHead className="text-muted-foreground font-semibold py-4">Nome</TableHead>
                  <TableHead className="text-muted-foreground font-semibold">Email</TableHead>
                  <TableHead className="text-muted-foreground font-semibold">Total Gasto</TableHead>
                  <TableHead className="text-muted-foreground font-semibold">Pedidos</TableHead>
                  <TableHead className="text-muted-foreground font-semibold">Último Acesso</TableHead>
                  <TableHead className="text-muted-foreground font-semibold text-center">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id} className="border-border hover:bg-muted/20 transition-colors">
                    <TableCell className="font-semibold text-foreground py-4">{user.name}</TableCell>
                    <TableCell className="text-foreground">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        {user.email}
                      </div>
                    </TableCell>
                    <TableCell className="text-foreground font-semibold">
                      R$ {user.totalSpent.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-foreground">
                      <Badge className="bg-primary/10 text-primary border-primary/20">
                        {user.ordersCount}
                      </Badge>
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
                          <UserCheck className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="border-destructive/20 text-destructive hover:bg-destructive/10">
                          <Lock className="h-4 w-4" />
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

export default UserManagement;
