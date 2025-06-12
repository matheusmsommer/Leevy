
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, ShoppingCart, DollarSign, TrendingUp, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PlatformStats {
  totalCompanies: number;
  totalOrders: number;
  totalRevenue: number;
  commissionsReceived: number;
  commissionsPending: number;
}

interface TopCompany {
  id: string;
  name: string;
  orders: number;
  revenue: number;
}

const DashboardStats = () => {
  const { toast } = useToast();
  const [stats, setStats] = useState<PlatformStats>({
    totalCompanies: 0,
    totalOrders: 0,
    totalRevenue: 0,
    commissionsReceived: 0,
    commissionsPending: 0
  });
  const [topCompanies, setTopCompanies] = useState<TopCompany[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlatformStats();
  }, []);

  const fetchPlatformStats = async () => {
    try {
      console.log('Fetching platform stats...');

      // Buscar total de empresas
      const { count: companiesCount } = await supabase
        .from('companies')
        .select('*', { count: 'exact', head: true });

      // Buscar total de pedidos
      const { count: ordersCount } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true });

      // Buscar receita total
      const { data: ordersData } = await supabase
        .from('orders')
        .select('total_amount');

      const totalRevenue = ordersData?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0;

      // Buscar top empresas por número de pedidos
      const { data: companiesData } = await supabase
        .from('companies')
        .select(`
          id,
          name,
          orders!inner(total_amount)
        `)
        .limit(5);

      const topCompaniesWithStats = await Promise.all(
        (companiesData || []).map(async (company) => {
          const { count: orderCount } = await supabase
            .from('orders')
            .select('*', { count: 'exact', head: true })
            .eq('company_id', company.id);

          const { data: revenueData } = await supabase
            .from('orders')
            .select('total_amount')
            .eq('company_id', company.id);

          const revenue = revenueData?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0;

          return {
            id: company.id,
            name: company.name,
            orders: orderCount || 0,
            revenue
          };
        })
      );

      setStats({
        totalCompanies: companiesCount || 0,
        totalOrders: ordersCount || 0,
        totalRevenue,
        commissionsReceived: totalRevenue * 0.1, // 10% commission
        commissionsPending: 0 // Placeholder
      });

      setTopCompanies(topCompaniesWithStats.sort((a, b) => b.orders - a.orders));

    } catch (error) {
      console.error('Error fetching platform stats:', error);
      toast({
        title: "Erro ao carregar estatísticas",
        description: "Não foi possível carregar as estatísticas da plataforma.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard Super Admin</h1>
            <p className="text-muted-foreground mt-2">
              Carregando estatísticas da plataforma...
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard Super Admin</h1>
          <p className="text-muted-foreground mt-2">
            Visão geral da plataforma
          </p>
        </div>
      </div>

      {/* Estatísticas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card className="border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Empresas
            </CardTitle>
            <Building2 className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-3xl font-bold text-foreground">{stats.totalCompanies}</div>
            <p className="text-sm text-muted-foreground">
              Empresas cadastradas
            </p>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Pedidos
            </CardTitle>
            <ShoppingCart className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-3xl font-bold text-foreground">{stats.totalOrders}</div>
            <p className="text-sm text-muted-foreground">
              Pedidos realizados
            </p>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Receita Total
            </CardTitle>
            <DollarSign className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-3xl font-bold text-foreground">
              R$ {stats.totalRevenue.toFixed(2)}
            </div>
            <p className="text-sm text-muted-foreground">
              Volume financeiro
            </p>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Comissões Recebidas
            </CardTitle>
            <TrendingUp className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-3xl font-bold text-foreground">
              R$ {stats.commissionsReceived.toFixed(2)}
            </div>
            <p className="text-sm text-muted-foreground">
              Nossa receita
            </p>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Comissões Pendentes
            </CardTitle>
            <Users className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-3xl font-bold text-foreground">
              R$ {stats.commissionsPending.toFixed(2)}
            </div>
            <p className="text-sm text-muted-foreground">
              A receber
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Top Empresas */}
      {topCompanies.length > 0 && (
        <Card className="border-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-foreground">Top Empresas</CardTitle>
            <CardDescription className="text-muted-foreground">
              Empresas com maior volume de pedidos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topCompanies.map((company, index) => (
                <div key={company.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full">
                      <span className="text-sm font-semibold text-primary">#{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{company.name}</p>
                      <p className="text-sm text-muted-foreground">{company.orders} pedidos</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-foreground">R$ {company.revenue.toFixed(2)}</p>
                    <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
                      R$ {(company.revenue * 0.1).toFixed(2)} comissão
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {topCompanies.length === 0 && (
        <Card className="border-border shadow-sm">
          <CardContent className="text-center py-12">
            <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Nenhuma empresa com pedidos ainda</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DashboardStats;
