
-- Adicionar campos globais aos exams
ALTER TABLE exams 
ADD COLUMN related_diseases TEXT,
ADD COLUMN patient_friendly_description TEXT;

-- Comentários para documentar os campos
COMMENT ON COLUMN exams.related_diseases IS 'Doenças relacionadas ao exame (separadas por vírgula)';
COMMENT ON COLUMN exams.patient_friendly_description IS 'Descrição simplificada e amigável para o paciente';

-- Adicionar campos específicos por laboratório na tabela company_services
ALTER TABLE company_services 
ADD COLUMN delivery_days INTEGER DEFAULT 1,
ADD COLUMN available_days TEXT[] DEFAULT ARRAY['monday','tuesday','wednesday','thursday','friday'],
ADD COLUMN custom_preparation TEXT,
ADD COLUMN lab_notes TEXT;

-- Comentários para documentar os novos campos
COMMENT ON COLUMN company_services.delivery_days IS 'Prazo de entrega em dias úteis';
COMMENT ON COLUMN company_services.available_days IS 'Dias da semana disponíveis para coleta';
COMMENT ON COLUMN company_services.custom_preparation IS 'Preparação personalizada do laboratório (sobrescreve a padrão)';
COMMENT ON COLUMN company_services.lab_notes IS 'Observações específicas do laboratório';
