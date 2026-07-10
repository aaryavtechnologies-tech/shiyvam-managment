-- PHASE 5: Onboarding & Multi-Step Wizard Schema

-- 1. Updates to public.users
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS current_step INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS last_saved_at TIMESTAMPTZ DEFAULT NOW();

-- 2. Updates to public.companies (for Employer Onboarding)
CREATE TABLE IF NOT EXISTS public.companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employer_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  logo_url TEXT,
  website TEXT,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.companies
ADD COLUMN IF NOT EXISTS industry TEXT,
ADD COLUMN IF NOT EXISTS founded_year INTEGER,
ADD COLUMN IF NOT EXISTS company_size TEXT,
ADD COLUMN IF NOT EXISTS location TEXT,
ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS mission TEXT,
ADD COLUMN IF NOT EXISTS vision TEXT,
ADD COLUMN IF NOT EXISTS social_links JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS benefits TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS office_locations JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS working_days TEXT,
ADD COLUMN IF NOT EXISTS working_hours TEXT,
ADD COLUMN IF NOT EXISTS remote_policy TEXT,
ADD COLUMN IF NOT EXISTS cover_image TEXT,
ADD COLUMN IF NOT EXISTS gallery_images TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS profile_completion INTEGER DEFAULT 0;

-- 3. Storage Buckets (if they don't exist yet)
INSERT INTO storage.buckets (id, name, public) VALUES ('candidate-avatars', 'candidate-avatars', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('candidate-resumes', 'candidate-resumes', false) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('company-logos', 'company-logos', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('company-assets', 'company-assets', true) ON CONFLICT (id) DO NOTHING;

-- Storage RLS Policies (Company Logos)
DROP POLICY IF EXISTS "Public logos are viewable by everyone" ON storage.objects;
CREATE POLICY "Public logos are viewable by everyone" ON storage.objects FOR SELECT USING (bucket_id = 'company-logos');

DROP POLICY IF EXISTS "Employers can upload logos" ON storage.objects;
CREATE POLICY "Employers can upload logos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'company-logos' AND auth.uid()::text = (storage.foldername(name))[1]);

DROP POLICY IF EXISTS "Employers can update logos" ON storage.objects;
CREATE POLICY "Employers can update logos" ON storage.objects FOR UPDATE USING (bucket_id = 'company-logos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Storage RLS Policies (Company Assets)
DROP POLICY IF EXISTS "Public company assets viewable by everyone" ON storage.objects;
CREATE POLICY "Public company assets viewable by everyone" ON storage.objects FOR SELECT USING (bucket_id = 'company-assets');

DROP POLICY IF EXISTS "Employers can upload assets" ON storage.objects;
CREATE POLICY "Employers can upload assets" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'company-assets' AND auth.uid()::text = (storage.foldername(name))[1]);

DROP POLICY IF EXISTS "Employers can update assets" ON storage.objects;
CREATE POLICY "Employers can update assets" ON storage.objects FOR UPDATE USING (bucket_id = 'company-assets' AND auth.uid()::text = (storage.foldername(name))[1]);
