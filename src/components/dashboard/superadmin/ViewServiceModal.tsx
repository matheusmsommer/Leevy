
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface ServicePreparation {
  id: string;
  is_primary: boolean;
  preparation: {
    id: string;
    name: string;
    instructions: string;
  };
}

interface GlobalService {
  id: string;
  name: string;
  code: string;
  category: string;
  preparation?: string;
  description?: string;
  synonyms?: string;
  related_diseases?: string;
  service_preparations?: ServicePreparation[];
  subcategory_names?: string[];
}

interface ViewServiceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service: GlobalService | null;
}

const ViewServiceModal = ({ open, onOpenChange, service }: ViewServiceModalProps) => {
  if (!service) return null;

  const getPreparationDisplay = () => {
    if (service.service_preparations && service.service_preparations.length > 0) {
      const primaryPreparation = service.service_preparations.find(ep => ep.is_primary);
      if (primaryPreparation) {
        return primaryPreparation.preparation.instructions;
      }
      return service.service_preparations[0].preparation.instructions;
    }
    
    if (service.preparation && service.preparation.trim()) {
      return service.preparation;
    }
    
    return 'Sem preparação especial';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalhes do Serviço</DialogTitle>
          <DialogDescription>
            Informações completas do serviço selecionado
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-1">Nome</h4>
              <p className="text-foreground">{service.name}</p>
            </div>
            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-1">Código</h4>
              <p className="text-foreground font-mono">{service.code}</p>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-sm text-muted-foreground mb-2">Categoria</h4>
            <Badge variant="outline" className="border-primary/20 text-primary bg-primary/5">
              {service.category}
            </Badge>
          </div>

          {service.subcategory_names && service.subcategory_names.length > 0 && (
            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-2">Subcategorias</h4>
              <div className="flex flex-wrap gap-2">
                {service.subcategory_names.map((name, index) => (
                  <Badge key={index} variant="outline" className="border-secondary/20 text-secondary bg-secondary/5">
                    {name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {service.description && (
            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-1">Descrição</h4>
              <p className="text-foreground">{service.description}</p>
            </div>
          )}

          {service.synonyms && (
            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-1">Sinônimos</h4>
              <p className="text-foreground">{service.synonyms}</p>
            </div>
          )}

          {service.related_diseases && (
            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-1">Doenças Relacionadas</h4>
              <p className="text-foreground">{service.related_diseases}</p>
            </div>
          )}

          <Separator />

          <div>
            <h4 className="font-medium text-sm text-muted-foreground mb-2">Preparações</h4>
            {service.service_preparations && service.service_preparations.length > 0 ? (
              <div className="space-y-3">
                {service.service_preparations.map((servicePrep) => (
                  <div key={servicePrep.id} className="border rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <h5 className="font-medium">{servicePrep.preparation.name}</h5>
                      {servicePrep.is_primary && (
                        <Badge variant="default" className="text-xs">Primária</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {servicePrep.preparation.instructions}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="border rounded-lg p-4">
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {getPreparationDisplay()}
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewServiceModal;
