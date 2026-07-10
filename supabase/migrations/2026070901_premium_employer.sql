-- 1. Modify companies table
ALTER TABLE public.companies 
ADD COLUMN IF NOT EXISTS industry text,
ADD COLUMN IF NOT EXISTS location text,
ADD COLUMN IF NOT EXISTS company_size text,
ADD COLUMN IF NOT EXISTS mission text,
ADD COLUMN IF NOT EXISTS remote_policy text,
ADD COLUMN IF NOT EXISTS cover_image_url text,
ADD COLUMN IF NOT EXISTS social_links jsonb,
ADD COLUMN IF NOT EXISTS gallery_urls text[];

-- 2. Modify jobs table
ALTER TABLE public.jobs 
ADD COLUMN IF NOT EXISTS department text,
ADD COLUMN IF NOT EXISTS vacancies integer DEFAULT 1,
ADD COLUMN IF NOT EXISTS work_mode text,
ADD COLUMN IF NOT EXISTS education_requirement text,
ADD COLUMN IF NOT EXISTS custom_questions jsonb,
ADD COLUMN IF NOT EXISTS status text DEFAULT 'Draft';

-- 3. Create application_notes table
CREATE TABLE IF NOT EXISTS public.application_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
  employer_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  note text NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- 4. Set up RLS for application_notes
ALTER TABLE public.application_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Employers can manage their own notes" 
ON public.application_notes 
FOR ALL 
USING (auth.uid() = employer_id)
WITH CHECK (auth.uid() = employer_id);
