
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { User, MapPin, Calendar, CreditCard } from 'lucide-react';
import ServiceSelection from '@/components/booking/ServiceSelection';
import PatientSelection from '@/components/booking/PatientSelection';
import LocationSelection from '@/components/booking/LocationSelection';
import SchedulingStep from '@/components/booking/SchedulingStep';
import PaymentStep from '@/components/booking/PaymentStep';

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
    { number: 1, title: 'Exames', icon: User },
    { number: 2, title: 'Local', icon: MapPin },
    { number: 3, title: 'Data', icon: Calendar },
    { number: 4, title: 'Pagamento', icon: CreditCard }
  ];

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      // Finalizar pedido
      const orderNumber = `LEE${Date.now()}`;
      setBookingData(prev => ({ ...prev, orderNumber }));
      navigate('/booking-success');
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
        return bookingData.locationId !== '';
      case 3:
        return bookingData.scheduledDate !== undefined;
      case 4:
        return bookingData.totalAmount > 0;
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
          <LocationSelection
            selectedLocationId={bookingData.locationId}
            onLocationChange={(locationId) => updateBookingData({ locationId })}
            services={bookingData.services}
          />
        );
      case 3:
        return (
          <SchedulingStep
            selectedDate={bookingData.scheduledDate}
            selectedTime={bookingData.scheduledTime}
            onDateChange={(scheduledDate) => updateBookingData({ scheduledDate })}
            onTimeChange={(scheduledTime) => updateBookingData({ scheduledTime })}
            locationId={bookingData.locationId}
          />
        );
      case 4:
        return (
          <PaymentStep
            bookingData={bookingData}
            onPaymentComplete={(orderNumber) => {
              updateBookingData({ orderNumber });
              navigate('/booking-success');
            }}
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
          <h1 className="text-xl font-bold">Agendar Exames</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-3xl">
        {/* Progress simplificado */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            {steps.map((step) => {
              const IconComponent = step.icon;
              return (
                <div key={step.number} className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      currentStep >= step.number
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    <IconComponent className="h-4 w-4" />
                  </div>
                  <span className="text-xs mt-1">{step.title}</span>
                </div>
              );
            })}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1">
            <div
              className="bg-blue-600 h-1 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Conteúdo da etapa */}
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

        {/* Navegação simplificada */}
        <div className="flex justify-between">
          <Button variant="outline" onClick={handlePrevious}>
            {currentStep === 1 ? 'Voltar' : 'Anterior'}
          </Button>
          <Button onClick={handleNext} disabled={!canProceed()}>
            {currentStep === 4 ? 'Finalizar' : 'Próximo'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BookingFlow;
