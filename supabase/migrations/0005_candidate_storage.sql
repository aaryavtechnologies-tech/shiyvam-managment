-- PHASE 3: Candidate Module Storage Configuration

-- Create buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('candidate-avatars', 'candidate-avatars', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']::text[]),
  ('candidate-resumes', 'candidate-resumes', false, 10485760, ARRAY['application/pdf']::text[])
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- 1. AVATARS (Public Read, Owner Write)
CREATE POLICY "Public can view avatars"
ON storage.objects FOR SELECT
USING (bucket_id = 'candidate-avatars');

CREATE POLICY "Candidates can upload their own avatars"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'candidate-avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Candidates can update their own avatars"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'candidate-avatars' AND (storage.foldername(name))[1] = auth.uid()::text)
WITH CHECK (bucket_id = 'candidate-avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Candidates can delete their own avatars"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'candidate-avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

-- 2. RESUMES (Private Read/Write, Employer Read)
CREATE POLICY "Candidates can view their own resumes"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'candidate-resumes' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Employers can view candidate resumes if applied"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'candidate-resumes' AND 
  EXISTS (
    SELECT 1 FROM public.applications a
    JOIN public.jobs j ON j.id = a.job_id
    WHERE a.candidate_id::text = (storage.foldername(name))[1]
    AND j.employer_id = auth.uid()
  )
);

CREATE POLICY "Candidates can upload their own resumes"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'candidate-resumes' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Candidates can update their own resumes"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'candidate-resumes' AND (storage.foldername(name))[1] = auth.uid()::text)
WITH CHECK (bucket_id = 'candidate-resumes' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Candidates can delete their own resumes"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'candidate-resumes' AND (storage.foldername(name))[1] = auth.uid()::text);
