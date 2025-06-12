
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';

interface GlobalExam {
  id: string;
  name: string;
  code: string;
  category: string;
  category_id?: string;
  subcategory_id?: string;
  preparation_id?: string;
  preparation?: string;
  description?: string;
  synonyms?: string;
}

interface ExamDetails {
  category_name?: string;
  subcategory_name?: string;
  preparation_name?: string;
  preparation_instructions?: string;
}

interface ViewExamModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  exam: GlobalExam | null;
}

const ViewExamModal = ({ open, onOpenChange, exam }: ViewExamModalProps) => {
  const [examDetails, setExamDetails] = useState<ExamDetails>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (exam && open) {
      fetchExamDetails();
    }
  }, [exam, open]);

  const fetchExamDetails = async () => {
    if (!exam) return;

    setLoading(true);
    try {
      const details: ExamDetails = {};

      // Fetch category name
      if (exam.category_id) {
        const { data: categoryData } = await supabase
          .from('exam_categories')
          .select('name')
          .eq('id', exam.category_id)
          .single();
        
        if (categoryData) {
          details.category_name = categoryData.name;
        }
      }

      // Fetch subcategory name
      if (exam.subcategory_id) {
        const { data: subcategoryData } = await supabase
          .from('exam_subcategories')
          .select('name')
          .eq('id', exam.subcategory_id)
          .single();
        
        if (subcategoryData) {
          details.subcategory_name = subcategoryData.name;
        }
      }

      // Fetch preparation details
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

      setExamDetails(details);
    } catch (error) {
      console.error('Error fetching exam details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!exam) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-foreground">
            Detalhes do Exame
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Visualizar informações completas do exame
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Nome do Exame</label>
              <p className="text-foreground font-medium">{exam.name}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-muted-foreground">Código</label>
              <p className="text-foreground font-mono text-sm bg-muted/20 rounded px-2 py-1 w-fit">
                {exam.code}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Categoria</label>
              <div className="mt-1">
                <Badge variant="outline" className="border-primary/20 text-primary bg-primary/5">
                  {examDetails.category_name || exam.category || 'N/A'}
                </Badge>
              </div>
            </div>

            {examDetails.subcategory_name && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Subcategoria</label>
                <div className="mt-1">
                  <Badge variant="outline" className="border-secondary/20 text-secondary bg-secondary/5">
                    {examDetails.subcategory_name}
                  </Badge>
                </div>
              </div>
            )}
          </div>

          <Separator />

          {exam.description && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">Descrição</label>
              <p className="text-foreground mt-1 leading-relaxed">{exam.description}</p>
            </div>
          )}

          {(examDetails.preparation_name || exam.preparation) && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">Preparação</label>
              {examDetails.preparation_name && (
                <div className="mt-1 mb-2">
                  <Badge variant="outline" className="border-orange-200 text-orange-800 bg-orange-50">
                    {examDetails.preparation_name}
                  </Badge>
                </div>
              )}
              <p className="text-foreground leading-relaxed">
                {examDetails.preparation_instructions || exam.preparation}
              </p>
            </div>
          )}

          {exam.synonyms && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">Sinônimos</label>
              <p className="text-foreground mt-1 leading-relaxed">{exam.synonyms}</p>
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
