
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Bell, Mail, MessageCircle, Save } from 'lucide-react';

interface NotificationSettingsProps {
  companyId: string;
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({ companyId }) => {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    whatsappNotifications: false,
    internalNotifications: true,
    whatsappNumber: ''
  });

  const handleSave = () => {
    console.log('Salvando configurações de notificação:', settings);
    // TODO: Implementar salvamento
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notificações
        </CardTitle>
        <CardDescription>
          Configure como e quando receber notificações sobre pedidos
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <Label htmlFor="email-notifications">Notificações por E-mail</Label>
                <p className="text-sm text-muted-foreground">
                  Receba alertas de novos pedidos e atualizações por e-mail
                </p>
              </div>
            </div>
            <Switch
              id="email-notifications"
              checked={settings.emailNotifications}
              onCheckedChange={(checked) => 
                setSettings({ ...settings, emailNotifications: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MessageCircle className="h-5 w-5 text-muted-foreground" />
              <div>
                <Label htmlFor="whatsapp-notifications">Notificações por WhatsApp</Label>
                <p className="text-sm text-muted-foreground">
                  Receba alertas direto no WhatsApp (em breve)
                </p>
              </div>
            </div>
            <Switch
              id="whatsapp-notifications"
              checked={settings.whatsappNotifications}
              onCheckedChange={(checked) => 
                setSettings({ ...settings, whatsappNotifications: checked })
              }
              disabled
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <div>
                <Label htmlFor="internal-notifications">Notificações Internas</Label>
                <p className="text-sm text-muted-foreground">
                  Receba notificações no painel administrativo
                </p>
              </div>
            </div>
            <Switch
              id="internal-notifications"
              checked={settings.internalNotifications}
              onCheckedChange={(checked) => 
                setSettings({ ...settings, internalNotifications: checked })
              }
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="whatsapp-number">Número do WhatsApp para Atendimento</Label>
          <Input
            id="whatsapp-number"
            value={settings.whatsappNumber}
            onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
            placeholder="(11) 99999-9999"
            disabled
          />
          <p className="text-sm text-muted-foreground">
            Funcionalidade será liberada em breve
          </p>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Salvar Configurações
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationSettings;
