
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, ShoppingCart, DollarSign, TrendingUp, Users, MapPin } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface DashboardStats {
  todaySales: number;
  monthlyRevenue: number;
  activeLocations: number;
  totalOrders: number;
  recentOrders: Array<{
    id: string;
    patient_name: string;
    total_amount: number;
    created_at: string;
    order_items: Array<{
      service: {
        exam: {
          name: string;
        };
      };
    }>;
  }>;
  topServices: Array<{
    name: string;
    sales: number;
    revenue: number;
  }>;
}

const DashboardOverview = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    todaySales: 0,
    monthlyRevenue: 0,
    activeLocations: 0,
    totalOrders: 0,
    recentOrders: [],
    topServices: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, [user]);

  const fetchDashboardStats = async () => {
    if (!user) return;

    try {
      console.log('Fetching dashboard stats for user:', user.id);
      
      // Buscar o perfil do usuário para obter company_id
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', user.id)
        .single();

      if (profileError || !profile?.company_id) {
        console.error('Error fetching user profile or no company_id:', profileError);
        setLoading(false);
        return;
      }

      const companyId = profile.company_id;
      const today = new Date();
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());

      // Buscar vendas de hoje
      const { data: todayOrders } = await supabase
        .from('orders')
        .select('id, total_amount')
        .eq('company_id', companyId)
        .gte('created_at', startOfToday.toISOString());

      // Buscar receita do mês
      const { data: monthOrders } = await supabase
        .from('orders')
        .select('total_amount')
        .eq('company_id', companyId)
        .gte('created_at', startOfMonth.toISOString());

      // Buscar locais ativos
      const { data: locations } = await supabase
        .from('locations')
        .select('id')
        .eq('company_id', companyId)
        .eq('active', true);

      // Buscar pedidos recentes
      const { data: recentOrders } = await supabase
        .from('orders')
        .select(`
          id,
          patient_name,
          total_amount,
          created_at,
          order_items(
            service:company_services!inner(
              exam:exams!inner(name)
            )
          )
        `)
        .eq('company_id', companyId)
        .order('created_at', { ascending: false })
        .limit(5);

      // Buscar total de pedidos
      const { count: totalOrdersCount } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('company_id', companyId);

      setStats({
        todaySales: todayOrders?.length || 0,
        monthlyRevenue: monthOrders?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0,
        activeLocations: locations?.length || 0,
        totalOrders: totalOrdersCount || 0,
        recentOrders: recentOrders || [],
        topServices: [] // Implementar depois se necessário
      });

    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Visão geral do seu laboratório
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
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Visão geral do seu laboratório
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-border hover:shadow-md transition-shadow bg-gradient-to-br from-background to-muted/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Vendas Hoje
            </CardTitle>
            <div className="p-2 bg-primary/10 rounded-lg">
              <ShoppingCart className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-3xl font-bold text-foreground mb-1">{stats.todaySales}</div>
            <p className="text-sm text-muted-foreground">
              Total de pedidos hoje
            </p>
          </CardContent>
        </Card>

        <Card className="border-border hover:shadow-md transition-shadow bg-gradient-to-br from-background to-muted/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Receita do Mês
            </CardTitle>
            <div className="p-2 bg-primary/10 rounded-lg">
              <DollarSign className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-3xl font-bold text-foreground mb-1">
              R$ {stats.monthlyRevenue.toFixed(2)}
            </div>
            <p className="text-sm text-muted-foreground">
              Receita mensal total
            </p>
          </CardContent>
        </Card>

        <Card className="border-border hover:shadow-md transition-shadow bg-gradient-to-br from-background to-muted/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Pedidos
            </CardTitle>
            <div className="p-2 bg-primary/10 rounded-lg">
              <Users className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-3xl font-bold text-foreground mb-1">{stats.totalOrders}</div>
            <p className="text-sm text-muted-foreground">
              Pedidos realizados
            </p>
          </CardContent>
        </Card>

        <Card className="border-border hover:shadow-md transition-shadow bg-gradient-to-br from-background to-muted/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Unidades Ativas
            </CardTitle>
            <div className="p-2 bg-primary/10 rounded-lg">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-3xl font-bold text-foreground mb-1">{stats.activeLocations}</div>
            <p className="text-sm text-muted-foreground">
              Locais operacionais
            </p>
          </CardContent>
        </Card>
      </div>

      {stats.recentOrders.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
          <Card className="border-border shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-foreground flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Pedidos Recentes
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Últimos pedidos realizados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border">
                    <div>
                      <p className="font-semibold text-foreground">{order.patient_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {order.order_items.map(item => item.service.exam.name).join(', ')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-foreground">R$ {order.total_amount.toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default DashboardOverview;
