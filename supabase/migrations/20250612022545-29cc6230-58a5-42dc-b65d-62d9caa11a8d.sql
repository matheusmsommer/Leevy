
-- Criar tabela de relacionamento entre exames e preparações (muitos para muitos)
CREATE TABLE public.exam_preparations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  exam_id UUID NOT NULL REFERENCES public.exams(id) ON DELETE CASCADE,
  preparation_id UUID NOT NULL REFERENCES public.standard_preparations(id) ON DELETE CASCADE,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(exam_id, preparation_id)
);

-- Adicionar comentários para documentar
COMMENT ON TABLE public.exam_preparations IS 'Relacionamento muitos-para-muitos entre exames e preparações';
COMMENT ON COLUMN public.exam_preparations.is_primary IS 'Indica se esta é a preparação principal/padrão do exame';

-- Criar índices para performance
CREATE INDEX idx_exam_preparations_exam_id ON public.exam_preparations(exam_id);
CREATE INDEX idx_exam_preparations_preparation_id ON public.exam_preparations(preparation_id);

-- Migrar dados existentes da coluna preparation_id em exams
INSERT INTO public.exam_preparations (exam_id, preparation_id, is_primary)
SELECT id, preparation_id, true
FROM public.exams 
WHERE preparation_id IS NOT NULL;

-- Opcional: remover a coluna preparation_id da tabela exams após migração
-- (comentado para manter compatibilidade durante transição)
-- ALTER TABLE public.exams DROP COLUMN preparation_id;
