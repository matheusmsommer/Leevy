
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Calendar, Mail, Home } from 'lucide-react';

const BookingSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-600">
              Agendamento Confirmado!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground">
              Seu agendamento foi confirmado com sucesso. O pagamento foi processado e você receberá as instruções por e-mail.
            </p>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-800 mb-2">Próximos passos:</h3>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Verifique seu e-mail para confirmação e instruções</li>
                <li>• Se necessário, prepare-se seguindo as orientações pré-exame</li>
                <li>• Compareça no local e horário agendados</li>
                <li>• Acompanhe o status no seu painel</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={() => navigate('/bookings')} className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Ver Meus Agendamentos
              </Button>
              <Button variant="outline" onClick={() => navigate('/dashboard')} className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Voltar ao Dashboard
              </Button>
            </div>

            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">
                Precisa de ajuda?
              </p>
              <Button variant="link" size="sm">
                <Mail className="h-4 w-4 mr-2" />
                Entrar em contato
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BookingSuccess;
