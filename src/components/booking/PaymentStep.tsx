
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { 
  CreditCard, 
  Shield, 
  Clock, 
  AlertTriangle, 
  CheckCircle,
  DollarSign
} from 'lucide-react';

interface BookingData {
  services: string[];
  patientId: string;
  locationId: string;
  scheduledDate: Date | undefined;
  scheduledTime: string;
  totalAmount: number;
}

interface PaymentStepProps {
  bookingData: BookingData;
  onPaymentComplete: (orderNumber: string) => void;
}

const PaymentStep = ({ bookingData, onPaymentComplete }: PaymentStepProps) => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  // Mock data - seria substituído por dados reais
  const mockServices = [
    { id: '1', name: 'Hemograma Completo', price: 45.00 },
    { id: '2', name: 'Glicemia em Jejum', price: 25.00 },
    { id: '3', name: 'Consulta Cardiologista', price: 180.00 },
    { id: '4', name: 'Raio-X Tórax', price: 65.00 },
    { id: '5', name: 'Check-up Executivo', price: 350.00 }
  ];

  const mockPatients = [
    { id: 'self', name: 'Eu mesmo' },
    { id: '2', name: 'Maria Silva (Filha)' },
    { id: '3', name: 'José Silva (Pai)' }
  ];

  const mockLocations = [
    { id: '1', name: 'Laboratório Central - Centro', address: 'Rua XV de Novembro, 123' },
    { id: '2', name: 'Lab Central - Vila Madalena', address: 'Rua Harmonia, 456' },
    { id: '3', name: 'Clínica CardioVida - Itaim', address: 'Av. Brigadeiro Faria Lima, 789' },
    { id: '4', name: 'Centro Médico Premium - Moema', address: 'Rua dos Açores, 321' }
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

  const handlePayment = async () => {
    setIsProcessing(true);
    
    try {
      // Simular processamento do pagamento
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Gerar número do pedido
      const orderNumber = `LEV${Date.now().toString().slice(-6)}`;
      
      toast({
        title: "Pagamento processado com sucesso!",
        description: `Pedido #${orderNumber} confirmado.`,
      });
      
      onPaymentComplete(orderNumber);
    } catch (error) {
      toast({
        title: "Erro no pagamento",
        description: "Ocorreu um erro ao processar o pagamento. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const platformFee = 5.00;
  const subtotal = selectedServices.reduce((sum, service) => sum + service.price, 0);
  const totalWithFee = subtotal + platformFee;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Resumo do Pedido</h3>
        <p className="text-muted-foreground">
          Confira os detalhes e finalize o pagamento
        </p>
      </div>

      {/* Resumo detalhado */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Detalhes do pedido */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Serviços Selecionados</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {selectedServices.map((service) => (
                <div key={service.id} className="flex justify-between items-center">
                  <span className="text-sm">{service.name}</span>
                  <span className="font-medium">R$ {service.price.toFixed(2)}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Informações do Agendamento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Paciente:</p>
                <p className="font-medium">{selectedPatient?.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Local:</p>
                <p className="font-medium">{selectedLocation?.name}</p>
                <p className="text-xs text-muted-foreground">{selectedLocation?.address}</p>
              </div>
              {bookingData.scheduledDate && bookingData.scheduledTime && (
                <div>
                  <p className="text-sm text-muted-foreground">Data e Horário:</p>
                  <p className="font-medium">
                    {bookingData.scheduledDate.toLocaleDateString('pt-BR')} às {bookingData.scheduledTime}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Pagamento */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Resumo Financeiro</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Subtotal dos serviços:</span>
                <span>R$ {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Taxa da plataforma:</span>
                <span>R$ {platformFee.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span className="text-primary">R$ {totalWithFee.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Pagamento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-800 mb-1">Pagamento Seguro</h4>
                    <p className="text-sm text-blue-700">
                      Seus dados são protegidos por criptografia SSL. 
                      O pagamento é processado de forma segura.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Cartão de Crédito</span>
                  <Badge variant="secondary" className="ml-auto">Disponível</Badge>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <DollarSign className="h-4 w-4" />
                  <span className="text-sm">Pix</span>
                  <Badge variant="outline" className="ml-auto">Em breve</Badge>
                </div>
              </div>

              <Button 
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full"
                size="lg"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Processando...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4 mr-2" />
                    Pagar R$ {totalWithFee.toFixed(2)}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Políticas importantes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="pt-4">
            <div className="flex items-start gap-2">
              <Clock className="h-5 w-5 text-amber-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-amber-800 mb-1">Política de Cancelamento</h4>
                <p className="text-sm text-amber-700">
                  Cancelamentos gratuitos até 24h antes do agendamento. 
                  Após esse prazo, taxa de 30% do valor total.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-4">
            <div className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-green-800 mb-1">Garantia de Qualidade</h4>
                <p className="text-sm text-green-700">
                  Todos os nossos parceiros são certificados. 
                  Satisfação garantida ou seu dinheiro de volta.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Aviso importante */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-start gap-2">
          <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-red-800 mb-1">Importante:</h4>
            <p className="text-sm text-red-700">
              O pagamento deve ser realizado para confirmar o agendamento. 
              Após a confirmação, você receberá todas as instruções por e-mail.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentStep;
