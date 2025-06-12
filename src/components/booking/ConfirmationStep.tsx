
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle, 
  Calendar, 
  Mail, 
  Download, 
  Clock,
  MapPin,
  User,
  Phone,
  MessageSquare
} from 'lucide-react';

interface BookingData {
  services: string[];
  patientId: string;
  locationId: string;
  scheduledDate: Date | undefined;
  scheduledTime: string;
  totalAmount: number;
  orderNumber: string;
}

interface ConfirmationStepProps {
  bookingData: BookingData;
}

const ConfirmationStep = ({ bookingData }: ConfirmationStepProps) => {
  const navigate = useNavigate();

  // Mock data - seria substituído por dados reais
  const mockServices = [
    { id: '1', name: 'Hemograma Completo', price: 45.00, instructions: 'Jejum de 12 horas' },
    { id: '2', name: 'Glicemia em Jejum', price: 25.00, instructions: 'Jejum de 8 horas' },
    { id: '3', name: 'Consulta Cardiologista', price: 180.00, instructions: 'Levar exames anteriores' },
    { id: '4', name: 'Raio-X Tórax', price: 65.00, instructions: 'Remover objetos metálicos' },
    { id: '5', name: 'Check-up Executivo', price: 350.00, instructions: 'Jejum de 12 horas' }
  ];

  const mockPatients = [
    { id: 'self', name: 'João Silva', cpf: '123.456.789-00' },
    { id: '2', name: 'Maria Silva (Filha)', cpf: '987.654.321-00' },
    { id: '3', name: 'José Silva (Pai)', cpf: '111.222.333-44' }
  ];

  const mockLocations = [
    { 
      id: '1', 
      name: 'Laboratório Central - Centro', 
      address: 'Rua XV de Novembro, 123 - Centro',
      phone: '(11) 3333-4444',
      whatsapp: '(11) 99999-8888'
    },
    { 
      id: '2', 
      name: 'Lab Central - Vila Madalena', 
      address: 'Rua Harmonia, 456 - Vila Madalena',
      phone: '(11) 3333-4445',
      whatsapp: '(11) 99999-8889'
    },
    { 
      id: '3', 
      name: 'Clínica CardioVida - Itaim', 
      address: 'Av. Brigadeiro Faria Lima, 789 - Itaim',
      phone: '(11) 3333-4446',
      whatsapp: '(11) 99999-8890'
    },
    { 
      id: '4', 
      name: 'Centro Médico Premium - Moema', 
      address: 'Rua dos Açores, 321 - Moema',
      phone: '(11) 3333-4447',
      whatsapp: '(11) 99999-8891'
    }
  ];

  const selectedServices = mockServices.filter(service => 
    bookingData.services.includes(service.id)
  );
  
  const selectedPatient = mockPatients.find(patient => 
    patient.id === bookingData.patientId
  );
  
  const selectedLocation = mockLocations.find(location => 
    location.id === bookingData.locationId
  );

  const hasSpecialInstructions = selectedServices.some(service => service.instructions);

  return (
    <div className="space-y-6">
      {/* Header de confirmação */}
      <div className="text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-green-600 mb-2">
          Pedido Confirmado!
        </h2>
        <p className="text-muted-foreground mb-4">
          Seu agendamento foi realizado com sucesso
        </p>
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full">
          <span className="font-mono font-bold">#{bookingData.orderNumber}</span>
        </div>
      </div>

      {/* Resumo do agendamento */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Detalhes do Agendamento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Paciente:</span>
              </div>
              <p className="font-medium">{selectedPatient?.name}</p>
              <p className="text-sm text-muted-foreground">CPF: {selectedPatient?.cpf}</p>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Local:</span>
              </div>
              <p className="font-medium">{selectedLocation?.name}</p>
              <p className="text-sm text-muted-foreground">{selectedLocation?.address}</p>
            </div>

            {bookingData.scheduledDate && bookingData.scheduledTime ? (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Data e Horário:</span>
                </div>
                <p className="font-medium">
                  {bookingData.scheduledDate.toLocaleDateString('pt-BR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
                <p className="text-primary font-medium">{bookingData.scheduledTime}</p>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Agendamento:</span>
                </div>
                <Badge variant="secondary">Não necessário</Badge>
                <p className="text-sm text-muted-foreground mt-1">
                  Compareça diretamente no local
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Serviços Contratados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {selectedServices.map((service) => (
                <div key={service.id} className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{service.name}</p>
                    {service.instructions && (
                      <p className="text-xs text-muted-foreground mt-1">
                        ⚠️ {service.instructions}
                      </p>
                    )}
                  </div>
                  <span className="font-medium text-sm">R$ {service.price.toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t pt-3">
                <div className="flex justify-between items-center font-bold">
                  <span>Total Pago:</span>
                  <span className="text-primary">R$ {bookingData.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Próximos passos */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-base text-blue-800">📋 Próximos Passos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <Mail className="h-4 w-4 text-blue-600 mt-0.5" />
              <p className="text-blue-700">
                <strong>1. Confirmação por e-mail:</strong> Verifique sua caixa de entrada para receber 
                a confirmação com todos os detalhes do agendamento.
              </p>
            </div>
            
            {hasSpecialInstructions && (
              <div className="flex items-start gap-2">
                <Clock className="h-4 w-4 text-blue-600 mt-0.5" />
                <p className="text-blue-700">
                  <strong>2. Prepare-se:</strong> Alguns exames requerem preparo especial. 
                  Verifique as instruções específicas de cada serviço.
                </p>
              </div>
            )}
            
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-blue-600 mt-0.5" />
              <p className="text-blue-700">
                <strong>3. Compareça no local:</strong> Chegue com 15 minutos de antecedência 
                levando um documento com foto.
              </p>
            </div>
            
            <div className="flex items-start gap-2">
              <Download className="h-4 w-4 text-blue-600 mt-0.5" />
              <p className="text-blue-700">
                <strong>4. Resultados:</strong> Acompanhe o status no seu painel e baixe 
                os resultados quando estiverem disponíveis.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Instruções especiais */}
      {hasSpecialInstructions && (
        <Card className="bg-amber-50 border-amber-200">
          <CardHeader>
            <CardTitle className="text-base text-amber-800">⚠️ Instruções de Preparo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {selectedServices.filter(service => service.instructions).map((service) => (
                <div key={service.id} className="text-sm">
                  <span className="font-medium text-amber-800">{service.name}:</span>
                  <span className="text-amber-700 ml-2">{service.instructions}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Contato do local */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">📞 Contato do Local</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Telefone:</span>
              <a href={`tel:${selectedLocation?.phone}`} className="text-primary font-medium">
                {selectedLocation?.phone}
              </a>
            </div>
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">WhatsApp:</span>
              <a 
                href={`https://wa.me/${selectedLocation?.whatsapp?.replace(/\D/g, '')}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary font-medium"
              >
                {selectedLocation?.whatsapp}
              </a>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ações finais */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button onClick={() => navigate('/orders')} className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Ver Meus Pedidos
        </Button>
        <Button variant="outline" onClick={() => navigate('/dashboard')} className="flex items-center gap-2">
          <CheckCircle className="h-4 w-4" />
          Voltar ao Dashboard
        </Button>
        <Button variant="outline" onClick={() => navigate('/search')} className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Fazer Novo Agendamento
        </Button>
      </div>

      {/* Suporte */}
      <div className="text-center">
        <p className="text-sm text-muted-foreground mb-2">
          Precisa de ajuda ou tem alguma dúvida?
        </p>
        <Button variant="link" onClick={() => navigate('/support')}>
          <Mail className="h-4 w-4 mr-2" />
          Entrar em contato com o suporte
        </Button>
      </div>
    </div>
  );
};

export default ConfirmationStep;
