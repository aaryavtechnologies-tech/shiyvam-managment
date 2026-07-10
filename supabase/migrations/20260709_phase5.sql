-- Phase 5 Application System Additions

ALTER TABLE public.applications
ADD COLUMN IF NOT EXISTS expected_salary TEXT,
ADD COLUMN IF NOT EXISTS notice_period TEXT,
ADD COLUMN IF NOT EXISTS portfolio_url TEXT;
