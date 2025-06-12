
-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    role TEXT CHECK (role IN ('user', 'admin', 'superadmin')) DEFAULT 'user',
    company_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create companies table
CREATE TABLE IF NOT EXISTS public.companies (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    cnpj TEXT UNIQUE,
    status TEXT CHECK (status IN ('active', 'inactive', 'pending')) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create locations table
CREATE TABLE IF NOT EXISTS public.locations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    zip_code TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create exams table
CREATE TABLE IF NOT EXISTS public.exams (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    code TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL,
    preparation TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create company_services table
CREATE TABLE IF NOT EXISTS public.company_services (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    exam_id UUID REFERENCES public.exams(id) ON DELETE CASCADE,
    price DECIMAL(10,2) NOT NULL,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(company_id, exam_id)
);

-- Create orders table
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    location_id UUID REFERENCES public.locations(id) ON DELETE CASCADE,
    total_amount DECIMAL(10,2) NOT NULL,
    status TEXT CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')) DEFAULT 'pending',
    scheduled_date TIMESTAMP WITH TIME ZONE,
    patient_name TEXT NOT NULL,
    patient_cpf TEXT NOT NULL,
    patient_phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    service_id UUID REFERENCES public.company_services(id) ON DELETE CASCADE,
    quantity INTEGER DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add foreign key constraint to profiles (if not exists)
DO $$ BEGIN
    ALTER TABLE public.profiles 
    ADD CONSTRAINT profiles_company_id_fkey 
    FOREIGN KEY (company_id) REFERENCES public.companies(id) ON DELETE SET NULL;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Insert some sample data
INSERT INTO public.companies (id, name, cnpj, status) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'Laboratório São Paulo', '12.345.678/0001-90', 'active'),
('550e8400-e29b-41d4-a716-446655440001', 'Clínica CardioVida', '98.765.432/0001-10', 'active'),
('550e8400-e29b-41d4-a716-446655440002', 'Centro Diagnóstico Beta', '11.222.333/0001-44', 'pending')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.exams (id, name, code, category, preparation, description) VALUES
('650e8400-e29b-41d4-a716-446655440000', 'Hemograma Completo', 'HEM001', 'sangue', 'Jejum de 8 horas', 'Avaliação completa das células sanguíneas'),
('650e8400-e29b-41d4-a716-446655440001', 'Glicemia de Jejum', 'GLI001', 'sangue', 'Jejum de 12 horas', 'Dosagem de glicose no sangue'),
('650e8400-e29b-41d4-a716-446655440002', 'Ultrassom Abdome Total', 'USG001', 'imagem', 'Bexiga cheia, jejum de 6 horas', 'Exame de ultrassom do abdome completo')
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view company data" ON public.companies
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND (profiles.role = 'admin' AND profiles.company_id = companies.id)
            OR profiles.role = 'superadmin'
        )
    );

CREATE POLICY "Anyone can view active exams" ON public.exams
    FOR SELECT USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_company_id ON public.profiles(company_id);
CREATE INDEX IF NOT EXISTS idx_locations_company_id ON public.locations(company_id);
CREATE INDEX IF NOT EXISTS idx_company_services_company_id ON public.company_services(company_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_company_id ON public.orders(company_id);
