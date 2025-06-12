
-- Criar tabela para categorias de exames
CREATE TABLE public.exam_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela para subcategorias de exames
CREATE TABLE public.exam_subcategories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category_id UUID REFERENCES public.exam_categories(id) ON DELETE CASCADE,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(name, category_id)
);

-- Criar tabela para preparações padronizadas
CREATE TABLE public.standard_preparations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  instructions TEXT NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela para horários de coleta
CREATE TABLE public.collection_schedules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  days_of_week TEXT[] NOT NULL, -- Array de dias: ['monday', 'tuesday', etc]
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS nas novas tabelas
ALTER TABLE public.exam_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.standard_preparations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collection_schedules ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para categorias
CREATE POLICY "Anyone can view active categories" ON public.exam_categories
  FOR SELECT USING (active = true);

CREATE POLICY "Superadmins can manage categories" ON public.exam_categories
  FOR ALL USING (public.get_current_user_role() = 'superadmin');

-- Políticas RLS para subcategorias
CREATE POLICY "Anyone can view active subcategories" ON public.exam_subcategories
  FOR SELECT USING (active = true);

CREATE POLICY "Superadmins can manage subcategories" ON public.exam_subcategories
  FOR ALL USING (public.get_current_user_role() = 'superadmin');

-- Políticas RLS para preparações padronizadas
CREATE POLICY "Anyone can view active preparations" ON public.standard_preparations
  FOR SELECT USING (active = true);

CREATE POLICY "Superadmins can manage preparations" ON public.standard_preparations
  FOR ALL USING (public.get_current_user_role() = 'superadmin');

-- Políticas RLS para horários de coleta
CREATE POLICY "Anyone can view active schedules" ON public.collection_schedules
  FOR SELECT USING (active = true);

CREATE POLICY "Superadmins can manage schedules" ON public.collection_schedules
  FOR ALL USING (public.get_current_user_role() = 'superadmin');

-- Atualizar tabela de exames para usar as novas referências
ALTER TABLE public.exams 
ADD COLUMN category_id UUID REFERENCES public.exam_categories(id),
ADD COLUMN subcategory_id UUID REFERENCES public.exam_subcategories(id),
ADD COLUMN preparation_id UUID REFERENCES public.standard_preparations(id);

-- Inserir algumas categorias padrão
INSERT INTO public.exam_categories (name, description) VALUES
('Bioquímica', 'Exames bioquímicos e análises clínicas'),
('Hematologia', 'Exames do sangue e hemogramas'),
('Microbiologia', 'Culturas e análises microbiológicas'),
('Imunologia', 'Testes imunológicos e sorológicos'),
('Parasitologia', 'Pesquisa de parasitas'),
('Urinálise', 'Análises de urina'),
('Endocrinologia', 'Dosagens hormonais'),
('Cardiologia', 'Marcadores cardíacos'),
('Genética', 'Testes genéticos'),
('Toxicologia', 'Análises toxicológicas');

-- Inserir algumas preparações padrão
INSERT INTO public.standard_preparations (name, instructions) VALUES
('Jejum 12h', 'Jejum de 12 horas. Pode beber água.'),
('Jejum 8h', 'Jejum de 8 horas. Pode beber água.'),
('Sem jejum', 'Não é necessário jejum para este exame.'),
('Dieta específica', 'Seguir dieta específica conforme orientação médica.'),
('Suspender medicamentos', 'Suspender medicamentos conforme orientação médica.');

-- Inserir alguns horários padrão
INSERT INTO public.collection_schedules (name, start_time, end_time, days_of_week) VALUES
('Manhã - Seg a Sex', '07:00', '11:00', ARRAY['monday', 'tuesday', 'wednesday', 'thursday', 'friday']),
('Tarde - Seg a Sex', '13:00', '17:00', ARRAY['monday', 'tuesday', 'wednesday', 'thursday', 'friday']),
('Manhã - Sábado', '07:00', '11:00', ARRAY['saturday']),
('24 horas', '00:00', '23:59', ARRAY['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']);
