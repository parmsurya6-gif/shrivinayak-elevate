
-- Create job_postings table for admin-managed job listings
CREATE TABLE public.job_postings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  department TEXT NOT NULL,
  location TEXT NOT NULL DEFAULT 'Chakan, Pune',
  type TEXT NOT NULL DEFAULT 'Full-time',
  description TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.job_postings ENABLE ROW LEVEL SECURITY;

-- Anyone can view active postings
CREATE POLICY "Anyone can view active job postings"
ON public.job_postings FOR SELECT
USING (is_active = true);

-- Admins can do everything
CREATE POLICY "Admins can manage job postings"
ON public.job_postings FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Trigger for updated_at
CREATE TRIGGER update_job_postings_updated_at
BEFORE UPDATE ON public.job_postings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Seed with existing jobs
INSERT INTO public.job_postings (title, department, location, type, description) VALUES
('CNC Machine Operator', 'Production', 'Chakan, Pune', 'Full-time', 'Operate and maintain CNC turning and milling machines. Minimum 2 years of experience with precision machined components required.'),
('Quality Inspector', 'Quality Assurance', 'Chakan, Pune', 'Full-time', 'Perform dimensional inspection using CMM, profile projector, and other measuring instruments. Knowledge of IATF 16949 standards preferred.'),
('Welding Technician', 'Production', 'Chakan, Pune', 'Full-time', 'MIG/TIG welding of assemblies and sub-assemblies for automotive and industrial clients. Minimum 3 years of experience.'),
('Production Engineer', 'Engineering', 'Chakan, Pune', 'Full-time', 'Plan and optimize manufacturing processes, ensure on-time delivery, and drive continuous improvement initiatives.');
