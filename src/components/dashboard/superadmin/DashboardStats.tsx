
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Building2, ShoppingCart, DollarSign, Award } from 'lucide-react';

interface DashboardStatsProps {
  platformStats: {
    totalCompanies: number;
    totalOrders: number;
    totalRevenue: number;
    commissionsReceived: number;
    commissionsPending: number;
  };
  topCompanies: Array<{
    id: string;
    name: string;
    orders: number;
    revenue: number;
  }>;
}

const DashboardStats = ({ platformStats, topCompanies }: DashboardStatsProps) => {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-border hover:shadow-md transition-shadow bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Empresas
            </CardTitle>
            <div className="p-2 bg-primary/10 rounded-lg">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-3xl font-bold text-foreground mb-1">{platformStats.totalCompanies}</div>
            <p className="text-sm text-muted-foreground">
              Laboratórios e clínicas ativas
            </p>
          </CardContent>
        </Card>

        <Card className="border-border hover:shadow-md transition-shadow bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Pedidos
            </CardTitle>
            <div className="p-2 bg-primary/10 rounded-lg">
              <ShoppingCart className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-3xl font-bold text-foreground mb-1">{platformStats.totalOrders.toLocaleString()}</div>
            <p className="text-sm text-muted-foreground">
              Exames vendidos na plataforma
            </p>
          </CardContent>
        </Card>

        <Card className="border-border hover:shadow-md transition-shadow bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Receita Total
            </CardTitle>
            <div className="p-2 bg-primary/10 rounded-lg">
              <DollarSign className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-3xl font-bold text-foreground mb-1">
              R$ {platformStats.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-sm text-muted-foreground">
              Total faturado
            </p>
          </CardContent>
        </Card>

        <Card className="border-border hover:shadow-md transition-shadow bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Comissões Pendentes
            </CardTitle>
            <div className="p-2 bg-primary/10 rounded-lg">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-3xl font-bold text-foreground mb-1">
              R$ {platformStats.commissionsPending.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-sm text-muted-foreground">
              A receber
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border shadow-sm bg-card">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-semibold text-foreground flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            Ranking de Empresas
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Empresas com mais vendas este mês
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topCompanies.map((company, index) => (
              <div key={company.id} className="flex items-center justify-between p-4 bg-accent rounded-lg border border-border hover:bg-accent/80 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm ${
                    index === 0 ? 'bg-primary text-primary-foreground' :
                    'bg-muted text-foreground'
                  }`}>
                    #{index + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{company.name}</p>
                    <p className="text-sm text-muted-foreground">{company.orders} vendas realizadas</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg text-foreground">
                    R$ {company.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-sm text-muted-foreground">faturado</p>
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
