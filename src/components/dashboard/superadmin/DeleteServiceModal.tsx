
import React, { useState } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface GlobalService {
  id: string;
  name: string;
  code: string;
  category: string;
  preparation?: string;
  description?: string;
  synonyms?: string;
}

interface DeleteServiceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service: GlobalService | null;
  onServiceDeleted: () => void;
}

const DeleteServiceModal = ({ open, onOpenChange, service, onServiceDeleted }: DeleteServiceModalProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!service) return;

    setLoading(true);

    try {
      // First check if service is being used by any company services
      const { data: services, error: servicesError } = await supabase
        .from('company_services')
        .select('id')
        .eq('service_id', service.id)
        .limit(1);

      if (servicesError) {
        console.error('Error checking services:', servicesError);
        toast({
          title: "Erro ao verificar dependências",
          description: "Não foi possível verificar se o serviço está sendo usado.",
          variant: "destructive",
        });
        return;
      }

      if (services && services.length > 0) {
        toast({
          title: "Não é possível excluir",
          description: "Este serviço está sendo usado por uma ou mais empresas. Remova das empresas antes de excluir.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', service.id);

      if (error) {
        console.error('Error deleting service:', error);
        toast({
          title: "Erro ao excluir serviço",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Sucesso",
        description: "Serviço excluído com sucesso!",
      });

      onServiceDeleted();
      onOpenChange(false);
    } catch (error) {
      console.error('Error in handleDelete:', error);
      toast({
        title: "Erro inesperado",
        description: "Ocorreu um erro ao excluir o serviço.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!service) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-destructive">
            Excluir Serviço
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>
              Tem certeza que deseja excluir o serviço <strong>"{service.name}"</strong>?
            </p>
            <p className="text-sm text-muted-foreground">
              Esta ação não pode ser desfeita. O serviço será removido permanentemente do sistema.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={loading}
            className="bg-destructive hover:bg-destructive/90"
          >
            {loading ? 'Excluindo...' : 'Excluir'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteServiceModal;
