
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Building, MapPin, Clock, Plus, Trash2 } from 'lucide-react';

interface OnboardingData {
  company: {
    trade_name: string;
    legal_name: string;
    cnpj: string;
    address: string;
    phone: string;
    whatsapp: string;
    email: string;
  };
  locations: Array<{
    id: string;
    name: string;
    address: string;
    days: string[];
    hours: { start: string; end: string };
  }>;
  services: Array<{
    id: string;
    name: string;
    description: string;
    type: string;
    price: number;
    delivery_time: string;
    locations: string[];
  }>;
  policies: {
    min_schedule_hours: number;
    min_cancel_hours: number;
    refund_policy: string;
    pix_key: string;
  };
}

interface AdminOnboardingProps {
  onComplete: (data: OnboardingData) => void;
}

const AdminOnboarding: React.FC<AdminOnboardingProps> = ({ onComplete }) => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<OnboardingData>({
    company: {
      trade_name: '',
      legal_name: '',
      cnpj: '',
      address: '',
      phone: '',
      whatsapp: '',
      email: ''
    },
    locations: [],
    services: [],
    policies: {
      min_schedule_hours: 2,
      min_cancel_hours: 24,
      refund_policy: '',
      pix_key: ''
    }
  });

  const weekDays = [
    { value: 'monday', label: 'Segunda-feira' },
    { value: 'tuesday', label: 'Terça-feira' },
    { value: 'wednesday', label: 'Quarta-feira' },
    { value: 'thursday', label: 'Quinta-feira' },
    { value: 'friday', label: 'Sexta-feira' },
    { value: 'saturday', label: 'Sábado' },
    { value: 'sunday', label: 'Domingo' }
  ];

  const addLocation = () => {
    const newLocation = {
      id: Date.now().toString(),
      name: '',
      address: '',
      days: [],
      hours: { start: '08:00', end: '18:00' }
    };
    setFormData(prev => ({
      ...prev,
      locations: [...prev.locations, newLocation]
    }));
  };

  const removeLocation = (id: string) => {
    setFormData(prev => ({
      ...prev,
      locations: prev.locations.filter(loc => loc.id !== id)
    }));
  };

  const updateLocation = (id: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      locations: prev.locations.map(loc =>
        loc.id === id ? { ...loc, [field]: value } : loc
      )
    }));
  };

  const addService = () => {
    const newService = {
      id: Date.now().toString(),
      name: '',
      description: '',
      type: 'exame',
      price: 0,
      delivery_time: '1 dia útil',
      locations: []
    };
    setFormData(prev => ({
      ...prev,
      services: [...prev.services, newService]
    }));
  };

  const removeService = (id: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.filter(service => service.id !== id)
    }));
  };

  const updateService = (id: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.map(service =>
        service.id === id ? { ...service, [field]: value } : service
      )
    }));
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    toast({
      title: "Onboarding concluído!",
      description: "Sua empresa foi configurada com sucesso.",
    });
    onComplete(formData);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.company.trade_name && formData.company.cnpj;
      case 2:
        return formData.locations.length > 0;
      case 3:
        return formData.services.length > 0;
      case 4:
        return formData.policies.pix_key;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gradient">Configuração da Empresa</h1>
          <p className="text-sm text-muted-foreground">Configure sua empresa para começar a receber agendamentos</p>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
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
            <span>Dados da Empresa</span>
            <span>Locais de Atendimento</span>
            <span>Serviços</span>
            <span>Políticas e Pagamento</span>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {currentStep === 1 && <Building className="h-5 w-5" />}
              {currentStep === 2 && <MapPin className="h-5 w-5" />}
              {currentStep === 3 && <Building className="h-5 w-5" />}
              {currentStep === 4 && <Clock className="h-5 w-5" />}
              
              {currentStep === 1 && 'Dados da Empresa'}
              {currentStep === 2 && 'Locais de Atendimento'}
              {currentStep === 3 && 'Serviços Oferecidos'}
              {currentStep === 4 && 'Políticas e Pagamento'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Step 1: Dados da Empresa */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="trade_name">Nome Comercial</Label>
                    <Input
                      id="trade_name"
                      value={formData.company.trade_name}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        company: { ...prev.company, trade_name: e.target.value }
                      }))}
                      placeholder="Nome fantasia da empresa"
                    />
                  </div>
                  <div>
                    <Label htmlFor="legal_name">Razão Social</Label>
                    <Input
                      id="legal_name"
                      value={formData.company.legal_name}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        company: { ...prev.company, legal_name: e.target.value }
                      }))}
                      placeholder="Razão social completa"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cnpj">CNPJ</Label>
                    <Input
                      id="cnpj"
                      value={formData.company.cnpj}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        company: { ...prev.company, cnpj: e.target.value }
                      }))}
                      placeholder="00.000.000/0001-00"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      value={formData.company.phone}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        company: { ...prev.company, phone: e.target.value }
                      }))}
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="address">Endereço da Sede</Label>
                  <Textarea
                    id="address"
                    value={formData.company.address}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      company: { ...prev.company, address: e.target.value }
                    }))}
                    placeholder="Endereço completo da sede"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Locais de Atendimento */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <p className="text-muted-foreground">Configure os pontos de coleta/atendimento</p>
                  <Button onClick={addLocation}>
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Local
                  </Button>
                </div>
                
                {formData.locations.map((location) => (
                  <Card key={location.id} className="p-4">
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium">Local de Atendimento</h4>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeLocation(location.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Nome do Local</Label>
                          <Input
                            value={location.name}
                            onChange={(e) => updateLocation(location.id, 'name', e.target.value)}
                            placeholder="Ex: Matriz Centro"
                          />
                        </div>
                        <div>
                          <Label>Endereço</Label>
                          <Input
                            value={location.address}
                            onChange={(e) => updateLocation(location.id, 'address', e.target.value)}
                            placeholder="Endereço completo"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Horário de Funcionamento</Label>
                          <div className="flex gap-2">
                            <Input
                              type="time"
                              value={location.hours.start}
                              onChange={(e) => updateLocation(location.id, 'hours', { ...location.hours, start: e.target.value })}
                            />
                            <span className="self-center">às</span>
                            <Input
                              type="time"
                              value={location.hours.end}
                              onChange={(e) => updateLocation(location.id, 'hours', { ...location.hours, end: e.target.value })}
                            />
                          </div>
                        </div>
                        <div>
                          <Label>Dias de Funcionamento</Label>
                          <p className="text-xs text-muted-foreground mb-2">Selecione os dias da semana</p>
                          <div className="grid grid-cols-2 gap-1">
                            {weekDays.map((day) => (
                              <label key={day.value} className="flex items-center space-x-2 text-sm">
                                <input
                                  type="checkbox"
                                  checked={location.days.includes(day.value)}
                                  onChange={(e) => {
                                    const newDays = e.target.checked
                                      ? [...location.days, day.value]
                                      : location.days.filter(d => d !== day.value);
                                    updateLocation(location.id, 'days', newDays);
                                  }}
                                />
                                <span>{day.label}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
                
                {formData.locations.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    Adicione pelo menos um local de atendimento
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Serviços */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <p className="text-muted-foreground">Configure os serviços que sua empresa oferece</p>
                  <Button onClick={addService}>
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Serviço
                  </Button>
                </div>
                
                {formData.services.map((service) => (
                  <Card key={service.id} className="p-4">
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium">Serviço</h4>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeService(service.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Nome do Serviço</Label>
                          <Input
                            value={service.name}
                            onChange={(e) => updateService(service.id, 'name', e.target.value)}
                            placeholder="Ex: Hemograma Completo"
                          />
                        </div>
                        <div>
                          <Label>Tipo</Label>
                          <Select
                            value={service.type}
                            onValueChange={(value) => updateService(service.id, 'type', value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="exame">Exame</SelectItem>
                              <SelectItem value="consulta">Consulta</SelectItem>
                              <SelectItem value="checkup">Check-up</SelectItem>
                              <SelectItem value="outro">Outro</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Preço (R$)</Label>
                          <Input
                            type="number"
                            step="0.01"
                            value={service.price}
                            onChange={(e) => updateService(service.id, 'price', parseFloat(e.target.value) || 0)}
                            placeholder="0.00"
                          />
                        </div>
                        <div>
                          <Label>Prazo de Entrega</Label>
                          <Input
                            value={service.delivery_time}
                            onChange={(e) => updateService(service.id, 'delivery_time', e.target.value)}
                            placeholder="Ex: 2 dias úteis"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label>Descrição</Label>
                        <Textarea
                          value={service.description}
                          onChange={(e) => updateService(service.id, 'description', e.target.value)}
                          placeholder="Descrição detalhada do serviço"
                        />
                      </div>
                    </div>
                  </Card>
                ))}
                
                {formData.services.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    Adicione pelo menos um serviço
                  </div>
                )}
              </div>
            )}

            {/* Step 4: Políticas e Pagamento */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-4">Regras de Agendamento</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Tempo mínimo para agendar (horas)</Label>
                      <Input
                        type="number"
                        value={formData.policies.min_schedule_hours}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          policies: { ...prev.policies, min_schedule_hours: parseInt(e.target.value) || 0 }
                        }))}
                      />
                    </div>
                    <div>
                      <Label>Tempo mínimo para cancelar (horas)</Label>
                      <Input
                        type="number"
                        value={formData.policies.min_cancel_hours}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          policies: { ...prev.policies, min_cancel_hours: parseInt(e.target.value) || 0 }
                        }))}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label>Política de Reembolso</Label>
                  <Textarea
                    value={formData.policies.refund_policy}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      policies: { ...prev.policies, refund_policy: e.target.value }
                    }))}
                    placeholder="Descreva sua política de reembolso"
                  />
                </div>

                <div>
                  <h3 className="font-semibold mb-4">Dados para Recebimento</h3>
                  <div>
                    <Label>Chave PIX</Label>
                    <Input
                      value={formData.policies.pix_key}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        policies: { ...prev.policies, pix_key: e.target.value }
                      }))}
                      placeholder="CPF, CNPJ, e-mail ou chave aleatória"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Repasses serão feitos 30 dias após a compra
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation buttons */}
        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={() => currentStep > 1 && setCurrentStep(currentStep - 1)}
            disabled={currentStep === 1}
          >
            Anterior
          </Button>
          <Button
            onClick={handleNext}
            disabled={!canProceed()}
          >
            {currentStep === 4 ? 'Finalizar Configuração' : 'Próximo'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminOnboarding;
