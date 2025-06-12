
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { CalendarDays, MapPin, User, CreditCard } from 'lucide-react';

const BookingFlow = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [selectedPatient, setSelectedPatient] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [currentStep, setCurrentStep] = useState(1);

  // Mock data - seria substituído por dados reais
  const mockService = {
    id: serviceId,
    name: 'Hemograma Completo',
    price: 45.00,
    description: 'Exame de sangue completo para análise geral',
    company_name: 'Laboratório Central',
    requires_scheduling: true
  };

  const mockPatients = [
    { id: '1', name: 'Eu mesmo', cpf: '123.456.789-00' },
    { id: '2', name: 'Maria Silva (Dependente)', cpf: '987.654.321-00' }
  ];

  const mockLocations = [
    { id: '1', name: 'São Paulo - Centro', address: 'Rua XV de Novembro, 123' },
    { id: '2', name: 'São Paulo - Vila Madalena', address: 'Rua Harmonia, 456' }
  ];

  const mockTimeSlots = ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      handleFinishBooking();
    }
  };

  const handleFinishBooking = async () => {
    try {
      // Aqui seria feita a integração com Stripe
      toast({
        title: "Redirecionando para pagamento",
        description: "Você será direcionado para o Stripe para concluir o pagamento.",
      });
      
      // Mock do redirecionamento para Stripe
      setTimeout(() => {
        navigate('/booking-success');
      }, 2000);
    } catch (error) {
      toast({
        title: "Erro no agendamento",
        description: "Ocorreu um erro ao processar seu agendamento.",
        variant: "destructive",
      });
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return selectedPatient !== '';
      case 2:
        return selectedLocation !== '';
      case 3:
        return mockService.requires_scheduling ? selectedDate && selectedTime : true;
      case 4:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gradient">Agendar Serviço</h1>
          <p className="text-sm text-muted-foreground">{mockService.name}</p>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  currentStep >= step
                    ? 'bg-primary text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {step}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            <span>Paciente</span>
            <span>Local</span>
            <span>Agendamento</span>
            <span>Pagamento</span>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {currentStep === 1 && <User className="h-5 w-5" />}
              {currentStep === 2 && <MapPin className="h-5 w-5" />}
              {currentStep === 3 && <CalendarDays className="h-5 w-5" />}
              {currentStep === 4 && <CreditCard className="h-5 w-5" />}
              
              {currentStep === 1 && 'Selecione o Paciente'}
              {currentStep === 2 && 'Escolha o Local'}
              {currentStep === 3 && 'Data e Horário'}
              {currentStep === 4 && 'Resumo e Pagamento'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Step 1: Selecionar Paciente */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <p className="text-muted-foreground">Para quem é este agendamento?</p>
                <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o paciente" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockPatients.map((patient) => (
                      <SelectItem key={patient.id} value={patient.id}>
                        {patient.name} - CPF: {patient.cpf}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/patients/new')}
                  className="w-full"
                >
                  Cadastrar Novo Paciente
                </Button>
              </div>
            )}

            {/* Step 2: Selecionar Local */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <p className="text-muted-foreground">Onde você gostaria de realizar o serviço?</p>
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o local" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockLocations.map((location) => (
                      <SelectItem key={location.id} value={location.id}>
                        {location.name} - {location.address}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Step 3: Data e Horário */}
            {currentStep === 3 && (
              <div className="space-y-4">
                {mockService.requires_scheduling ? (
                  <>
                    <p className="text-muted-foreground">Escolha a data e horário:</p>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={(date) => date < new Date() || date.getDay() === 0}
                      className="rounded-md border"
                    />
                    {selectedDate && (
                      <div>
                        <p className="font-medium mb-2">Horários disponíveis:</p>
                        <div className="grid grid-cols-4 gap-2">
                          {mockTimeSlots.map((time) => (
                            <Button
                              key={time}
                              variant={selectedTime === time ? "default" : "outline"}
                              size="sm"
                              onClick={() => setSelectedTime(time)}
                            >
                              {time}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      Este serviço não requer agendamento específico.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Step 4: Resumo e Pagamento */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-4">Resumo do Agendamento</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Serviço:</span>
                      <span>{mockService.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Paciente:</span>
                      <span>{mockPatients.find(p => p.id === selectedPatient)?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Local:</span>
                      <span>{mockLocations.find(l => l.id === selectedLocation)?.name}</span>
                    </div>
                    {selectedDate && selectedTime && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Data/Hora:</span>
                        <span>
                          {selectedDate.toLocaleDateString('pt-BR')} às {selectedTime}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-lg pt-2 border-t">
                      <span>Total:</span>
                      <span className="text-primary">R$ {mockService.price.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    <strong>Importante:</strong> O pagamento deve ser realizado antes da confirmação do agendamento.
                    Você será redirecionado para o Stripe para concluir o pagamento com segurança.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation buttons */}
        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={() => currentStep > 1 ? setCurrentStep(currentStep - 1) : navigate('/search')}
          >
            {currentStep === 1 ? 'Voltar' : 'Anterior'}
          </Button>
          <Button
            onClick={handleNext}
            disabled={!canProceed()}
          >
            {currentStep === 4 ? 'Pagar e Confirmar' : 'Próximo'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BookingFlow;
