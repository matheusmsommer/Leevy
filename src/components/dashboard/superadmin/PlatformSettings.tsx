
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const PlatformSettings = () => {
  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="text-foreground">Configurações da Plataforma</CardTitle>
        <CardDescription className="text-muted-foreground">
          Configurações globais do sistema
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-lg text-foreground">Comissões</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fixed-fee" className="text-sm font-medium text-foreground">
                  Taxa Fixa (R$)
                </Label>
                <Input 
                  id="fixed-fee"
                  type="number" 
                  defaultValue="5.00" 
                  step="0.01" 
                  className="border-border focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="percentage" className="text-sm font-medium text-foreground">
                  Percentual (%)
                </Label>
                <Input 
                  id="percentage"
                  type="number" 
                  defaultValue="10" 
                  step="0.1" 
                  className="border-border focus:ring-2 focus:ring-primary"
                />
              </div>
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                Salvar Comissões
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-lg text-foreground">Cadastros</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-border">
                <span className="text-foreground">Cadastro automático de empresas</span>
                <Button variant="outline" size="sm" className="border-border bg-green-50 text-green-700 hover:bg-green-100">
                  Ativado
                </Button>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-border">
                <span className="text-foreground">Validação manual de CNPJ</span>
                <Button variant="outline" size="sm" className="border-border bg-red-50 text-red-700 hover:bg-red-100">
                  Desativado
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-lg text-foreground">Pagamentos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="payment-provider" className="text-sm font-medium text-foreground">
                  Provedor Principal
                </Label>
                <Input 
                  id="payment-provider"
                  defaultValue="Stripe" 
                  readOnly 
                  className="border-border bg-muted/50"
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium text-foreground">PIX Ativo</Label>
                <Button variant="outline" size="sm" className="border-border bg-green-50 text-green-700 hover:bg-green-100">
                  Sim
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-lg text-foreground">Mensagens Globais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="global-message" className="text-sm font-medium text-foreground">
                  Mensagem do Sistema
                </Label>
                <textarea 
                  id="global-message"
                  className="w-full p-3 border border-border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground" 
                  rows={3}
                  placeholder="Mensagem para exibir no topo do sistema..."
                />
              </div>
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                Atualizar Mensagem
              </Button>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlatformSettings;
