-- RUN THIS ENTIRE SNIPPET IN SUPABASE SQL EDITOR --

-- 1. First, forcefully drop ANY potentially broken policies
DROP POLICY IF EXISTS "Employers can view candidate resumes" ON storage.objects;
DROP POLICY IF EXISTS "Employers can view candidate resumes if applied" ON storage.objects;
DROP POLICY IF EXISTS "Candidates can upload resumes" ON storage.objects;
DROP POLICY IF EXISTS "Candidates can update resumes" ON storage.objects;
DROP POLICY IF EXISTS "Candidates can view their own resumes" ON storage.objects;
DROP POLICY IF EXISTS "Candidates can upload their own resumes" ON storage.objects;
DROP POLICY IF EXISTS "Candidates can update their own resumes" ON storage.objects;
DROP POLICY IF EXISTS "Candidates can delete their own resumes" ON storage.objects;

-- 2. Create the exact correct policies
CREATE POLICY "Candidates can upload resumes" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'candidate-resumes' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Candidates can view their own resumes" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'candidate-resumes' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Employers can view candidate resumes" 
ON storage.objects FOR SELECT 
USING (
  bucket_id = 'candidate-resumes' 
  AND EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND role = 'employer'
  )
);
