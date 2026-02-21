
-- Allow authenticated users to insert their own admin profile
CREATE POLICY "Users can insert own admin profile" ON public.admin_profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Allow authenticated users to insert applications (for testing/future use)
CREATE POLICY "Admins can insert applications" ON public.applications
  FOR INSERT TO authenticated WITH CHECK (
    college_id IN (SELECT college_id FROM public.admin_profiles WHERE user_id = auth.uid())
  );
