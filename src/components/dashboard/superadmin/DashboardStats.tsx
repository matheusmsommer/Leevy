
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Building2, 
  FileText, 
  DollarSign, 
  Activity,
  TrendingUp
} from 'lucide-react';

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

interface DashboardStatsProps {
  platformStats: PlatformStats;
  topCompanies: TopCompany[];
}

const DashboardStats = ({ platformStats, topCompanies }: DashboardStatsProps) => {
  return (
    <div className="space-y-6">
      {/* Platform Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Empresas</CardTitle>
            <Building2 className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{platformStats.totalCompanies}</div>
            <p className="text-xs text-muted-foreground">Cadastradas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pedidos</CardTitle>
            <FileText className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{platformStats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">Total realizados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {platformStats.totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Bruta da plataforma</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Comissões Recebidas</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {platformStats.commissionsReceived.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Já coletadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">A Receber</CardTitle>
            <Activity className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {platformStats.commissionsPending.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Pendentes</p>
          </CardContent>
        </Card>
      </div>

      {/* Top Companies */}
      <Card>
        <CardHeader>
          <CardTitle>Ranking de Empresas</CardTitle>
          <CardDescription>Laboratórios com mais vendas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topCompanies.map((company, index) => (
              <div key={company.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full text-primary font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium">{company.name}</p>
                    <p className="text-sm text-muted-foreground">{company.orders} pedidos</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold">R$ {company.revenue.toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground">Receita</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStats;
