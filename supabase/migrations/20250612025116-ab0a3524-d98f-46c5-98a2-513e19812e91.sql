
-- Adicionar coluna para ícones nas categorias (se não existir)
ALTER TABLE public.exam_categories 
ADD COLUMN IF NOT EXISTS icon TEXT;

-- Primeiro, vamos atualizar as categorias existentes com ícones apropriados
UPDATE public.exam_categories SET icon = 'TestTube' WHERE name ILIKE '%laboratorial%' OR name ILIKE '%laboratório%';
UPDATE public.exam_categories SET icon = 'Scan' WHERE name ILIKE '%imagem%';
UPDATE public.exam_categories SET icon = 'Stethoscope' WHERE name ILIKE '%médico%' AND name NOT ILIKE '%procedimento%';
UPDATE public.exam_categories SET icon = 'Scissors' WHERE name ILIKE '%procedimento%';
UPDATE public.exam_categories SET icon = 'UserCheck' WHERE name ILIKE '%consulta%';
UPDATE public.exam_categories SET icon = 'HardHat' WHERE name ILIKE '%ocupacional%';
UPDATE public.exam_categories SET icon = 'Settings' WHERE name ILIKE '%serviços%' OR name ILIKE '%geral%' OR name ILIKE '%serviço%';

-- Inserir as categorias padrão apenas se não existirem (usando ON CONFLICT)
INSERT INTO public.exam_categories (name, description, icon, active) VALUES
('Exames laboratoriais', 'Análises clínicas, bioquímicas e laboratoriais', 'TestTube', true),
('Exames de imagem', 'Radiografias, ultrassom, tomografia, ressonância', 'Scan', true),
('Exames médicos', 'Exames clínicos e diagnósticos médicos', 'Stethoscope', true),
('Procedimentos médicos', 'Procedimentos cirúrgicos e intervenções', 'Scissors', true),
('Consultas', 'Consultas médicas e especializadas', 'UserCheck', true),
('Ocupacional', 'Medicina do trabalho e exames ocupacionais', 'HardHat', true),
('Serviços gerais', 'Outros serviços e procedimentos gerais', 'Settings', true)
ON CONFLICT (name) DO UPDATE SET
  description = EXCLUDED.description,
  icon = EXCLUDED.icon,
  active = EXCLUDED.active;
