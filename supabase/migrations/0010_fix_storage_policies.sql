-- Fix the policy for employers to view candidate resumes
DROP POLICY IF EXISTS "Employers can view candidate resumes" ON storage.objects;

CREATE POLICY "Employers can view candidate resumes" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'candidate-resumes' 
  AND EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND role = 'employer'
  )
);
