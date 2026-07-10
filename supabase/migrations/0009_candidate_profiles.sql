-- 1. Create candidate_profiles table
CREATE TABLE IF NOT EXISTS public.candidate_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  headline TEXT,
  bio TEXT,
  phone TEXT,
  date_of_birth DATE,
  gender TEXT,
  city TEXT,
  state TEXT,
  country TEXT,
  experience_level TEXT,
  current_company TEXT,
  current_position TEXT,
  current_salary TEXT,
  expected_salary TEXT,
  notice_period TEXT,
  education JSONB DEFAULT '[]'::jsonb,
  skills TEXT[] DEFAULT '{}',
  languages TEXT[] DEFAULT '{}',
  portfolio_url TEXT,
  linkedin_url TEXT,
  github_url TEXT,
  website TEXT,
  profile_image TEXT,
  resume_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.candidate_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for candidate_profiles
DROP POLICY IF EXISTS "Candidates can view their own profile" ON public.candidate_profiles;
CREATE POLICY "Candidates can view their own profile" ON public.candidate_profiles FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Candidates can update their own profile" ON public.candidate_profiles;
CREATE POLICY "Candidates can update their own profile" ON public.candidate_profiles FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Candidates can insert their own profile" ON public.candidate_profiles;
CREATE POLICY "Candidates can insert their own profile" ON public.candidate_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Storage RLS Policies (Candidate Avatars)
DROP POLICY IF EXISTS "Public avatars are viewable by everyone" ON storage.objects;
CREATE POLICY "Public avatars are viewable by everyone" ON storage.objects FOR SELECT USING (bucket_id = 'candidate-avatars');

DROP POLICY IF EXISTS "Candidates can upload avatars" ON storage.objects;
CREATE POLICY "Candidates can upload avatars" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'candidate-avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

DROP POLICY IF EXISTS "Candidates can update avatars" ON storage.objects;
CREATE POLICY "Candidates can update avatars" ON storage.objects FOR UPDATE USING (bucket_id = 'candidate-avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Storage RLS Policies (Candidate Resumes)
DROP POLICY IF EXISTS "Candidates can view their own resumes" ON storage.objects;
CREATE POLICY "Candidates can view their own resumes" ON storage.objects FOR SELECT USING (bucket_id = 'candidate-resumes' AND auth.uid()::text = (storage.foldername(name))[1]);

DROP POLICY IF EXISTS "Employers can view candidate resumes" ON storage.objects;
CREATE POLICY "Employers can view candidate resumes" ON storage.objects FOR SELECT USING (bucket_id = 'candidate-resumes' AND EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'employer'));

DROP POLICY IF EXISTS "Candidates can upload resumes" ON storage.objects;
CREATE POLICY "Candidates can upload resumes" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'candidate-resumes' AND auth.uid()::text = (storage.foldername(name))[1]);

DROP POLICY IF EXISTS "Candidates can update resumes" ON storage.objects;
CREATE POLICY "Candidates can update resumes" ON storage.objects FOR UPDATE USING (bucket_id = 'candidate-resumes' AND auth.uid()::text = (storage.foldername(name))[1]);
