
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings, DollarSign, CreditCard, MessageSquare, UserPlus } from 'lucide-react';

const PlatformSettings = () => {
  return (
    <Card className="border-border shadow-sm">
      <CardHeader className="pb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Settings className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl font-semibold text-foreground">Configurações da Plataforma</CardTitle>
            <CardDescription className="text-muted-foreground">
              Configurações globais do sistema
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-border bg-gradient-to-br from-background to-muted/20">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg text-foreground flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                Comissões
              </CardTitle>
              <CardDescription>Configure as taxas da plataforma</CardDescription>
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
                  className="border-border focus:ring-2 focus:ring-primary/20"
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
                  className="border-border focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm">
                Salvar Comissões
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border bg-gradient-to-br from-background to-muted/20">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg text-foreground flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-primary" />
                Cadastros
              </CardTitle>
              <CardDescription>Controle de novos cadastros</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg border border-primary/20">
                <span className="text-foreground font-medium">Cadastro automático de empresas</span>
                <Button variant="outline" size="sm" className="border-primary/20 bg-primary/10 text-primary hover:bg-primary/20">
                  Ativado
                </Button>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border">
                <span className="text-foreground font-medium">Validação manual de CNPJ</span>
                <Button variant="outline" size="sm" className="border-destructive/20 bg-destructive/10 text-destructive hover:bg-destructive/20">
                  Desativado
                </Button>
              </div>
              <Button className="w-full" variant="outline">
                Atualizar Configurações
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border bg-gradient-to-br from-background to-muted/20">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg text-foreground flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                Pagamentos
              </CardTitle>
              <CardDescription>Configurações de pagamento</CardDescription>
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
              <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg border border-primary/20">
                <Label className="text-foreground font-medium">PIX Ativo</Label>
                <Button variant="outline" size="sm" className="border-primary/20 bg-primary/10 text-primary hover:bg-primary/20">
                  Sim
                </Button>
              </div>
              <Button className="w-full" variant="outline">
                Configurar Pagamentos
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border bg-gradient-to-br from-background to-muted/20">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg text-foreground flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                Mensagens Globais
              </CardTitle>
              <CardDescription>Comunicados do sistema</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="global-message" className="text-sm font-medium text-foreground">
                  Mensagem do Sistema
                </Label>
                <textarea 
                  id="global-message"
                  className="w-full p-3 border border-border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 bg-background text-foreground min-h-[80px]" 
                  rows={3}
                  placeholder="Mensagem para exibir no topo do sistema..."
                />
              </div>
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm">
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
