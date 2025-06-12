
-- Renomear tabela exams para services
ALTER TABLE public.exams RENAME TO services;

-- Renomear tabela exam_categories para service_categories
ALTER TABLE public.exam_categories RENAME TO service_categories;

-- Renomear tabela exam_subcategories para service_subcategories
ALTER TABLE public.exam_subcategories RENAME TO service_subcategories;

-- Renomear tabela exam_subcategory_associations para service_subcategory_associations
ALTER TABLE public.exam_subcategory_associations RENAME TO service_subcategory_associations;

-- Renomear tabela exam_preparations para service_preparations
ALTER TABLE public.exam_preparations RENAME TO service_preparations;

-- Renomear colunas que fazem referência a exams
ALTER TABLE public.service_subcategory_associations RENAME COLUMN exam_id TO service_id;
ALTER TABLE public.service_preparations RENAME COLUMN exam_id TO service_id;
ALTER TABLE public.company_services RENAME COLUMN exam_id TO service_id;

-- Atualizar comentários das tabelas
COMMENT ON TABLE public.services IS 'Catálogo de serviços (exames, consultas, procedimentos, etc.)';
COMMENT ON TABLE public.service_categories IS 'Categorias de serviços';
COMMENT ON TABLE public.service_subcategories IS 'Subcategorias de serviços';
COMMENT ON TABLE public.service_subcategory_associations IS 'Relacionamento muitos-para-muitos entre serviços e subcategorias';
COMMENT ON TABLE public.service_preparations IS 'Relacionamento muitos-para-muitos entre serviços e preparações';

-- Recriar políticas RLS com novos nomes
DROP POLICY IF EXISTS "Anyone can view exams" ON public.services;
DROP POLICY IF EXISTS "Superadmins can insert exams" ON public.services;
DROP POLICY IF EXISTS "Superadmins can update exams" ON public.services;
DROP POLICY IF EXISTS "Superadmins can delete exams" ON public.services;

CREATE POLICY "Anyone can view services" ON public.services
  FOR SELECT USING (true);

CREATE POLICY "Superadmins can insert services" ON public.services
  FOR INSERT WITH CHECK (public.get_current_user_role() = 'superadmin');

CREATE POLICY "Superadmins can update services" ON public.services
  FOR UPDATE USING (public.get_current_user_role() = 'superadmin');

CREATE POLICY "Superadmins can delete services" ON public.services
  FOR DELETE USING (public.get_current_user_role() = 'superadmin');

-- Recriar políticas para outras tabelas renomeadas
DROP POLICY IF EXISTS "Anyone can view active categories" ON public.service_categories;
DROP POLICY IF EXISTS "Superadmins can manage categories" ON public.service_categories;

CREATE POLICY "Anyone can view active service categories" ON public.service_categories
  FOR SELECT USING (active = true);

CREATE POLICY "Superadmins can manage service categories" ON public.service_categories
  FOR ALL USING (public.get_current_user_role() = 'superadmin');

DROP POLICY IF EXISTS "Anyone can view active subcategories" ON public.service_subcategories;
DROP POLICY IF EXISTS "Superadmins can manage subcategories" ON public.service_subcategories;

CREATE POLICY "Anyone can view active service subcategories" ON public.service_subcategories
  FOR SELECT USING (active = true);

CREATE POLICY "Superadmins can manage service subcategories" ON public.service_subcategories
  FOR ALL USING (public.get_current_user_role() = 'superadmin');

DROP POLICY IF EXISTS "Anyone can view subcategory associations" ON public.service_subcategory_associations;
DROP POLICY IF EXISTS "Superadmins can manage subcategory associations" ON public.service_subcategory_associations;

CREATE POLICY "Anyone can view service subcategory associations" ON public.service_subcategory_associations
  FOR SELECT USING (true);

CREATE POLICY "Superadmins can manage service subcategory associations" ON public.service_subcategory_associations
  FOR ALL USING (public.get_current_user_role() = 'superadmin');

-- Atualizar descrições das categorias para refletir a mudança
UPDATE public.service_categories SET 
  name = CASE 
    WHEN name = 'Exames laboratoriais' THEN 'Análises laboratoriais'
    WHEN name = 'Exames de imagem' THEN 'Diagnóstico por imagem'
    WHEN name = 'Exames médicos' THEN 'Avaliações médicas'
    ELSE name
  END,
  description = CASE 
    WHEN description ILIKE '%exame%' THEN REPLACE(description, 'exame', 'serviço')
    WHEN description ILIKE '%Exame%' THEN REPLACE(description, 'Exame', 'Serviço')
    ELSE description
  END;

-- Atualizar descrições das subcategorias
UPDATE public.service_subcategories SET 
  description = CASE 
    WHEN description ILIKE '%exame%' THEN REPLACE(description, 'exame', 'serviço')
    WHEN description ILIKE '%Exame%' THEN REPLACE(description, 'Exame', 'Serviço')
    ELSE description
  END;
