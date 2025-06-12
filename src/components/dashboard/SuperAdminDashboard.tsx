
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Settings, 
  Users, 
  Calendar, 
  DollarSign, 
  Building, 
  TrendingUp, 
  Shield, 
  MessageSquare, 
  FileText, 
  Search,
  MoreHorizontal,
  Eye,
  Edit,
  Ban,
  RefreshCw
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const SuperAdminDashboard = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock data for companies
  const companies = [
    {
      id: '1',
      name: 'Laboratório São Paulo',
      cnpj: '12.345.678/0001-90',
      status: 'ativa',
      admin_email: 'admin@labsp.com',
      created_at: '2024-01-10',
      total_sales: 8750.00,
      commission_owed: 875.00
    },
    {
      id: '2',
      name: 'Clínica Saúde Total',
      cnpj: '98.765.432/0001-10',
      status: 'aguardando_onboarding',
      admin_email: 'contato@saudetotal.com',
      created_at: '2024-01-12',
      total_sales: 0,
      commission_owed: 0
    },
    {
      id: '3',
      name: 'Centro Médico Vida',
      cnpj: '11.222.333/0001-44',
      status: 'suspensa',
      admin_email: 'admin@centrovida.com',
      created_at: '2024-01-05',
      total_sales: 15200.00,
      commission_owed: 1520.00
    }
  ];

  // Mock data for transactions
  const transactions = [
    {
      id: '1',
      company_name: 'Laboratório São Paulo',
      service: 'Hemograma Completo',
      patient: 'João Silva',
      amount: 45.00,
      commission: 4.50,
      status: 'pago',
      date: '2024-01-15'
    },
    {
      id: '2',
      company_name: 'Centro Médico Vida',
      service: 'Check-up Básico',
      patient: 'Maria Santos',
      amount: 180.00,
      commission: 18.00,
      status: 'estornado',
      date: '2024-01-14'
    }
  ];

  // Mock data for support tickets
  const supportTickets = [
    {
      id: '1',
      company: 'Laboratório São Paulo',
      subject: 'Problema com agendamento',
      status: 'aberto',
      priority: 'alta',
      created_at: '2024-01-15',
      last_reply: '2024-01-15'
    },
    {
      id: '2',
      company: 'Clínica Saúde Total',
      subject: 'Dúvida sobre comissões',
      status: 'respondido',
      priority: 'media',
      created_at: '2024-01-14',
      last_reply: '2024-01-14'
    }
  ];

  // Mock global KPIs
  const globalKpis = {
    totalCompanies: 25,
    activeCompanies: 18,
    totalRevenue: 125000.00,
    totalCommission: 12500.00,
    uniquePatients: 2450,
    totalBookings: 1250
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      'ativa': 'default',
      'inativa': 'secondary',
      'aguardando_onboarding': 'outline',
      'suspensa': 'destructive'
    };
    
    const labels = {
      'ativa': 'Ativa',
      'inativa': 'Inativa',
      'aguardando_onboarding': 'Aguardando Onboarding',
      'suspensa': 'Suspensa'
    };

    return (
      <Badge variant={variants[status as keyof typeof variants] as any}>
        {labels[status as keyof typeof labels]}
      </Badge>
    );
  };

  const handleCompanyAction = (action: string, companyId: string) => {
    toast({
      title: "Ação executada",
      description: `${action} executado para a empresa ${companyId}`,
    });
  };

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.cnpj.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || company.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gradient">leevy SuperAdmin</h1>
            <p className="text-sm text-muted-foreground">Olá, {user?.name}</p>
          </div>
          <Button variant="outline" onClick={logout}>
            Sair
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Dashboard</TabsTrigger>
            <TabsTrigger value="companies">Empresas</TabsTrigger>
            <TabsTrigger value="transactions">Transações</TabsTrigger>
            <TabsTrigger value="support">Suporte</TabsTrigger>
            <TabsTrigger value="reports">Relatórios</TabsTrigger>
            <TabsTrigger value="settings">Configurações</TabsTrigger>
          </TabsList>

          {/* Dashboard Overview */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total de Empresas</CardTitle>
                  <Building className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{globalKpis.totalCompanies}</div>
                  <p className="text-xs text-muted-foreground">
                    {globalKpis.activeCompanies} ativas
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Faturamento Total</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">R$ {globalKpis.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                  <p className="text-xs text-muted-foreground">
                    Este mês
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Comissões Leevy</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">R$ {globalKpis.totalCommission.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                  <p className="text-xs text-muted-foreground">
                    10% do faturamento
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pacientes Únicos</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{globalKpis.uniquePatients.toLocaleString('pt-BR')}</div>
                  <p className="text-xs text-muted-foreground">
                    {globalKpis.totalBookings} agendamentos
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Empresas Recentes</CardTitle>
                  <CardDescription>Últimas empresas cadastradas</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {companies.slice(0, 3).map((company) => (
                      <div key={company.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{company.name}</p>
                          <p className="text-sm text-muted-foreground">{company.cnpj}</p>
                        </div>
                        {getStatusBadge(company.status)}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Insights da Plataforma</CardTitle>
                  <CardDescription>Dados e sugestões inteligentes</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm font-medium text-blue-900">Exame mais vendido</p>
                    <p className="text-xs text-blue-700">Hemograma Completo - 245 vendas</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-sm font-medium text-green-900">Cidade em crescimento</p>
                    <p className="text-xs text-green-700">São Paulo - +15% em agendamentos</p>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <p className="text-sm font-medium text-yellow-900">Atenção necessária</p>
                    <p className="text-xs text-yellow-700">3 empresas com baixa performance</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Companies Management */}
          <TabsContent value="companies" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Empresas Cadastradas
                </CardTitle>
                <CardDescription>
                  Gerencie todas as empresas da plataforma
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar por nome ou CNPJ..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os Status</SelectItem>
                      <SelectItem value="ativa">Ativa</SelectItem>
                      <SelectItem value="inativa">Inativa</SelectItem>
                      <SelectItem value="aguardando_onboarding">Aguardando</SelectItem>
                      <SelectItem value="suspensa">Suspensa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Empresa</TableHead>
                      <TableHead>CNPJ</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Vendas Totais</TableHead>
                      <TableHead>Comissão Devida</TableHead>
                      <TableHead>Cadastro</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCompanies.map((company) => (
                      <TableRow key={company.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{company.name}</p>
                            <p className="text-sm text-muted-foreground">{company.admin_email}</p>
                          </div>
                        </TableCell>
                        <TableCell>{company.cnpj}</TableCell>
                        <TableCell>{getStatusBadge(company.status)}</TableCell>
                        <TableCell>R$ {company.total_sales.toFixed(2)}</TableCell>
                        <TableCell>R$ {company.commission_owed.toFixed(2)}</TableCell>
                        <TableCell>{company.created_at}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleCompanyAction('Entrar como admin', company.id)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleCompanyAction('Editar', company.id)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleCompanyAction('Suspender', company.id)}
                            >
                              <Ban className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Transactions */}
          <TabsContent value="transactions">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Transações da Plataforma
                </CardTitle>
                <CardDescription>
                  Acompanhe todas as transações e comissões
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Empresa</TableHead>
                      <TableHead>Serviço</TableHead>
                      <TableHead>Paciente</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Comissão</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>{transaction.date}</TableCell>
                        <TableCell>{transaction.company_name}</TableCell>
                        <TableCell>{transaction.service}</TableCell>
                        <TableCell>{transaction.patient}</TableCell>
                        <TableCell>R$ {transaction.amount.toFixed(2)}</TableCell>
                        <TableCell>R$ {transaction.commission.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge variant={transaction.status === 'pago' ? 'default' : 'destructive'}>
                            {transaction.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Support */}
          <TabsContent value="support">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Suporte ao Cliente
                </CardTitle>
                <CardDescription>
                  Gerencie chamados de suporte das empresas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Empresa</TableHead>
                      <TableHead>Assunto</TableHead>
                      <TableHead>Prioridade</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Criado em</TableHead>
                      <TableHead>Última Resposta</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {supportTickets.map((ticket) => (
                      <TableRow key={ticket.id}>
                        <TableCell>{ticket.company}</TableCell>
                        <TableCell>{ticket.subject}</TableCell>
                        <TableCell>
                          <Badge variant={ticket.priority === 'alta' ? 'destructive' : 'outline'}>
                            {ticket.priority}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={ticket.status === 'aberto' ? 'destructive' : 'default'}>
                            {ticket.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{ticket.created_at}</TableCell>
                        <TableCell>{ticket.last_reply}</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports */}
          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Relatórios da Plataforma
                </CardTitle>
                <CardDescription>
                  Análises e relatórios detalhados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Serviços Populares</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm">Hemograma Completo</span>
                          <span className="text-sm font-medium">245 vendas</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Check-up Básico</span>
                          <span className="text-sm font-medium">198 vendas</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Consulta Cardiologia</span>
                          <span className="text-sm font-medium">156 vendas</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Cidades com Maior Volume</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm">São Paulo - SP</span>
                          <span className="text-sm font-medium">R$ 45.230</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Rio de Janeiro - RJ</span>
                          <span className="text-sm font-medium">R$ 32.150</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Belo Horizonte - MG</span>
                          <span className="text-sm font-medium">R$ 18.900</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings */}
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Configurações Globais
                </CardTitle>
                <CardDescription>
                  Configure parâmetros da plataforma
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-4">Taxas e Comissões</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Taxa Fixa (R$)</label>
                        <Input type="number" defaultValue="5.00" step="0.01" />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Comissão (%)</label>
                        <Input type="number" defaultValue="10" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-4">Configurações de E-mail</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">E-mail de Notificações</label>
                        <Input defaultValue="notificacoes@leevy.com.br" />
                      </div>
                      <div>
                        <label className="text-sm font-medium">E-mail de Suporte</label>
                        <Input defaultValue="suporte@leevy.com.br" />
                      </div>
                    </div>
                  </div>

                  <Button>Salvar Configurações</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
