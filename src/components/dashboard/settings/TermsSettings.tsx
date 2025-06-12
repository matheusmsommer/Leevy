
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FileText, Save } from 'lucide-react';

interface TermsSettingsProps {
  companyId: string;
}

const TermsSettings: React.FC<TermsSettingsProps> = ({ companyId }) => {
  const [terms, setTerms] = useState({
    examPreparation: '',
    cancellationRules: '',
    reschedulingRules: '',
    additionalInfo: ''
  });

  const handleSave = () => {
    console.log('Salvando termos e preparos:', terms);
    // TODO: Implementar salvamento
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Termos e Preparos
        </CardTitle>
        <CardDescription>
          Configure textos padrão exibidos aos clientes durante o agendamento
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="exam-preparation">Instruções de Preparo para Exames</Label>
          <Textarea
            id="exam-preparation"
            value={terms.examPreparation}
            onChange={(e) => setTerms({ ...terms, examPreparation: e.target.value })}
            placeholder="Ex: Jejum de 12 horas para exames de sangue..."
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="cancellation-rules">Regras de Cancelamento</Label>
          <Textarea
            id="cancellation-rules"
            value={terms.cancellationRules}
            onChange={(e) => setTerms({ ...terms, cancellationRules: e.target.value })}
            placeholder="Ex: Cancelamento gratuito até 24h antes do agendamento..."
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="rescheduling-rules">Regras de Reagendamento</Label>
          <Textarea
            id="rescheduling-rules"
            value={terms.reschedulingRules}
            onChange={(e) => setTerms({ ...terms, reschedulingRules: e.target.value })}
            placeholder="Ex: Reagendamento permitido até 2 horas antes..."
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="additional-info">Informações Adicionais</Label>
          <Textarea
            id="additional-info"
            value={terms.additionalInfo}
            onChange={(e) => setTerms({ ...terms, additionalInfo: e.target.value })}
            placeholder="Outras informações importantes para os clientes..."
            rows={4}
          />
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Salvar Termos
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TermsSettings;
