
-- Create security definer function to get current user role
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT COALESCE(role, 'user') FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Update RLS policies for exams table
DROP POLICY IF EXISTS "Anyone can view active exams" ON public.exams;

CREATE POLICY "Anyone can view exams" ON public.exams
  FOR SELECT USING (true);

CREATE POLICY "Superadmins can insert exams" ON public.exams
  FOR INSERT WITH CHECK (public.get_current_user_role() = 'superadmin');

CREATE POLICY "Superadmins can update exams" ON public.exams
  FOR UPDATE USING (public.get_current_user_role() = 'superadmin');

CREATE POLICY "Superadmins can delete exams" ON public.exams
  FOR DELETE USING (public.get_current_user_role() = 'superadmin');

-- Update RLS policies for profiles table
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Allow profile creation" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Superadmins can view all profiles" ON public.profiles
  FOR SELECT USING (public.get_current_user_role() = 'superadmin');
