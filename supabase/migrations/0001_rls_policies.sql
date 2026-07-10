-- Enable RLS on the users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 1. Admins can do everything
CREATE POLICY "Admins have full access to users"
ON public.users
FOR ALL
USING (
  (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
);

-- 2. Users can read their own profile
CREATE POLICY "Users can view their own profile"
ON public.users
FOR SELECT
USING (auth.uid() = id);

-- 3. Users can update their own profile
CREATE POLICY "Users can update their own profile"
ON public.users
FOR UPDATE
USING (auth.uid() = id);

-- 4. Employers can view candidate profiles (stub for future expanded logic)
-- Note: This is basic. In a real app, an employer might only view candidates 
-- who applied to their jobs. We'll leave it as general read access for now,
-- but filter out other employers or admins.
CREATE POLICY "Employers can view candidate profiles"
ON public.users
FOR SELECT
USING (
  (SELECT role FROM public.users WHERE id = auth.uid()) = 'employer'
  AND role = 'candidate'
);
