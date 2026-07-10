-- 1. Drop ALL policies that use the deprecated 'owner' column
DROP POLICY IF EXISTS "Users can upload their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Candidates can upload their own resume" ON storage.objects;
DROP POLICY IF EXISTS "Candidates can read their own resume" ON storage.objects;
DROP POLICY IF EXISTS "Employers can read candidate resumes" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view avatars" ON storage.objects;

-- Also drop the ones we identified earlier just in case
DROP POLICY IF EXISTS "Employers can view candidate resumes" ON storage.objects;
DROP POLICY IF EXISTS "Employers can view candidate resumes if applied" ON storage.objects;
DROP POLICY IF EXISTS "Candidates can upload resumes" ON storage.objects;
DROP POLICY IF EXISTS "Candidates can update resumes" ON storage.objects;
DROP POLICY IF EXISTS "Candidates can view their own resumes" ON storage.objects;
DROP POLICY IF EXISTS "Candidates can upload their own resumes" ON storage.objects;
DROP POLICY IF EXISTS "Candidates can update their own resumes" ON storage.objects;
DROP POLICY IF EXISTS "Candidates can delete their own resumes" ON storage.objects;

-- 2. Recreate policies using the modern (storage.foldername(name))[1] syntax instead of 'owner'
CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own avatar"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Anyone can view avatars"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'avatars');

CREATE POLICY "Candidates can upload resumes" 
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'candidate-resumes' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Candidates can view their own resumes" 
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'candidate-resumes' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Employers can view candidate resumes" 
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'candidate-resumes' 
  AND EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND role = 'employer'
  )
);
