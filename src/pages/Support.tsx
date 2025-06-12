import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Navigate, useNavigate } from 'react-router-dom';
import { 
  MessageSquare, 
  HelpCircle, 
  FileText, 
  Mail, 
  Phone,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const Support = () => {
  const { user, isLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    subject: '',
    category: '',
    message: '',
    priority: 'media'
  });

  // Mock data para tickets de suporte existentes
  const supportTickets = [
    {
      id: '1',
      subject: 'Problema com agendamento',
      category: 'Agendamento',
      status: 'aberto',
      priority: 'alta',
      created_at: '2024-01-15',
      last_update: '2024-01-15'
    },
    {
      id: '2',
      subject: 'Dúvida sobre resultado',
      category: 'Resultado',
      status: 'respondido',
      priority: 'media',
      created_at: '2024-01-10',
      last_update: '2024-01-12'
    }
  ];

  const faqItems = [
    {
      question: "Como posso agendar um exame?",
      answer: "Para agendar um exame, acesse a seção 'Buscar Serviços' no dashboard, selecione o exame desejado, escolha o local e horário, e finalize o pagamento."
    },
    {
      question: "Quanto tempo leva para receber os resultados?",
      answer: "O prazo varia conforme o tipo de exame. Normalmente, exames laboratoriais ficam prontos em 1-3 dias úteis, enquanto exames de imagem podem levar de 1-7 dias úteis."
    },
    {
      question: "Posso cancelar um agendamento?",
      answer: "Sim, você pode cancelar um agendamento até 24 horas antes da data marcada. O reembolso será processado conforme nossa política de cancelamento."
    },
    {
      question: "Como adiciono um dependente?",
      answer: "Vá em 'Pacientes' no seu dashboard e clique em 'Adicionar Novo Paciente'. Preencha os dados necessários incluindo nome, CPF e data de nascimento."
    },
    {
      question: "Como acesso meus resultados?",
      answer: "Os resultados ficam disponíveis na seção 'Meus Pedidos'. Você receberá uma notificação por e-mail quando estiverem prontos para download."
    },
    {
      question: "Qual é a política de reembolso?",
      answer: "Reembolsos são processados em até 5 dias úteis após o cancelamento, desde que feito dentro do prazo estabelecido. Consulte nossos termos para mais detalhes."
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Aqui seria feita a chamada para a API
      console.log('Enviando ticket de suporte:', formData);
      
      toast({
        title: "Ticket enviado com sucesso!",
        description: "Nossa equipe entrará em contato em breve.",
      });
      
      setFormData({
        subject: '',
        category: '',
        message: '',
        priority: 'media'
      });
    } catch (error) {
      toast({
        title: "Erro ao enviar ticket",
        description: "Ocorreu um erro ao enviar sua solicitação.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      aberto: { label: 'Aberto', variant: 'destructive' as const, icon: AlertCircle },
      respondido: { label: 'Respondido', variant: 'default' as const, icon: CheckCircle },
      fechado: { label: 'Fechado', variant: 'outline' as const, icon: CheckCircle }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.aberto;
    const IconComponent = config.icon;
    
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <IconComponent className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      baixa: { label: 'Baixa', color: 'bg-green-100 text-green-800' },
      media: { label: 'Média', color: 'bg-yellow-100 text-yellow-800' },
      alta: { label: 'Alta', color: 'bg-red-100 text-red-800' }
    };
    
    const config = priorityConfig[priority as keyof typeof priorityConfig] || priorityConfig.media;
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gradient">Central de Suporte</h1>
            <p className="text-sm text-muted-foreground">
              Estamos aqui para ajudar você
            </p>
          </div>
          <Button onClick={() => navigate('/dashboard')}>
            Voltar ao Dashboard
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Abrir Novo Chamado
                </CardTitle>
                <CardDescription>
                  Descreva seu problema ou dúvida detalhadamente
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category">Categoria</Label>
                      <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma categoria" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="agendamento">Agendamento</SelectItem>
                          <SelectItem value="pagamento">Pagamento</SelectItem>
                          <SelectItem value="resultado">Resultado</SelectItem>
                          <SelectItem value="conta">Conta</SelectItem>
                          <SelectItem value="tecnico">Problema Técnico</SelectItem>
                          <SelectItem value="outro">Outro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="priority">Prioridade</Label>
                      <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a prioridade" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="baixa">Baixa</SelectItem>
                          <SelectItem value="media">Média</SelectItem>
                          <SelectItem value="alta">Alta</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="subject">Assunto</Label>
                    <Input
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => handleInputChange('subject', e.target.value)}
                      placeholder="Resuma sua dúvida ou problema"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="message">Mensagem</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      placeholder="Descreva detalhadamente sua dúvida ou problema..."
                      rows={5}
                      required
                    />
                  </div>

                  <Button type="submit">
                    Enviar Chamado
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Existing Tickets */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Meus Chamados
                </CardTitle>
                <CardDescription>
                  Acompanhe o status dos seus chamados
                </CardDescription>
              </CardHeader>
              <CardContent>
                {supportTickets.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Nenhum chamado encontrado</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {supportTickets.map((ticket) => (
                      <div key={ticket.id} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-medium">{ticket.subject}</h4>
                            <p className="text-sm text-muted-foreground">{ticket.category}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            {getPriorityBadge(ticket.priority)}
                            {getStatusBadge(ticket.status)}
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>Criado em {ticket.created_at}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span>Última atualização: {ticket.last_update}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* FAQ */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5" />
                  Perguntas Frequentes
                </CardTitle>
                <CardDescription>
                  Encontre respostas rápidas para dúvidas comuns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {faqItems.map((item, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger>{item.question}</AccordionTrigger>
                      <AccordionContent>
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle>Outros Canais de Contato</CardTitle>
                <CardDescription>
                  Fale conosco por outros meios
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <Mail className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-blue-900">E-mail</p>
                    <p className="text-sm text-blue-700">suporte@leevy.com.br</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <Phone className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium text-green-900">WhatsApp</p>
                    <p className="text-sm text-green-700">(11) 9999-9999</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Support Hours */}
            <Card>
              <CardHeader>
                <CardTitle>Horário de Atendimento</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Segunda a Sexta</span>
                    <span className="font-medium">8h às 18h</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sábado</span>
                    <span className="font-medium">8h às 12h</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Domingo</span>
                    <span className="font-medium">Fechado</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Status */}
            <Card>
              <CardHeader>
                <CardTitle>Status da Plataforma</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Todos os sistemas operacionais</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
