-- Alter companies table for verification
ALTER TABLE public.companies 
ADD COLUMN IF NOT EXISTS pan_number TEXT,
ADD COLUMN IF NOT EXISTS gst_number TEXT,
ADD COLUMN IF NOT EXISTS cin_number TEXT,
ADD COLUMN IF NOT EXISTS verification_status TEXT DEFAULT 'pending'; -- 'pending', 'verified', 'rejected'

-- Employer Approval History
CREATE TABLE IF NOT EXISTS public.employer_approval_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employer_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  admin_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  old_status TEXT,
  new_status TEXT NOT NULL,
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Candidate profiles additions
ALTER TABLE public.candidate_profiles
ADD COLUMN IF NOT EXISTS assigned_recruiter_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS candidate_status TEXT DEFAULT 'pending'; -- 'pending', 'shortlisted', 'rejected'

-- Jobs table updates
ALTER TABLE public.jobs
ADD COLUMN IF NOT EXISTS admin_status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected', 'expired'
ADD COLUMN IF NOT EXISTS rejection_reason TEXT;

-- RLS Policies for new table
ALTER TABLE public.employer_approval_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin full access employer_approval_history" 
ON public.employer_approval_history 
FOR ALL 
USING (
  (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
);

CREATE POLICY "Employers can view their own approval history" 
ON public.employer_approval_history 
FOR SELECT 
USING (employer_id = auth.uid());
