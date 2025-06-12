
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
  RefreshCw,
  Activity,
  TestTube,
  Package,
  Database,
  CreditCard,
  AlertTriangle,
  ClipboardList,
  Download,
  Mail,
  Phone,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  Pause,
  Play
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
      commission_owed: 875.00,
      commission_percentage: 10,
      orders_count: 45
    },
    {
      id: '2',
      name: 'Clínica Saúde Total',
      cnpj: '98.765.432/0001-10',
      status: 'aguardando_onboarding',
      admin_email: 'contato@saudetotal.com',
      created_at: '2024-01-12',
      total_sales: 0,
      commission_owed: 0,
      commission_percentage: 10,
      orders_count: 0
    },
    {
      id: '3',
      name: 'Centro Médico Vida',
      cnpj: '11.222.333/0001-44',
      status: 'suspensa',
      admin_email: 'admin@centrovida.com',
      created_at: '2024-01-05',
      total_sales: 15200.00,
      commission_owed: 1520.00,
      commission_percentage: 10,
      orders_count: 78
    }
  ];

  // Mock data for users
  const users = [
    {
      id: '1',
      name: 'João Silva',
      email: 'joao@email.com',
      orders_count: 5,
      last_access: '2024-01-15',
      status: 'ativo'
    },
    {
      id: '2',
      name: 'Maria Santos',
      email: 'maria@email.com',
      orders_count: 12,
      last_access: '2024-01-14',
      status: 'ativo'
    }
  ];

  // Mock data for global exams
  const globalExams = [
    {
      id: '1',
      name: 'Hemograma Completo',
      tuss_code: '40301112',
      description: 'Exame de sangue completo para análise geral',
      tags: ['jejum', 'sangue'],
      companies_using: 15
    },
    {
      id: '2',
      name: 'Glicemia de Jejum',
      tuss_code: '40301125',
      description: 'Dosagem de glicose no sangue',
      tags: ['jejum', 'sangue'],
      companies_using: 20
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

  // Mock platform config
  const platformConfig = {
    fixed_fee: 5.00,
    commission_percentage: 10,
    maintenance_mode: false,
    notification_email: 'notificacoes@leevy.com.br',
    support_email: 'suporte@leevy.com.br'
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
      'aguardando_onboarding': 'Aguardando',
      'suspensa': 'Suspensa'
    };

    return (
      <Badge variant={variants[status as keyof typeof variants] as any}>
        {labels[status as keyof typeof labels]}
      </Badge>
    );
  };

  const getUserStatusBadge = (status: string) => {
    return (
      <Badge variant={status === 'ativo' ? 'default' : 'secondary'}>
        {status === 'ativo' ? 'Ativo' : 'Inativo'}
      </Badge>
    );
  };

  const handleCompanyAction = (action: string, companyId: string) => {
    toast({
      title: "Ação executada",
      description: `${action} executado para a empresa ${companyId}`,
    });
  };

  const handleUserAction = (action: string, userId: string) => {
    toast({
      title: "Ação executada",
      description: `${action} executado para o usuário ${userId}`,
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
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Leevy SuperAdmin</h1>
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
            <TabsTrigger value="users">Usuários</TabsTrigger>
            <TabsTrigger value="payments">Pagamentos</TabsTrigger>
            <TabsTrigger value="exams">Base de Exames</TabsTrigger>
            <TabsTrigger value="settings">Configurações</TabsTrigger>
          </TabsList>

          {/* Dashboard Overview */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-card border-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-card-foreground">Total de Empresas</CardTitle>
                  <Building className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-card-foreground">{globalKpis.totalCompanies}</div>
                  <p className="text-xs text-muted-foreground">
                    {globalKpis.activeCompanies} ativas
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-card-foreground">Faturamento Total</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-card-foreground">R$ {globalKpis.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                  <p className="text-xs text-muted-foreground">
                    Este mês
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-card-foreground">Comissões Leevy</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-card-foreground">R$ {globalKpis.totalCommission.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                  <p className="text-xs text-muted-foreground">
                    10% do faturamento
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-card-foreground">Pacientes Únicos</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-card-foreground">{globalKpis.uniquePatients.toLocaleString('pt-BR')}</div>
                  <p className="text-xs text-muted-foreground">
                    {globalKpis.totalBookings} agendamentos
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-card-foreground">Empresas Recentes</CardTitle>
                  <CardDescription>Últimas empresas cadastradas</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {companies.slice(0, 3).map((company) => (
                      <div key={company.id} className="flex items-center justify-between p-3 border border-border rounded-lg bg-card">
                        <div>
                          <p className="font-medium text-card-foreground">{company.name}</p>
                          <p className="text-sm text-muted-foreground">{company.cnpj}</p>
                        </div>
                        {getStatusBadge(company.status)}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-card-foreground">Insights da Plataforma</CardTitle>
                  <CardDescription>Dados e sugestões inteligentes</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <TestTube className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm font-medium text-card-foreground">Exame mais vendido</p>
                    </div>
                    <p className="text-xs text-muted-foreground">Hemograma Completo - 245 vendas</p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm font-medium text-card-foreground">Cidade em crescimento</p>
                    </div>
                    <p className="text-xs text-muted-foreground">São Paulo - +15% em agendamentos</p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm font-medium text-card-foreground">Atenção necessária</p>
                    </div>
                    <p className="text-xs text-muted-foreground">3 empresas com baixa performance</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Companies Management */}
          <TabsContent value="companies" className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-card-foreground">
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
                      <TableHead>Pedidos</TableHead>
                      <TableHead>Vendas Totais</TableHead>
                      <TableHead>Comissão (%)</TableHead>
                      <TableHead>Cadastro</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCompanies.map((company) => (
                      <TableRow key={company.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium text-card-foreground">{company.name}</p>
                            <p className="text-sm text-muted-foreground">{company.admin_email}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-card-foreground">{company.cnpj}</TableCell>
                        <TableCell>{getStatusBadge(company.status)}</TableCell>
                        <TableCell className="text-card-foreground">{company.orders_count}</TableCell>
                        <TableCell className="text-card-foreground">R$ {company.total_sales.toFixed(2)}</TableCell>
                        <TableCell className="text-card-foreground">{company.commission_percentage}%</TableCell>
                        <TableCell className="text-card-foreground">{company.created_at}</TableCell>
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

          {/* Users Management */}
          <TabsContent value="users" className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-card-foreground">
                  <Users className="h-5 w-5" />
                  Usuários da Plataforma
                </CardTitle>
                <CardDescription>
                  Gerencie todos os usuários clientes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Pedidos</TableHead>
                      <TableHead>Último Acesso</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="text-card-foreground">{user.name}</TableCell>
                        <TableCell className="text-card-foreground">{user.email}</TableCell>
                        <TableCell className="text-card-foreground">{user.orders_count}</TableCell>
                        <TableCell className="text-card-foreground">{user.last_access}</TableCell>
                        <TableCell>{getUserStatusBadge(user.status)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUserAction('Ver detalhes', user.id)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUserAction('Resetar senha', user.id)}
                            >
                              <RefreshCw className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUserAction('Desativar', user.id)}
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

          {/* Payments */}
          <TabsContent value="payments" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card className="bg-card border-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-card-foreground">Total Vendido</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-card-foreground">R$ 125.000,00</div>
                  <p className="text-xs text-muted-foreground">Este mês</p>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-card-foreground">Comissão Leevy</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-card-foreground">R$ 12.500,00</div>
                  <p className="text-xs text-muted-foreground">10% das vendas</p>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-card-foreground">A Repassar</CardTitle>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-card-foreground">R$ 112.500,00</div>
                  <p className="text-xs text-muted-foreground">Para empresas</p>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-card-foreground">
                  <CreditCard className="h-5 w-5" />
                  Transações da Plataforma
                </CardTitle>
                <CardDescription>
                  Acompanhe todas as transações e comissões
                </CardDescription>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Exportar CSV
                  </Button>
                  <Button variant="outline" size="sm">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Marcar Repasses
                  </Button>
                </div>
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
                        <TableCell className="text-card-foreground">{transaction.date}</TableCell>
                        <TableCell className="text-card-foreground">{transaction.company_name}</TableCell>
                        <TableCell className="text-card-foreground">{transaction.service}</TableCell>
                        <TableCell className="text-card-foreground">{transaction.patient}</TableCell>
                        <TableCell className="text-card-foreground">R$ {transaction.amount.toFixed(2)}</TableCell>
                        <TableCell className="text-card-foreground">R$ {transaction.commission.toFixed(2)}</TableCell>
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

          {/* Global Exams */}
          <TabsContent value="exams" className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-card-foreground">
                  <TestTube className="h-5 w-5" />
                  Base Global de Exames
                </CardTitle>
                <CardDescription>
                  Gerencie exames padronizados da plataforma
                </CardDescription>
                <Button className="w-fit">
                  <Package className="h-4 w-4 mr-2" />
                  Novo Exame
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome do Exame</TableHead>
                      <TableHead>Código TUSS</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Tags</TableHead>
                      <TableHead>Empresas Usando</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {globalExams.map((exam) => (
                      <TableRow key={exam.id}>
                        <TableCell className="text-card-foreground">{exam.name}</TableCell>
                        <TableCell className="text-card-foreground">{exam.tuss_code}</TableCell>
                        <TableCell className="text-card-foreground">{exam.description}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {exam.tags.map((tag) => (
                              <Badge key={tag} variant="outline">{tag}</Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="text-card-foreground">{exam.companies_using}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-card-foreground">
                  <ClipboardList className="h-5 w-5" />
                  Combos/Checkups Sugeridos
                </CardTitle>
                <CardDescription>
                  Combos padrão que empresas podem importar
                </CardDescription>
                <Button className="w-fit">
                  <Package className="h-4 w-4 mr-2" />
                  Novo Combo
                </Button>
              </CardHeader>
              <CardContent>
                <div className="text-muted-foreground">
                  Interface de combos será implementada na próxima etapa.
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings */}
          <TabsContent value="settings" className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-card-foreground">
                  <Settings className="h-5 w-5" />
                  Configurações da Plataforma
                </CardTitle>
                <CardDescription>
                  Configure parâmetros globais da plataforma
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  <div>
                    <h3 className="font-semibold mb-4 text-card-foreground flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Taxas e Comissões
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-card-foreground">Taxa Fixa (R$)</label>
                        <Input type="number" defaultValue={platformConfig.fixed_fee.toString()} step="0.01" />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-card-foreground">Comissão (%)</label>
                        <Input type="number" defaultValue={platformConfig.commission_percentage.toString()} />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-4 text-card-foreground flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Configurações de E-mail
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-card-foreground">E-mail de Notificações</label>
                        <Input defaultValue={platformConfig.notification_email} />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-card-foreground">E-mail de Suporte</label>
                        <Input defaultValue={platformConfig.support_email} />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-4 text-card-foreground flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Sistema
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                        <div>
                          <p className="font-medium text-card-foreground">Modo Manutenção</p>
                          <p className="text-sm text-muted-foreground">Ativar para bloquear acesso à plataforma</p>
                        </div>
                        <Button variant={platformConfig.maintenance_mode ? "destructive" : "outline"} size="sm">
                          {platformConfig.maintenance_mode ? (
                            <>
                              <Pause className="h-4 w-4 mr-2" />
                              Ativo
                            </>
                          ) : (
                            <>
                              <Play className="h-4 w-4 mr-2" />
                              Inativo
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-4 text-card-foreground flex items-center gap-2">
                      <Database className="h-4 w-4" />
                      Logs e Auditoria
                    </h3>
                    <div className="space-y-4">
                      <Button variant="outline">
                        <Eye className="h-4 w-4 mr-2" />
                        Ver Logs de Acesso
                      </Button>
                      <Button variant="outline">
                        <FileText className="h-4 w-4 mr-2" />
                        Ver Logs de Sistema
                      </Button>
                      <Button variant="outline">
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        Ver Logs de Erro
                      </Button>
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
