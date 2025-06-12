
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Tag, FileText } from 'lucide-react';

interface Subcategory {
  id: string;
  name: string;
  description?: string;
  category_id: string;
  active: boolean;
  created_at: string;
  updated_at: string;
  service_categories?: {
    name: string;
  };
}

interface ViewSubcategoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subcategory: Subcategory | null;
}

const ViewSubcategoryModal = ({ open, onOpenChange, subcategory }: ViewSubcategoryModalProps) => {
  if (!subcategory) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Detalhes da Subcategoria
          </DialogTitle>
          <DialogDescription>
            Informações completas da subcategoria de serviços
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                {subcategory.name}
                <Badge variant={subcategory.active ? "default" : "secondary"}>
                  {subcategory.active ? 'Ativa' : 'Inativa'}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Categoria</label>
                  <p className="text-sm mt-1">
                    <Badge variant="outline">
                      {subcategory.service_categories?.name || 'N/A'}
                    </Badge>
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <p className="text-sm mt-1">
                    <Badge variant={subcategory.active ? "default" : "secondary"}>
                      {subcategory.active ? 'Ativa' : 'Inativa'}
                    </Badge>
                  </p>
                </div>
              </div>

              {subcategory.description && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Descrição
                  </label>
                  <p className="text-sm mt-1 text-foreground bg-muted p-3 rounded-md">
                    {subcategory.description}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Criado em
                  </label>
                  <p className="text-sm mt-1">{formatDate(subcategory.created_at)}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Atualizado em
                  </label>
                  <p className="text-sm mt-1">{formatDate(subcategory.updated_at)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewSubcategoryModal;
