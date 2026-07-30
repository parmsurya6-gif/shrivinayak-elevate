CREATE TABLE public.application_timeline (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid NOT NULL REFERENCES public.job_applications(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  event_at timestamptz NOT NULL DEFAULT now(),
  status text NOT NULL DEFAULT 'pending',
  position integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.application_timeline TO authenticated;
GRANT ALL ON public.application_timeline TO service_role;

ALTER TABLE public.application_timeline ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage application timeline"
ON public.application_timeline FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_application_timeline_updated_at
BEFORE UPDATE ON public.application_timeline
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_application_timeline_app ON public.application_timeline(application_id, position);