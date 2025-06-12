
-- Remover o campo patient_friendly_description da tabela services
ALTER TABLE services DROP COLUMN IF EXISTS patient_friendly_description;
