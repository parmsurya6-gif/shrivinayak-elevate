
ALTER TABLE public.job_applications
  ADD COLUMN IF NOT EXISTS qualification text,
  ADD COLUMN IF NOT EXISTS gender text,
  ADD COLUMN IF NOT EXISTS expected_salary text,
  ADD COLUMN IF NOT EXISTS previous_salary text,
  ADD COLUMN IF NOT EXISTS previous_company text,
  ADD COLUMN IF NOT EXISTS current_designation text;

ALTER TABLE public.job_postings
  ADD COLUMN IF NOT EXISTS salary_range text,
  ADD COLUMN IF NOT EXISTS requirements text,
  ADD COLUMN IF NOT EXISTS experience_required text;
