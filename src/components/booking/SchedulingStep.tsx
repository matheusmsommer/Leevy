
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Clock, Calendar as CalendarIcon, Info } from 'lucide-react';

interface SchedulingStepProps {
  selectedDate: Date | undefined;
  selectedTime: string;
  onDateChange: (date: Date | undefined) => void;
  onTimeChange: (time: string) => void;
  locationId: string;
}

const SchedulingStep = ({ 
  selectedDate, 
  selectedTime, 
  onDateChange, 
  onTimeChange, 
  locationId 
}: SchedulingStepProps) => {
  // Mock data - seria substituído por dados reais baseados no local
  const mockLocationScheduling = {
    '1': {
      requiresScheduling: true,
      availableDays: [1, 2, 3, 4, 5], // Segunda a sexta
      availableHours: ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
      minAdvanceHours: 2
    },
    '2': {
      requiresScheduling: true,
      availableDays: [1, 2, 3, 4, 5, 6], // Segunda a sábado
      availableHours: ['07:00', '08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'],
      minAdvanceHours: 2
    },
    '3': {
      requiresScheduling: true,
      availableDays: [1, 2, 3, 4, 5],
      availableHours: ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'],
      minAdvanceHours: 24
    },
    '4': {
      requiresScheduling: false,
      availableDays: [1, 2, 3, 4, 5, 6],
      availableHours: ['08:00', '18:00'], // Horário de funcionamento
      minAdvanceHours: 0
    }
  };

  const locationConfig = mockLocationScheduling[locationId as keyof typeof mockLocationScheduling] || {
    requiresScheduling: false,
    availableDays: [1, 2, 3, 4, 5],
    availableHours: ['08:00', '18:00'],
    minAdvanceHours: 0
  };

  const isDateAvailable = (date: Date) => {
    const today = new Date();
    const minDate = new Date(today.getTime() + locationConfig.minAdvanceHours * 60 * 60 * 1000);
    
    // Verificar se a data é no futuro (considerando o tempo mínimo de antecedência)
    if (date < minDate) return false;
    
    // Verificar se o dia da semana está disponível
    const dayOfWeek = date.getDay();
    return locationConfig.availableDays.includes(dayOfWeek);
  };

  const formatAdvanceTime = (hours: number) => {
    if (hours < 24) {
      return `${hours} hora${hours !== 1 ? 's' : ''}`;
    } else {
      const days = Math.floor(hours / 24);
      return `${days} dia${days !== 1 ? 's' : ''}`;
    }
  };

  if (!locationConfig.requiresScheduling) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Agendamento não necessário</h3>
          <p className="text-muted-foreground mb-4">
            Para este local, você pode comparecer diretamente sem agendamento prévio.
          </p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 max-w-md mx-auto">
            <h4 className="font-medium text-green-800 mb-2">Horário de funcionamento:</h4>
            <p className="text-sm text-green-700">
              Segunda a sábado: {locationConfig.availableHours[0]} às {locationConfig.availableHours[1]}
            </p>
          </div>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <Info className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-800 mb-1">Orientações importantes:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Compareça no horário de funcionamento</li>
                <li>• Leve um documento com foto</li>
                <li>• Chegue com 15 minutos de antecedência</li>
                <li>• Siga as orientações de preparo, se houver</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Escolha a Data e Horário</h3>
        <p className="text-muted-foreground">
          Selecione quando você gostaria de realizar os serviços
        </p>
      </div>

      {/* Informações sobre agendamento */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-start gap-2">
          <CalendarIcon className="h-5 w-5 text-amber-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-amber-800 mb-1">Política de agendamento:</h4>
            <p className="text-sm text-amber-700">
              Agendamento deve ser feito com pelo menos{' '}
              <strong>{formatAdvanceTime(locationConfig.minAdvanceHours)}</strong> de antecedência.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calendário */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Escolha a Data</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={onDateChange}
              disabled={(date) => !isDateAvailable(date)}
              className="rounded-md border w-full"
            />
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 bg-primary rounded" />
                <span>Data selecionada</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 bg-muted rounded" />
                <span>Data indisponível</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Horários */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Escolha o Horário</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedDate ? (
              <div>
                <p className="text-sm text-muted-foreground mb-4">
                  Horários disponíveis para{' '}
                  <strong>{selectedDate.toLocaleDateString('pt-BR')}</strong>:
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {locationConfig.availableHours.map((time) => (
                    <Button
                      key={time}
                      variant={selectedTime === time ? "default" : "outline"}
                      size="sm"
                      onClick={() => onTimeChange(time)}
                      className="justify-center"
                    >
                      {time}
                    </Button>
                  ))}
                </div>
                {selectedTime && (
                  <div className="mt-4 p-3 bg-primary/5 rounded-lg">
                    <p className="text-sm">
                      <strong>Agendamento selecionado:</strong><br />
                      {selectedDate.toLocaleDateString('pt-BR')} às {selectedTime}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <CalendarIcon className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  Selecione uma data para ver os horários disponíveis
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Resumo do agendamento */}
      {selectedDate && selectedTime && (
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              <h4 className="font-medium">Agendamento Confirmado</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              Data: <strong>{selectedDate.toLocaleDateString('pt-BR')}</strong><br />
              Horário: <strong>{selectedTime}</strong>
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

const CheckCircle = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

export default SchedulingStep;
