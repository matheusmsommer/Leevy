
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { Star } from 'lucide-react';

interface GlobalService {
  id: string;
  name: string;
  code: string;
  category: string;
  category_id?: string;
  subcategory_id?: string;
  preparation_id?: string;
  preparation?: string;
  description?: string;
  patient_friendly_description?: string;
  synonyms?: string;
  related_diseases?: string;
}

interface ServiceDetails {
  category_name?: string;
  subcategory_names?: string[];
  preparation_name?: string;
  preparation_instructions?: string;
  service_preparations?: Array<{
    id: string;
    is_primary: boolean;
    preparation: {
      id: string;
      name: string;
      instructions: string;
    };
  }>;
}

interface ViewExamModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  exam: GlobalService | null;
}

const ViewExamModal = ({ open, onOpenChange, exam }: ViewExamModalProps) => {
  const [serviceDetails, setServiceDetails] = useState<ServiceDetails>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (exam && open) {
      fetchServiceDetails();
    }
  }, [exam, open]);

  const fetchServiceDetails = async () => {
    if (!exam) return;

    setLoading(true);
    try {
      const details: ServiceDetails = {};

      // Fetch category name
      if (exam.category_id) {
        const { data: categoryData } = await supabase
          .from('service_categories')
          .select('name')
          .eq('id', exam.category_id)
          .single();
        
        if (categoryData) {
          details.category_name = categoryData.name;
        }
      }

      // Fetch subcategory names from associations
      const { data: subcategoryAssociations } = await supabase
        .from('service_subcategory_associations')
        .select(`
          subcategory_id,
          service_subcategories(name)
        `)
        .eq('service_id', exam.id);

      if (subcategoryAssociations && subcategoryAssociations.length > 0) {
        details.subcategory_names = subcategoryAssociations
          .map(assoc => (assoc as any).service_subcategories?.name)
          .filter(name => name);
      }

      // Fetch service preparations (multiple)
      const { data: servicePreparationsData } = await supabase
        .from('service_preparations')
        .select(`
          id,
          is_primary,
          preparation:standard_preparations(
            id,
            name,
            instructions
          )
        `)
        .eq('service_id', exam.id)
        .order('is_primary', { ascending: false });

      if (servicePreparationsData) {
        details.service_preparations = servicePreparationsData;
      }

      // Fetch legacy preparation details (for backward compatibility)
      if (exam.preparation_id) {
        const { data: preparationData } = await supabase
          .from('standard_preparations')
          .select('name, instructions')
          .eq('id', exam.preparation_id)
          .single();
        
        if (preparationData) {
          details.preparation_name = preparationData.name;
          details.preparation_instructions = preparationData.instructions;
        }
      }

      setServiceDetails(details);
    } catch (error) {
      console.error('Error fetching service details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!exam) return null;

  const synonymsList = exam.synonyms ? exam.synonyms.split(',').map(s => s.trim()) : [];
  const diseasesList = exam.related_diseases ? exam.related_diseases.split(',').map(s => s.trim()) : [];
  const hasMultiplePreparations = serviceDetails.service_preparations && serviceDetails.service_preparations.length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-foreground">
            Detalhes do Serviço
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Visualizar informações completas do serviço
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Nome do Serviço</label>
              <p className="text-foreground font-medium">{exam.name}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-muted-foreground">Código</label>
              <p className="text-foreground font-mono text-sm bg-muted/20 rounded px-2 py-1 w-fit">
                {exam.code}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Categoria</label>
              <div className="mt-1">
                <Badge variant="outline" className="border-primary/20 text-primary bg-primary/5">
                  {serviceDetails.category_name || exam.category || 'N/A'}
                </Badge>
              </div>
            </div>

            {serviceDetails.subcategory_names && serviceDetails.subcategory_names.length > 0 && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Subcategorias</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {serviceDetails.subcategory_names.map((name, index) => (
                    <Badge key={index} variant="outline" className="border-secondary/20 text-secondary bg-secondary/5">
                      {name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Separator />

          {exam.description && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">Descrição Técnica</label>
              <p className="text-foreground mt-1 leading-relaxed">{exam.description}</p>
            </div>
          )}

          {exam.patient_friendly_description && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">Descrição Amigável</label>
              <p className="text-foreground mt-1 leading-relaxed bg-blue-50 p-3 rounded-lg border border-blue-200">
                {exam.patient_friendly_description}
              </p>
            </div>
          )}

          {/* Multiple Preparations */}
          {hasMultiplePreparations && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">Preparações</label>
              <div className="space-y-3 mt-2">
                {serviceDetails.service_preparations?.map((servicePrep) => (
                  <div key={servicePrep.id} className="p-4 border rounded-lg bg-muted/10">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="border-orange-200 text-orange-800 bg-orange-50">
                        {servicePrep.preparation.name}
                      </Badge>
                      {servicePrep.is_primary && (
                        <Badge variant="default" className="text-xs">
                          <Star className="h-3 w-3 mr-1" />
                          Principal
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-foreground leading-relaxed">
                      {servicePrep.preparation.instructions}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Legacy preparation (backward compatibility) */}
          {(serviceDetails.preparation_name || exam.preparation) && !hasMultiplePreparations && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">Preparação</label>
              {serviceDetails.preparation_name && (
                <div className="mt-1 mb-2">
                  <Badge variant="outline" className="border-orange-200 text-orange-800 bg-orange-50">
                    {serviceDetails.preparation_name}
                  </Badge>
                </div>
              )}
              <p className="text-foreground leading-relaxed">
                {serviceDetails.preparation_instructions || exam.preparation}
              </p>
            </div>
          )}

          {exam.preparation && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">Observação</label>
              <p className="text-foreground mt-1 leading-relaxed bg-muted/20 p-3 rounded-lg">
                {exam.preparation}
              </p>
            </div>
          )}

          {synonymsList.length > 0 && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">Sinônimos</label>
              <div className="flex flex-wrap gap-2 mt-1">
                {synonymsList.map((synonym, index) => (
                  <Badge key={index} variant="secondary">
                    {synonym}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {diseasesList.length > 0 && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">Doenças Relacionadas</label>
              <div className="flex flex-wrap gap-2 mt-1">
                {diseasesList.map((disease, index) => (
                  <Badge key={index} variant="outline" className="border-red-200 text-red-800 bg-red-50">
                    {disease}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {loading && (
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewExamModal;
