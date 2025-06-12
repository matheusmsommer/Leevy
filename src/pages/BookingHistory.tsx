
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, FileText, Clock, DollarSign, User, Activity } from 'lucide-react';

const BookingHistory = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  // Mock data - seria substituído por dados reais
  const mockBookings = [
    {
      id: '1',
      service_name: 'Hemograma Completo',
      patient_name: 'João Silva',
      company_name: 'Laboratório Central',
      location_name: 'São Paulo - Centro',
      scheduled_date: '2024-01-15',
      scheduled_time: '09:00',
      status: 'confirmado' as const,
      payment_status: 'aprovado' as const,
      amount: 45.00,
      created_at: '2024-01-10'
    },
    {
      id: '2',
      service_name: 'Consulta Cardiologista',
      patient_name: 'Maria Silva',
      company_name: 'Clínica CardioVida',
      location_name: 'São Paulo - Itaim',
      scheduled_date: '2024-01-20',
      scheduled_time: '14:30',
      status: 'realizado' as const,
      payment_status: 'aprovado' as const,
      amount: 180.00,
      created_at: '2024-01-12'
    },
    {
      id: '3',
      service_name: 'Check-up Executivo',
      patient_name: 'João Silva',
      company_name: 'Centro Médico Premium',
      location_name: 'São Paulo - Faria Lima',
      scheduled_date: '2024-01-25',
      scheduled_time: '08:00',
      status: 'resultado_disponivel' as const,
      payment_status: 'aprovado' as const,
      amount: 350.00,
      created_at: '2024-01-15'
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pendente_pagamento: { label: 'Pendente Pagamento', variant: 'secondary' as const },
      confirmado: { label: 'Confirmado', variant: 'default' as const },
      realizado: { label: 'Realizado', variant: 'outline' as const },
      resultado_disponivel: { label: 'Resultado Disponível', variant: 'destructive' as const }
    };
    
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.confirmado;
  };

  const getPaymentStatusBadge = (status: string) => {
    const statusConfig = {
      pendente: { label: 'Pendente', variant: 'secondary' as const },
      aprovado: { label: 'Aprovado', variant: 'default' as const },
      rejeitado: { label: 'Rejeitado', variant: 'destructive' as const }
    };
    
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.pendente;
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Histórico de Agendamentos</h1>
            <p className="text-sm text-muted-foreground">
              Acompanhe todos os seus agendamentos e resultados
            </p>
          </div>
          <Button onClick={() => navigate('/dashboard')} variant="outline">
            Voltar ao Dashboard
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {mockBookings.length === 0 ? (
          <Card className="bg-card border-border">
            <CardContent className="py-8 text-center">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Nenhum agendamento encontrado</p>
              <p className="text-sm text-muted-foreground mb-4">
                Faça seu primeiro agendamento para ver o histórico aqui
              </p>
              <Button onClick={() => navigate('/search')}>
                Buscar Serviços
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {mockBookings.map((booking) => {
              const statusBadge = getStatusBadge(booking.status);
              const paymentBadge = getPaymentStatusBadge(booking.payment_status);
              
              return (
                <Card key={booking.id} className="bg-card border-border">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg text-card-foreground flex items-center gap-2">
                          <Activity className="h-5 w-5 text-primary" />
                          {booking.service_name}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {booking.company_name}
                        </p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Badge variant={statusBadge.variant}>
                          {statusBadge.label}
                        </Badge>
                        <Badge variant={paymentBadge.variant}>
                          Pagamento: {paymentBadge.label}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="text-foreground">Paciente: {booking.patient_name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="text-foreground">{booking.location_name}</span>
                        </div>
                        {booking.scheduled_date && booking.scheduled_time && (
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-foreground">
                              {new Date(booking.scheduled_date).toLocaleDateString('pt-BR')} às {booking.scheduled_time}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium text-foreground">R$ {booking.amount.toFixed(2)}</span>
                        </div>
                        <div className="text-sm text-muted-foreground flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          Agendado em: {new Date(booking.created_at).toLocaleDateString('pt-BR')}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {booking.status === 'resultado_disponivel' && (
                        <Button size="sm" variant="outline">
                          <FileText className="h-4 w-4 mr-2" />
                          Ver Resultado
                        </Button>
                      )}
                      <Button size="sm" variant="outline">
                        Ver Detalhes
                      </Button>
                      {booking.status === 'confirmado' && (
                        <Button size="sm" variant="outline">
                          Reagendar
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingHistory;
