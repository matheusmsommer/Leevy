
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, User, AlertTriangle, Activity } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuditLog {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  details: string;
  type: 'system' | 'user' | 'security' | 'data';
}

interface AuditLogsProps {
  auditLogs: AuditLog[];
}

const AuditLogs = ({ auditLogs: initialLogs }: AuditLogsProps) => {
  const { toast } = useToast();
  const [logs, setLogs] = useState<AuditLog[]>(initialLogs);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Por enquanto, vamos usar os logs iniciais
    // No futuro, implementaremos uma tabela de audit_logs no Supabase
    setLoading(false);
  }, []);

  const getLogIcon = (type: string) => {
    switch (type) {
      case 'system':
        return <Activity className="h-4 w-4 text-blue-600" />;
      case 'user':
        return <User className="h-4 w-4 text-green-600" />;
      case 'security':
        return <Shield className="h-4 w-4 text-red-600" />;
      case 'data':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      default:
        return <Activity className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getLogBadge = (type: string) => {
    switch (type) {
      case 'system':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Sistema</Badge>;
      case 'user':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Usuário</Badge>;
      case 'security':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Segurança</Badge>;
      case 'data':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Dados</Badge>;
      default:
        return <Badge variant="outline">Geral</Badge>;
    }
  };

  if (loading) {
    return (
      <Card className="border-border shadow-sm">
        <CardHeader className="pb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl font-semibold text-foreground">Logs de Auditoria</CardTitle>
              <CardDescription className="text-muted-foreground">
                Carregando logs...
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border shadow-sm">
      <CardHeader className="pb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Shield className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl font-semibold text-foreground">Logs de Auditoria</CardTitle>
            <CardDescription className="text-muted-foreground">
              Registro de atividades da plataforma
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {logs.length === 0 ? (
          <div className="text-center py-12">
            <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Nenhum log de auditoria ainda</p>
            <p className="text-sm text-muted-foreground mt-2">
              Funcionalidade de auditoria será implementada em breve
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {logs.map((log) => (
              <div key={log.id} className="flex items-start gap-4 p-4 bg-muted/30 rounded-xl border border-border">
                <div className="flex items-center justify-center w-10 h-10 bg-background rounded-full border border-border">
                  {getLogIcon(log.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <h4 className="font-semibold text-foreground">{log.action}</h4>
                      {getLogBadge(log.type)}
                    </div>
                    <span className="text-sm text-muted-foreground">{log.timestamp}</span>
                  </div>
                  <p className="text-sm text-foreground mb-1">Usuário: {log.user}</p>
                  <p className="text-sm text-muted-foreground">{log.details}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AuditLogs;
