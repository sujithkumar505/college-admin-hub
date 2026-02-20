
-- Colleges table
CREATE TABLE public.colleges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  location TEXT NOT NULL,
  university TEXT,
  type TEXT DEFAULT 'Engineering',
  established_year INTEGER,
  website TEXT,
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.colleges ENABLE ROW LEVEL SECURITY;

-- Colleges are publicly readable (for code verification)
CREATE POLICY "Colleges are publicly readable" ON public.colleges
  FOR SELECT USING (true);

-- Admin profiles linked to auth.users and a college
CREATE TABLE public.admin_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read own profile" ON public.admin_profiles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Admins can update own profile" ON public.admin_profiles
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Scholarships table
CREATE TABLE public.scholarships (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL DEFAULT 'Merit-based',
  eligibility_criteria JSONB DEFAULT '{}',
  min_cgpa NUMERIC(3,1),
  max_income NUMERIC(12,2),
  total_seats INTEGER DEFAULT 0,
  filled_seats INTEGER DEFAULT 0,
  amount NUMERIC(12,2) DEFAULT 0,
  status TEXT DEFAULT 'Active',
  deadline TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.scholarships ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read own college scholarships" ON public.scholarships
  FOR SELECT TO authenticated USING (
    college_id IN (SELECT college_id FROM public.admin_profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Admins can insert own college scholarships" ON public.scholarships
  FOR INSERT TO authenticated WITH CHECK (
    college_id IN (SELECT college_id FROM public.admin_profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Admins can update own college scholarships" ON public.scholarships
  FOR UPDATE TO authenticated USING (
    college_id IN (SELECT college_id FROM public.admin_profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Admins can delete own college scholarships" ON public.scholarships
  FOR DELETE TO authenticated USING (
    college_id IN (SELECT college_id FROM public.admin_profiles WHERE user_id = auth.uid())
  );

-- Applications table
CREATE TABLE public.applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
  scholarship_id UUID NOT NULL REFERENCES public.scholarships(id) ON DELETE CASCADE,
  student_name TEXT NOT NULL,
  student_roll TEXT NOT NULL,
  student_email TEXT,
  department TEXT,
  year_of_study INTEGER,
  cgpa NUMERIC(3,1),
  family_income NUMERIC(12,2),
  status TEXT DEFAULT 'Pending',
  ai_score NUMERIC(5,2),
  documents JSONB DEFAULT '[]',
  applied_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID REFERENCES auth.users(id)
);

ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read own college applications" ON public.applications
  FOR SELECT TO authenticated USING (
    college_id IN (SELECT college_id FROM public.admin_profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Admins can update own college applications" ON public.applications
  FOR UPDATE TO authenticated USING (
    college_id IN (SELECT college_id FROM public.admin_profiles WHERE user_id = auth.uid())
  );

-- Audit logs table
CREATE TABLE public.audit_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
  admin_user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  details JSONB DEFAULT '{}',
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read own college audit logs" ON public.audit_logs
  FOR SELECT TO authenticated USING (
    college_id IN (SELECT college_id FROM public.admin_profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Admins can insert own college audit logs" ON public.audit_logs
  FOR INSERT TO authenticated WITH CHECK (
    college_id IN (SELECT college_id FROM public.admin_profiles WHERE user_id = auth.uid())
  );

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_admin_profiles_updated_at
  BEFORE UPDATE ON public.admin_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_scholarships_updated_at
  BEFORE UPDATE ON public.scholarships
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
