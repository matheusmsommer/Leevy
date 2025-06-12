
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Building2, 
  FileText, 
  Users, 
  DollarSign, 
  Activity, 
  Shield, 
  Settings,
  TrendingUp,
  Eye,
  Lock,
  Trash2,
  Plus,
  Download,
  Search,
  Filter
} from 'lucide-react';

const SuperAdminDashboard = () => {
  const { user, logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - seria substituído por dados reais do Supabase
  const platformStats = {
    totalCompanies: 45,
    totalOrders: 1280,
    totalRevenue: 89750.00,
    commissionsReceived: 8975.00,
    commissionsPending: 2340.00
  };

  const topCompanies = [
    { id: '1', name: 'Laboratório São Paulo', orders: 180, revenue: 12450.00 },
    { id: '2', name: 'Clínica CardioVida', orders: 156, revenue: 11200.00 },
    { id: '3', name: 'Centro Médico Premium', orders: 134, revenue: 9800.00 }
  ];

  const companies = [
    {
      id: '1',
      name: 'Laboratório São Paulo',
      cnpj: '12.345.678/0001-90',
      status: 'ativo',
      locations: 3,
      orders: 180,
      created_at: '2024-01-15'
    },
    {
      id: '2',
      name: 'Clínica CardioVida',
      cnpj: '98.765.432/0001-10',
      status: 'ativo',
      locations: 2,
      orders: 156,
      created_at: '2024-01-20'
    },
    {
      id: '3',
      name: 'Centro Diagnóstico Beta',
      cnpj: '11.222.333/0001-44',
      status: 'pendente',
      locations: 1,
      orders: 0,
      created_at: '2024-02-01'
    }
  ];

  const globalExams = [
    {
      id: '1',
      name: 'Hemograma Completo',
      code: 'HEM001',
      category: 'sangue',
      preparation: 'Jejum de 8 horas',
      description: 'Avaliação completa das células sanguíneas'
    },
    {
      id: '2',
      name: 'Glicemia de Jejum',
      code: 'GLI001',
      category: 'sangue',
      preparation: 'Jejum de 12 horas',
      description: 'Dosagem de glicose no sangue'
    },
    {
      id: '3',
      name: 'Ultrassom Abdome Total',
      code: 'USG001',
      category: 'imagem',
      preparation: 'Bexiga cheia, jejum de 6 horas',
      description: 'Exame de ultrassom do abdome completo'
    }
  ];

  const allOrders = [
    {
      id: '1',
      company: 'Laboratório São Paulo',
      patient: 'João Silva',
      service: 'Hemograma Completo',
      amount: 45.00,
      commission: 4.50,
      date: '2024-02-10',
      status: 'concluido',
      commissionPaid: true
    },
    {
      id: '2',
      company: 'Clínica CardioVida',
      patient: 'Maria Santos',
      service: 'Check-up Cardiológico',
      amount: 280.00,
      commission: 28.00,
      date: '2024-02-09',
      status: 'concluido',
      commissionPaid: false
    }
  ];

  const platformUsers = [
    {
      id: '1',
      name: 'João Silva',
      email: 'joao@email.com',
      totalSpent: 320.00,
      lastAccess: '2024-02-10',
      ordersCount: 5
    },
    {
      id: '2',
      name: 'Maria Santos',
      email: 'maria@email.com',
      totalSpent: 580.00,
      lastAccess: '2024-02-09',
      ordersCount: 8
    }
  ];

  const auditLogs = [
    {
      id: '1',
      action: 'Login',
      user: 'admin@leevy.com',
      target: 'Sistema',
      timestamp: '2024-02-10 09:30:00',
      details: 'Login realizado com sucesso'
    },
    {
      id: '2',
      action: 'Empresa Bloqueada',
      user: 'admin@leevy.com',
      target: 'Laboratório XYZ',
      timestamp: '2024-02-09 14:15:00',
      details: 'Empresa bloqueada por violação dos termos'
    }
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      ativo: { label: 'Ativo', variant: 'default' as const },
      pendente: { label: 'Pendente', variant: 'secondary' as const },
      bloqueado: { label: 'Bloqueado', variant: 'destructive' as const }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.ativo;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const handleViewCompany = (companyId: string) => {
    console.log('Ver detalhes da empresa:', companyId);
  };

  const handleImpersonateCompany = (companyId: string) => {
    console.log('Acessar como admin da empresa:', companyId);
  };

  const handleBlockCompany = (companyId: string) => {
    console.log('Bloquear empresa:', companyId);
  };

  const handleAddExam = () => {
    console.log('Adicionar novo exame global');
  };

  const handleExportOrders = () => {
    console.log('Exportar pedidos para CSV');
  };

  const handleMarkCommissionPaid = (orderId: string) => {
    console.log('Marcar comissão como paga:', orderId);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Painel Leevy - Superadmin</h1>
            <p className="text-sm text-muted-foreground">
              Gestão completa da plataforma
            </p>
          </div>
          <Button variant="outline" onClick={logout}>
            Sair
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="exams">Exames</TabsTrigger>
            <TabsTrigger value="companies">Empresas</TabsTrigger>
            <TabsTrigger value="orders">Vendas</TabsTrigger>
            <TabsTrigger value="users">Usuários</TabsTrigger>
            <TabsTrigger value="audit">Auditoria</TabsTrigger>
            <TabsTrigger value="settings">Config</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
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
          </TabsContent>

          <TabsContent value="exams" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Exames Globais</CardTitle>
                    <CardDescription>Base de exames da plataforma Leevy</CardDescription>
                  </div>
                  <Button onClick={handleAddExam}>
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Exame
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar exames..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Filtros
                  </Button>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Código</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead>Preparo</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {globalExams.map((exam) => (
                      <TableRow key={exam.id}>
                        <TableCell className="font-medium">{exam.name}</TableCell>
                        <TableCell>{exam.code}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {exam.category}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-xs truncate">{exam.preparation}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              Editar
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
          </TabsContent>

          <TabsContent value="companies" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Gestão de Empresas</CardTitle>
                <CardDescription>Laboratórios e clínicas cadastradas</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Empresa</TableHead>
                      <TableHead>CNPJ</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Locais</TableHead>
                      <TableHead>Pedidos</TableHead>
                      <TableHead>Cadastro</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {companies.map((company) => (
                      <TableRow key={company.id}>
                        <TableCell className="font-medium">{company.name}</TableCell>
                        <TableCell>{company.cnpj}</TableCell>
                        <TableCell>{getStatusBadge(company.status)}</TableCell>
                        <TableCell>{company.locations}</TableCell>
                        <TableCell>{company.orders}</TableCell>
                        <TableCell>
                          {new Date(company.created_at).toLocaleDateString('pt-BR')}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleViewCompany(company.id)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleImpersonateCompany(company.id)}
                            >
                              <Shield className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => handleBlockCompany(company.id)}
                            >
                              <Lock className="h-4 w-4" />
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

          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Gestão de Vendas</CardTitle>
                    <CardDescription>Todos os pedidos da plataforma</CardDescription>
                  </div>
                  <Button onClick={handleExportOrders}>
                    <Download className="h-4 w-4 mr-2" />
                    Exportar CSV
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Empresa</TableHead>
                      <TableHead>Paciente</TableHead>
                      <TableHead>Serviço</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Comissão</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.company}</TableCell>
                        <TableCell>{order.patient}</TableCell>
                        <TableCell>{order.service}</TableCell>
                        <TableCell>R$ {order.amount.toFixed(2)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            R$ {order.commission.toFixed(2)}
                            {order.commissionPaid && (
                              <Badge variant="outline" className="text-green-600">
                                Paga
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(order.date).toLocaleDateString('pt-BR')}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4" />
                            </Button>
                            {!order.commissionPaid && (
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleMarkCommissionPaid(order.id)}
                              >
                                Marcar Pago
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
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
          </TabsContent>

          <TabsContent value="audit" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Auditoria e Logs</CardTitle>
                <CardDescription>Histórico de ações administrativas</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ação</TableHead>
                      <TableHead>Usuário</TableHead>
                      <TableHead>Alvo</TableHead>
                      <TableHead>Data/Hora</TableHead>
                      <TableHead>Detalhes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {auditLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="font-medium">{log.action}</TableCell>
                        <TableCell>{log.user}</TableCell>
                        <TableCell>{log.target}</TableCell>
                        <TableCell>{log.timestamp}</TableCell>
                        <TableCell>{log.details}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configurações da Plataforma</CardTitle>
                <CardDescription>Configurações globais do sistema</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Comissões</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Taxa Fixa (R$)</label>
                        <Input type="number" defaultValue="5.00" step="0.01" />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Percentual (%)</label>
                        <Input type="number" defaultValue="10" step="0.1" />
                      </div>
                      <Button>Salvar Comissões</Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Cadastros</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span>Cadastro automático de empresas</span>
                        <Button variant="outline" size="sm">Ativado</Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Validação manual de CNPJ</span>
                        <Button variant="outline" size="sm">Desativado</Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Pagamentos</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Provedor Principal</label>
                        <Input defaultValue="Stripe" readOnly />
                      </div>
                      <div>
                        <label className="text-sm font-medium">PIX Ativo</label>
                        <Button variant="outline" size="sm">Sim</Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Mensagens Globais</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <textarea 
                        className="w-full p-2 border rounded" 
                        rows={3}
                        placeholder="Mensagem para exibir no topo do sistema..."
                      />
                      <Button>Atualizar Mensagem</Button>
                    </CardContent>
                  </Card>
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
