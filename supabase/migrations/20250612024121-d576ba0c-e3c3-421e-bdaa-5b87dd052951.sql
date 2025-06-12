
-- Criar tabela de relacionamento entre exames e subcategorias
CREATE TABLE public.exam_subcategory_associations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  exam_id UUID NOT NULL REFERENCES public.exams(id) ON DELETE CASCADE,
  subcategory_id UUID NOT NULL REFERENCES public.exam_subcategories(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(exam_id, subcategory_id)
);

-- Habilitar RLS na nova tabela
ALTER TABLE public.exam_subcategory_associations ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para associações
CREATE POLICY "Anyone can view subcategory associations" ON public.exam_subcategory_associations
  FOR SELECT USING (true);

CREATE POLICY "Superadmins can manage subcategory associations" ON public.exam_subcategory_associations
  FOR ALL USING (public.get_current_user_role() = 'superadmin');

-- Migrar dados existentes da coluna subcategory_id para a nova tabela
INSERT INTO public.exam_subcategory_associations (exam_id, subcategory_id)
SELECT id, subcategory_id 
FROM public.exams 
WHERE subcategory_id IS NOT NULL;
