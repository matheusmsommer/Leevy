
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Tag, FileText, TestTube, Scan, Stethoscope, Scissors, UserCheck, HardHat, Settings } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

interface ViewCategoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: Category | null;
}

const getIconComponent = (iconName?: string) => {
  const iconMap = {
    'TestTube': TestTube,
    'Scan': Scan,
    'Stethoscope': Stethoscope,
    'Scissors': Scissors,
    'UserCheck': UserCheck,
    'HardHat': HardHat,
    'Settings': Settings,
  };
  
  const IconComponent = iconName ? iconMap[iconName as keyof typeof iconMap] : Settings;
  return IconComponent || Settings;
};

const ViewCategoryModal = ({ open, onOpenChange, category }: ViewCategoryModalProps) => {
  if (!category) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const IconComponent = getIconComponent(category.icon);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Detalhes da Categoria
          </DialogTitle>
          <DialogDescription>
            Informações completas da categoria de serviços
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-muted rounded-lg">
                    <IconComponent className="h-5 w-5 text-muted-foreground" />
                  </div>
                  {category.name}
                </div>
                <Badge variant={category.active ? "default" : "secondary"}>
                  {category.active ? 'Ativa' : 'Inativa'}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Ícone</label>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="p-2 bg-muted rounded-lg">
                      <IconComponent className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <span className="text-sm">{category.icon || 'Settings'}</span>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <p className="text-sm mt-1">
                    <Badge variant={category.active ? "default" : "secondary"}>
                      {category.active ? 'Ativa' : 'Inativa'}
                    </Badge>
                  </p>
                </div>
              </div>

              {category.description && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Descrição
                  </label>
                  <p className="text-sm mt-1 text-foreground bg-muted p-3 rounded-md">
                    {category.description}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Criado em
                  </label>
                  <p className="text-sm mt-1">{formatDate(category.created_at)}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Atualizado em
                  </label>
                  <p className="text-sm mt-1">{formatDate(category.updated_at)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewCategoryModal;
