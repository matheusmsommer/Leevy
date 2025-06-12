
-- Inserir subcategorias para cada categoria (apenas se não existirem)
INSERT INTO public.exam_subcategories (name, description, category_id) VALUES
-- Subcategorias para Exames laboratoriais
('Hematologia', 'Hemograma, coagulograma, tipagem sanguínea', (SELECT id FROM public.exam_categories WHERE name = 'Exames laboratoriais')),
('Bioquímica', 'Glicose, colesterol, triglicérides, enzimas', (SELECT id FROM public.exam_categories WHERE name = 'Exames laboratoriais')),
('Hormônios', 'TSH, T4, hormônios reprodutivos, cortisol', (SELECT id FROM public.exam_categories WHERE name = 'Exames laboratoriais')),
('Urinálise', 'Exame de urina tipo I, urocultura', (SELECT id FROM public.exam_categories WHERE name = 'Exames laboratoriais')),
('Microbiologia', 'Culturas, antibiogramas, pesquisa de parasitas', (SELECT id FROM public.exam_categories WHERE name = 'Exames laboratoriais')),
('Imunologia', 'Sorologias, marcadores tumorais, autoimunidade', (SELECT id FROM public.exam_categories WHERE name = 'Exames laboratoriais')),

-- Subcategorias para Exames de imagem
('Radiologia simples', 'Raio-X de tórax, ossos, abdome', (SELECT id FROM public.exam_categories WHERE name = 'Exames de imagem')),
('Ultrassonografia', 'USG abdominal, pélvico, obstétrico', (SELECT id FROM public.exam_categories WHERE name = 'Exames de imagem')),
('Tomografia', 'TC de crânio, tórax, abdome', (SELECT id FROM public.exam_categories WHERE name = 'Exames de imagem')),
('Ressonância magnética', 'RM de crânio, coluna, articulações', (SELECT id FROM public.exam_categories WHERE name = 'Exames de imagem')),
('Medicina nuclear', 'Cintilografias, PET-CT', (SELECT id FROM public.exam_categories WHERE name = 'Exames de imagem')),

-- Subcategorias para Exames médicos
('Cardiologia', 'Eletrocardiograma, ecocardiograma, teste ergométrico', (SELECT id FROM public.exam_categories WHERE name = 'Exames médicos')),
('Pneumologia', 'Espirometria, gasometria, radiografia de tórax', (SELECT id FROM public.exam_categories WHERE name = 'Exames médicos')),
('Neurologia', 'Eletroencefalograma, eletroneuromiografia', (SELECT id FROM public.exam_categories WHERE name = 'Exames médicos')),
('Oftalmologia', 'Acuidade visual, fundo de olho, tonometria', (SELECT id FROM public.exam_categories WHERE name = 'Exames médicos')),
('Otorrinolaringologia', 'Audiometria, impedanciometria', (SELECT id FROM public.exam_categories WHERE name = 'Exames médicos')),

-- Subcategorias para Procedimentos médicos
('Biópsias', 'Biópsia de pele, mama, próstata', (SELECT id FROM public.exam_categories WHERE name = 'Procedimentos médicos')),
('Endoscopias', 'Endoscopia digestiva, colonoscopia', (SELECT id FROM public.exam_categories WHERE name = 'Procedimentos médicos')),
('Pequenas cirurgias', 'Remoção de lesões, suturas', (SELECT id FROM public.exam_categories WHERE name = 'Procedimentos médicos')),
('Infiltrações', 'Infiltrações articulares, bloqueios', (SELECT id FROM public.exam_categories WHERE name = 'Procedimentos médicos')),

-- Subcategorias para Consultas
('Clínica médica', 'Consulta clínico geral, check-up', (SELECT id FROM public.exam_categories WHERE name = 'Consultas')),
('Especialidades', 'Cardiologia, dermatologia, ortopedia', (SELECT id FROM public.exam_categories WHERE name = 'Consultas')),
('Pediatria', 'Consultas pediátricas, puericultura', (SELECT id FROM public.exam_categories WHERE name = 'Consultas')),
('Ginecologia', 'Consulta ginecológica, pré-natal', (SELECT id FROM public.exam_categories WHERE name = 'Consultas')),

-- Subcategorias para Ocupacional
('Admissional', 'Exames de admissão', (SELECT id FROM public.exam_categories WHERE name = 'Ocupacional')),
('Periódico', 'Exames periódicos de saúde ocupacional', (SELECT id FROM public.exam_categories WHERE name = 'Ocupacional')),
('Retorno ao trabalho', 'Exames pós-afastamento', (SELECT id FROM public.exam_categories WHERE name = 'Ocupacional')),
('Demissional', 'Exames demissionais', (SELECT id FROM public.exam_categories WHERE name = 'Ocupacional')),
('Mudança de função', 'Exames para mudança de função', (SELECT id FROM public.exam_categories WHERE name = 'Ocupacional')),

-- Subcategorias para Serviços gerais
('Documentos médicos', 'Atestados, relatórios, laudos', (SELECT id FROM public.exam_categories WHERE name = 'Serviços gerais')),
('Vacinação', 'Vacinas diversas', (SELECT id FROM public.exam_categories WHERE name = 'Serviços gerais')),
('Orientações', 'Orientações nutricionais, psicológicas', (SELECT id FROM public.exam_categories WHERE name = 'Serviços gerais'))
ON CONFLICT (name, category_id) DO NOTHING;
