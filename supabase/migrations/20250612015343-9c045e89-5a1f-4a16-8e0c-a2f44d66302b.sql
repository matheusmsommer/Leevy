
-- Add synonyms column to exams table
ALTER TABLE public.exams 
ADD COLUMN synonyms TEXT;

-- Update existing exams with some sample synonyms for testing
UPDATE public.exams 
SET synonyms = CASE 
  WHEN name = 'Hemograma Completo' THEN 'Hemograma, CBC, Complete Blood Count'
  WHEN name = 'Glicemia de Jejum' THEN 'Glicose, Glucose, GLI'
  WHEN name = 'Ultrassom Abdome Total' THEN 'US Abdome, Ultrassom Abdominal, Echo Abdome'
  ELSE NULL
END;
