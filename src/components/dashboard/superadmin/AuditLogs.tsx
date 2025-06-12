
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

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
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="text-foreground">Auditoria e Logs</CardTitle>
        <CardDescription className="text-muted-foreground">
          Histórico de ações administrativas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="border border-border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead className="text-muted-foreground">Ação</TableHead>
                <TableHead className="text-muted-foreground">Usuário</TableHead>
                <TableHead className="text-muted-foreground">Alvo</TableHead>
                <TableHead className="text-muted-foreground">Data/Hora</TableHead>
                <TableHead className="text-muted-foreground">Detalhes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {auditLogs.map((log) => (
                <TableRow key={log.id} className="border-border hover:bg-muted/50">
                  <TableCell className="font-medium text-foreground">{log.action}</TableCell>
                  <TableCell className="text-foreground">{log.user}</TableCell>
                  <TableCell className="text-foreground">{log.target}</TableCell>
                  <TableCell className="text-muted-foreground">{log.timestamp}</TableCell>
                  <TableCell className="text-muted-foreground max-w-xs truncate">{log.details}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default AuditLogs;
