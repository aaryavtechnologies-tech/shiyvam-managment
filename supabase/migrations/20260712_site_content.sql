CREATE TABLE IF NOT EXISTS public.site_statistics (
  id INT PRIMARY KEY DEFAULT 1,
  active_jobs TEXT NOT NULL DEFAULT '1500+',
  companies TEXT NOT NULL DEFAULT '500+',
  success_stories TEXT NOT NULL DEFAULT '50K+'
);

-- Seed data for site_statistics
INSERT INTO public.site_statistics (id, active_jobs, companies, success_stories)
VALUES (1, '1500+', '500+', '50K+')
ON CONFLICT (id) DO UPDATE SET
  active_jobs = EXCLUDED.active_jobs,
  companies = EXCLUDED.companies,
  success_stories = EXCLUDED.success_stories;

-- Testimonials
CREATE TABLE IF NOT EXISTS public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_name TEXT NOT NULL,
  author_role TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed basic testimonial (inactive by default to hide until client edits)
INSERT INTO public.testimonials (author_name, author_role, content, is_active)
VALUES ('Sample Client', 'CEO at Company', 'Great service!', false);

-- Trusted Companies
CREATE TABLE IF NOT EXISTS public.trusted_companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  logo_url TEXT,
  is_active BOOLEAN DEFAULT true,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO public.trusted_companies (name, is_active)
VALUES ('Sample Enterprise', false);

-- Success Stories
CREATE TABLE IF NOT EXISTS public.success_stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_name TEXT NOT NULL,
  previous_role TEXT NOT NULL,
  new_role TEXT NOT NULL,
  company TEXT NOT NULL,
  salary_hike TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO public.success_stories (candidate_name, previous_role, new_role, company, salary_hike, is_active)
VALUES ('Sample Candidate', 'Analyst', 'Manager', 'Enterprise Inc', '50% Hike', false);

-- RLS Policies
ALTER TABLE public.site_statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trusted_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.success_stories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access for site_statistics" ON public.site_statistics FOR SELECT USING (true);
CREATE POLICY "Allow admin full access for site_statistics" ON public.site_statistics FOR ALL USING (auth.role() = 'authenticated' AND (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Allow public read access for testimonials" ON public.testimonials FOR SELECT USING (true);
CREATE POLICY "Allow admin full access for testimonials" ON public.testimonials FOR ALL USING (auth.role() = 'authenticated' AND (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Allow public read access for trusted_companies" ON public.trusted_companies FOR SELECT USING (true);
CREATE POLICY "Allow admin full access for trusted_companies" ON public.trusted_companies FOR ALL USING (auth.role() = 'authenticated' AND (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Allow public read access for success_stories" ON public.success_stories FOR SELECT USING (true);
CREATE POLICY "Allow admin full access for success_stories" ON public.success_stories FOR ALL USING (auth.role() = 'authenticated' AND (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin');
