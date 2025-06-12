
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Search, User, MapPin, Calendar, CreditCard, CheckCircle } from 'lucide-react';
import ServiceSelection from '@/components/booking/ServiceSelection';
import PatientSelection from '@/components/booking/PatientSelection';
import LocationSelection from '@/components/booking/LocationSelection';
import SchedulingStep from '@/components/booking/SchedulingStep';
import PaymentStep from '@/components/booking/PaymentStep';
import ConfirmationStep from '@/components/booking/ConfirmationStep';

const BookingFlow = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    services: serviceId ? [serviceId] : [],
    patientId: '',
    locationId: '',
    scheduledDate: undefined as Date | undefined,
    scheduledTime: '',
    totalAmount: 0,
    orderNumber: ''
  });

  const steps = [
    { number: 1, title: 'Serviços', icon: Search },
    { number: 2, title: 'Paciente', icon: User },
    { number: 3, title: 'Local', icon: MapPin },
    { number: 4, title: 'Agendamento', icon: Calendar },
    { number: 5, title: 'Pagamento', icon: CreditCard },
    { number: 6, title: 'Confirmação', icon: CheckCircle }
  ];

  const handleNext = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate('/search');
    }
  };

  const updateBookingData = (data: Partial<typeof bookingData>) => {
    setBookingData(prev => ({ ...prev, ...data }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return bookingData.services.length > 0;
      case 2:
        return bookingData.patientId !== '';
      case 3:
        return bookingData.locationId !== '';
      case 4:
        return true; // Some services may not require scheduling
      case 5:
        return bookingData.totalAmount > 0;
      case 6:
        return bookingData.orderNumber !== '';
      default:
        return false;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <ServiceSelection
            selectedServices={bookingData.services}
            onServicesChange={(services) => updateBookingData({ services })}
            onTotalChange={(totalAmount) => updateBookingData({ totalAmount })}
          />
        );
      case 2:
        return (
          <PatientSelection
            selectedPatientId={bookingData.patientId}
            onPatientChange={(patientId) => updateBookingData({ patientId })}
          />
        );
      case 3:
        return (
          <LocationSelection
            selectedLocationId={bookingData.locationId}
            onLocationChange={(locationId) => updateBookingData({ locationId })}
            services={bookingData.services}
          />
        );
      case 4:
        return (
          <SchedulingStep
            selectedDate={bookingData.scheduledDate}
            selectedTime={bookingData.scheduledTime}
            onDateChange={(scheduledDate) => updateBookingData({ scheduledDate })}
            onTimeChange={(scheduledTime) => updateBookingData({ scheduledTime })}
            locationId={bookingData.locationId}
          />
        );
      case 5:
        return (
          <PaymentStep
            bookingData={bookingData}
            onPaymentComplete={(orderNumber) => {
              updateBookingData({ orderNumber });
              setCurrentStep(6);
            }}
          />
        );
      case 6:
        return (
          <ConfirmationStep
            bookingData={bookingData}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gradient">Agendar Serviços</h1>
          <p className="text-sm text-muted-foreground">
            {currentStep === 6 ? 'Pedido confirmado!' : 'Complete as etapas para finalizar seu agendamento'}
          </p>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step) => {
              const IconComponent = step.icon;
              return (
                <div key={step.number} className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                      currentStep >= step.number
                        ? 'bg-primary text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    <IconComponent className="h-5 w-5" />
                  </div>
                  <span className="text-xs mt-2 text-center">{step.title}</span>
                </div>
              );
            })}
          </div>
          <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 6) * 100}%` }}
            />
          </div>
        </div>

        {/* Step content */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {React.createElement(steps[currentStep - 1].icon, { className: "h-5 w-5" })}
              {steps[currentStep - 1].title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {renderStepContent()}
          </CardContent>
        </Card>

        {/* Navigation buttons */}
        {currentStep < 6 && (
          <div className="flex justify-between">
            <Button variant="outline" onClick={handlePrevious}>
              {currentStep === 1 ? 'Voltar à Busca' : 'Anterior'}
            </Button>
            <Button onClick={handleNext} disabled={!canProceed()}>
              {currentStep === 5 ? 'Finalizar Pedido' : 'Próximo'}
            </Button>
          </div>
        )}

        {/* Confirmation step navigation */}
        {currentStep === 6 && (
          <div className="flex justify-center gap-4">
            <Button onClick={() => navigate('/orders')}>
              Ver Meus Pedidos
            </Button>
            <Button variant="outline" onClick={() => navigate('/dashboard')}>
              Voltar ao Início
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingFlow;
