import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Upload, Link, Download, X } from 'lucide-react';
import { Order } from '@/types/order';

interface OrderDetailsModalProps {
  order: Order;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (order: Order) => void;
}

const OrderDetailsModal = ({ order, open, onOpenChange, onUpdate }: OrderDetailsModalProps) => {
  const { toast } = useToast();
  const [status, setStatus] = useState<Order['status']>(order.status);
  const [resultLink, setResultLink] = useState(order.result_link || '');
  const [resultFiles, setResultFiles] = useState(order.result_files || []);

  const statusOptions = [
    { value: 'aguardando_atendimento', label: 'Aguardando Atendimento' },
    { value: 'em_atendimento', label: 'Em Atendimento' },
    { value: 'aguardando_pagamento', label: 'Aguardando Pagamento' },
    { value: 'concluido', label: 'Concluído' },
    { value: 'cancelado', label: 'Cancelado' }
  ] as const;

  const handleStatusChange = (value: string) => {
    setStatus(value as Order['status']);
  };

  const handleStatusUpdate = () => {
    const updatedOrder = { ...order, status, updated_at: new Date().toISOString() };
    onUpdate(updatedOrder);
    toast({
      title: "Status atualizado",
      description: "O status do pedido foi atualizado com sucesso.",
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Simular upload de arquivo
      const newFile = {
        id: `file_${Date.now()}`,
        filename: file.name,
        url: URL.createObjectURL(file),
        uploaded_at: new Date().toISOString()
      };
      
      const updatedFiles = [...resultFiles, newFile];
      setResultFiles(updatedFiles);
      
      const updatedOrder = { 
        ...order, 
        result_files: updatedFiles,
        updated_at: new Date().toISOString() 
      };
      onUpdate(updatedOrder);
      
      toast({
        title: "Arquivo enviado",
        description: "O arquivo de resultado foi enviado com sucesso.",
      });
    }
  };

  const handleLinkSave = () => {
    const updatedOrder = { 
      ...order, 
      result_link: resultLink,
      updated_at: new Date().toISOString() 
    };
    onUpdate(updatedOrder);
    
    toast({
      title: "Link salvo",
      description: "O link do resultado foi salvo com sucesso.",
    });
  };

  const removeFile = (fileId: string) => {
    const updatedFiles = resultFiles.filter(file => file.id !== fileId);
    setResultFiles(updatedFiles);
    
    const updatedOrder = { 
      ...order, 
      result_files: updatedFiles,
      updated_at: new Date().toISOString() 
    };
    onUpdate(updatedOrder);
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      aguardando_atendimento: { label: 'Aguardando Atendimento', variant: 'secondary' as const },
      em_atendimento: { label: 'Em Atendimento', variant: 'default' as const },
      aguardando_pagamento: { label: 'Aguardando Pagamento', variant: 'destructive' as const },
      concluido: { label: 'Concluído', variant: 'default' as const },
      cancelado: { label: 'Cancelado', variant: 'destructive' as const }
    };

    const config = statusMap[status as keyof typeof statusMap] || { label: status, variant: 'secondary' as const };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Detalhes do Pedido: {order.order_number}
            {getStatusBadge(order.status)}
          </DialogTitle>
          <DialogDescription>
            Visualize e gerencie os detalhes completos do pedido
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações do Paciente */}
          <div>
            <h3 className="font-semibold mb-3">Dados do Paciente</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
              <div>
                <Label className="text-sm font-medium">Nome do Paciente</Label>
                <p className="text-sm">{order.patient_name}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Responsável pela Compra</Label>
                <p className="text-sm">{order.customer_name}</p>
              </div>
            </div>
          </div>

          {/* Informações do Atendimento */}
          <div>
            <h3 className="font-semibold mb-3">Dados do Atendimento</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
              <div>
                <Label className="text-sm font-medium">Exames Solicitados</Label>
                <p className="text-sm">{order.service_names.join(', ')}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Local</Label>
                <p className="text-sm">{order.location_name}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Tipo de Atendimento</Label>
                <p className="text-sm">
                  {order.attendance_type === 'presencial' ? 'Presencial' : 
                   order.attendance_type === 'domiciliar' ? 'Domiciliar' : 'Comparecimento Livre'}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium">Data e Hora</Label>
                <p className="text-sm">
                  {order.scheduled_date && order.scheduled_time 
                    ? `${new Date(order.scheduled_date).toLocaleDateString('pt-BR')} às ${order.scheduled_time}`
                    : 'Comparecimento livre'
                  }
                </p>
              </div>
              {order.observations && (
                <div className="md:col-span-2">
                  <Label className="text-sm font-medium">Observações</Label>
                  <p className="text-sm">{order.observations}</p>
                </div>
              )}
            </div>
          </div>

          {/* Informações de Pagamento */}
          <div>
            <h3 className="font-semibold mb-3">Dados do Pagamento</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
              <div>
                <Label className="text-sm font-medium">Valor Total</Label>
                <p className="text-sm font-bold">R$ {order.total_amount.toFixed(2)}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Status do Pagamento</Label>
                <Badge variant={order.payment_status === 'aprovado' ? 'default' : 'destructive'}>
                  {order.payment_status === 'aprovado' ? 'Aprovado' : 
                   order.payment_status === 'pendente' ? 'Pendente' : 'Rejeitado'}
                </Badge>
              </div>
            </div>
          </div>

          <Separator />

          {/* Atualização de Status */}
          <div>
            <h3 className="font-semibold mb-3">Atualizar Status</h3>
            <div className="flex items-end gap-4">
              <div className="flex-1">
                <Label htmlFor="status">Novo Status</Label>
                <Select value={status} onValueChange={handleStatusChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleStatusUpdate} disabled={status === order.status}>
                Atualizar Status
              </Button>
            </div>
          </div>

          {/* Envio de Resultados - só aparece se status for "concluído" */}
          {(status === 'concluido' || order.status === 'concluido') && (
            <div>
              <h3 className="font-semibold mb-3">Resultados</h3>
              
              {/* Upload de Arquivos */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="file-upload">Upload de Arquivo PDF</Label>
                  <div className="mt-2">
                    <Input
                      id="file-upload"
                      type="file"
                      accept=".pdf"
                      onChange={handleFileUpload}
                      className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                    />
                  </div>
                </div>

                {/* Arquivos enviados */}
                {resultFiles.length > 0 && (
                  <div className="space-y-2">
                    <Label>Arquivos Enviados</Label>
                    {resultFiles.map((file) => (
                      <div key={file.id} className="flex items-center justify-between p-2 border rounded">
                        <span className="text-sm">{file.filename}</span>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <a href={file.url} download target="_blank" rel="noopener noreferrer">
                              <Download className="h-4 w-4" />
                            </a>
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => removeFile(file.id)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <Separator />

                {/* Link Externo */}
                <div>
                  <Label htmlFor="result-link">Link Externo para Resultado</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      id="result-link"
                      placeholder="https://..."
                      value={resultLink}
                      onChange={(e) => setResultLink(e.target.value)}
                    />
                    <Button onClick={handleLinkSave}>
                      <Link className="h-4 w-4 mr-2" />
                      Salvar Link
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailsModal;
