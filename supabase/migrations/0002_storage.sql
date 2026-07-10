-- Setup storage buckets
INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('avatars', 'avatars', false),
  ('resumes', 'resumes', false)
ON CONFLICT (id) DO NOTHING;

-- Avatars Policies
CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars' AND 
  auth.uid() = owner
);

CREATE POLICY "Users can update their own avatar"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'avatars' AND 
  auth.uid() = owner
);

CREATE POLICY "Anyone can view avatars"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'avatars');

-- Resumes Policies
CREATE POLICY "Candidates can upload their own resume"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'resumes' AND 
  auth.uid() = owner AND
  (SELECT role FROM public.users WHERE id = auth.uid()) = 'candidate'
);

CREATE POLICY "Candidates can read their own resume"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'resumes' AND 
  auth.uid() = owner
);

CREATE POLICY "Employers can read candidate resumes"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'resumes' AND
  (SELECT role FROM public.users WHERE id = auth.uid()) = 'employer'
);
