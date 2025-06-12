
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { TestTube, Scan, Stethoscope, Scissors, UserCheck, HardHat, Settings } from 'lucide-react';

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

  const IconComponent = getIconComponent(category.icon);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Detalhes da Categoria</DialogTitle>
          <DialogDescription>
            Informações completas da categoria
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-lg">
              <IconComponent className="h-6 w-6 text-primary" />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Nome</label>
              <p className="text-foreground font-medium">{category.name}</p>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">Status</label>
            <div className="mt-1">
              <Badge variant={category.active ? "default" : "secondary"}>
                {category.active ? 'Ativa' : 'Inativa'}
              </Badge>
            </div>
          </div>

          {category.description && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">Descrição</label>
              <p className="text-foreground mt-1">{category.description}</p>
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-muted-foreground">Ícone</label>
            <p className="text-foreground mt-1 capitalize">{category.icon || 'Padrão'}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">Criada em</label>
            <p className="text-foreground mt-1">
              {new Date(category.created_at).toLocaleDateString('pt-BR')}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewCategoryModal;
