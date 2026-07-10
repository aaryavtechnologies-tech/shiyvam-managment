-- PHASE 3: Candidate Module Row Level Security

-- 1. COMPANIES & JOBS (Read-Only for Candidates, Full access for Employers covered later)
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view companies"
ON public.companies FOR SELECT
USING (true);

CREATE POLICY "Anyone can view published jobs"
ON public.jobs FOR SELECT
USING (status = 'published');

-- 2. CANDIDATE PROFILES
ALTER TABLE public.candidate_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Candidates can view their own profile"
ON public.candidate_profiles FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Employers can view profiles if there is an application (simplified for now, full query involves applications table)
CREATE POLICY "Employers can view candidate profiles of applicants"
ON public.candidate_profiles FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.applications a
    JOIN public.jobs j ON j.id = a.job_id
    WHERE a.candidate_id = candidate_profiles.user_id
    AND j.employer_id = auth.uid()
  )
);

CREATE POLICY "Candidates can insert their own profile"
ON public.candidate_profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Candidates can update their own profile"
ON public.candidate_profiles FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);


-- 3. APPLICATIONS
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Candidates can view their own applications"
ON public.applications FOR SELECT
TO authenticated
USING (auth.uid() = candidate_id);

CREATE POLICY "Employers can view applications for their jobs"
ON public.applications FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.jobs j
    WHERE j.id = applications.job_id
    AND j.employer_id = auth.uid()
  )
);

CREATE POLICY "Candidates can insert their own applications"
ON public.applications FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = candidate_id);

CREATE POLICY "Candidates can withdraw their own applications"
ON public.applications FOR UPDATE
TO authenticated
USING (auth.uid() = candidate_id AND status = 'Applied')
WITH CHECK (status = 'Withdrawn');

-- Employers can update application status (Phase 2 feature context)
CREATE POLICY "Employers can update application status"
ON public.applications FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.jobs j
    WHERE j.id = applications.job_id
    AND j.employer_id = auth.uid()
  )
);

-- 4. APPLICATION STATUS HISTORY
ALTER TABLE public.application_status_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Candidates can view their own application history"
ON public.application_status_history FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.applications a
    WHERE a.id = application_status_history.application_id
    AND a.candidate_id = auth.uid()
  )
);

CREATE POLICY "Employers can view application history for their jobs"
ON public.application_status_history FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.applications a
    JOIN public.jobs j ON j.id = a.job_id
    WHERE a.id = application_status_history.application_id
    AND j.employer_id = auth.uid()
  )
);

-- 5. SAVED JOBS
ALTER TABLE public.saved_jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Candidates can view their own saved jobs"
ON public.saved_jobs FOR SELECT
TO authenticated
USING (auth.uid() = candidate_id);

CREATE POLICY "Candidates can insert their own saved jobs"
ON public.saved_jobs FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = candidate_id);

CREATE POLICY "Candidates can delete their own saved jobs"
ON public.saved_jobs FOR DELETE
TO authenticated
USING (auth.uid() = candidate_id);

-- 6. CANDIDATE NOTIFICATIONS
ALTER TABLE public.candidate_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Candidates can view their own notifications"
ON public.candidate_notifications FOR SELECT
TO authenticated
USING (auth.uid() = candidate_id);

CREATE POLICY "Candidates can update their own notifications"
ON public.candidate_notifications FOR UPDATE
TO authenticated
USING (auth.uid() = candidate_id);

CREATE POLICY "Candidates can delete their own notifications"
ON public.candidate_notifications FOR DELETE
TO authenticated
USING (auth.uid() = candidate_id);
