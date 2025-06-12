
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, ShoppingCart, DollarSign, TrendingUp, Users, MapPin } from 'lucide-react';

const DashboardOverview = () => {
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
            <div className="text-3xl font-bold text-foreground mb-1">24</div>
            <p className="text-sm text-muted-foreground">
              +12% em relação a ontem
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
              R$ 12.450
            </div>
            <p className="text-sm text-muted-foreground">
              +8% em relação ao mês passado
            </p>
          </CardContent>
        </Card>

        <Card className="border-border hover:shadow-md transition-shadow bg-gradient-to-br from-background to-muted/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Clientes Ativos
            </CardTitle>
            <div className="p-2 bg-primary/10 rounded-lg">
              <Users className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-3xl font-bold text-foreground mb-1">156</div>
            <p className="text-sm text-muted-foreground">
              +23 novos este mês
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
            <div className="text-3xl font-bold text-foreground mb-1">3</div>
            <p className="text-sm text-muted-foreground">
              Todas operacionais
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-foreground flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Vendas Recentes
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Últimos pedidos realizados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { patient: 'João Silva', service: 'Hemograma Completo', amount: 45.00, time: '10:30' },
                { patient: 'Maria Santos', service: 'Glicemia de Jejum', amount: 25.00, time: '11:15' },
                { patient: 'Pedro Costa', service: 'Ultrassom Abdome', amount: 120.00, time: '14:20' },
              ].map((order, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border">
                  <div>
                    <p className="font-semibold text-foreground">{order.patient}</p>
                    <p className="text-sm text-muted-foreground">{order.service}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-foreground">R$ {order.amount.toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">{order.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-foreground flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Serviços Mais Vendidos
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Top 5 exames do mês
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: 'Hemograma Completo', sales: 45, revenue: 2025 },
                { name: 'Glicemia de Jejum', sales: 38, revenue: 950 },
                { name: 'Ultrassom Abdome', sales: 25, revenue: 3000 },
                { name: 'Colesterol Total', sales: 22, revenue: 660 },
                { name: 'Ureia e Creatinina', sales: 18, revenue: 540 },
              ].map((service, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border">
                  <div>
                    <p className="font-semibold text-foreground">{service.name}</p>
                    <p className="text-sm text-muted-foreground">{service.sales} vendas</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-foreground">R$ {service.revenue.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardOverview;
