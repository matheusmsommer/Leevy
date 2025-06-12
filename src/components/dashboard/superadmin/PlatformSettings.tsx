
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const PlatformSettings = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações da Plataforma</CardTitle>
        <CardDescription>Configurações globais do sistema</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Comissões</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Taxa Fixa (R$)</label>
                <Input type="number" defaultValue="5.00" step="0.01" />
              </div>
              <div>
                <label className="text-sm font-medium">Percentual (%)</label>
                <Input type="number" defaultValue="10" step="0.1" />
              </div>
              <Button>Salvar Comissões</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Cadastros</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Cadastro automático de empresas</span>
                <Button variant="outline" size="sm">Ativado</Button>
              </div>
              <div className="flex items-center justify-between">
                <span>Validação manual de CNPJ</span>
                <Button variant="outline" size="sm">Desativado</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Pagamentos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Provedor Principal</label>
                <Input defaultValue="Stripe" readOnly />
              </div>
              <div>
                <label className="text-sm font-medium">PIX Ativo</label>
                <Button variant="outline" size="sm">Sim</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Mensagens Globais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <textarea 
                className="w-full p-2 border rounded" 
                rows={3}
                placeholder="Mensagem para exibir no topo do sistema..."
              />
              <Button>Atualizar Mensagem</Button>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlatformSettings;
