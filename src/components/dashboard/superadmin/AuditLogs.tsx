
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Shield, Activity } from 'lucide-react';

interface AuditLog {
  id: string;
  action: string;
  user: string;
  target: string;
  timestamp: string;
  details: string;
}

interface AuditLogsProps {
  auditLogs: AuditLog[];
}

const AuditLogs = ({ auditLogs }: AuditLogsProps) => {
  return (
    <Card className="border-border shadow-sm">
      <CardHeader className="pb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Shield className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl font-semibold text-foreground">Auditoria e Logs</CardTitle>
            <CardDescription className="text-muted-foreground">
              Histórico de ações administrativas na plataforma
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="border border-border rounded-xl overflow-hidden bg-card">
          <Table>
            <TableHeader>
              <TableRow className="border-border bg-muted/30">
                <TableHead className="text-muted-foreground font-semibold py-4">Ação</TableHead>
                <TableHead className="text-muted-foreground font-semibold">Usuário</TableHead>
                <TableHead className="text-muted-foreground font-semibold">Alvo</TableHead>
                <TableHead className="text-muted-foreground font-semibold">Data/Hora</TableHead>
                <TableHead className="text-muted-foreground font-semibold">Detalhes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {auditLogs.map((log) => (
                <TableRow key={log.id} className="border-border hover:bg-muted/20 transition-colors">
                  <TableCell className="font-semibold text-foreground py-4 flex items-center gap-2">
                    <Activity className="h-4 w-4 text-primary" />
                    {log.action}
                  </TableCell>
                  <TableCell className="text-foreground font-medium">{log.user}</TableCell>
                  <TableCell className="text-foreground">{log.target}</TableCell>
                  <TableCell className="text-muted-foreground font-mono text-sm">
                    {log.timestamp}
                  </TableCell>
                  <TableCell className="text-muted-foreground max-w-xs">
                    <div className="truncate" title={log.details}>
                      {log.details}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {auditLogs.length === 0 && (
          <div className="text-center py-12">
            <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Nenhuma atividade registrada ainda</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AuditLogs;
