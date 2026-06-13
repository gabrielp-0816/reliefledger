REVOKE ALL ON public.profiles FROM anon, authenticated;
REVOKE ALL ON public.user_roles FROM anon, authenticated;
REVOKE ALL ON public.donations FROM anon, authenticated;
REVOKE ALL ON public.saved_campaigns FROM anon, authenticated;

GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT SELECT ON public.user_roles TO authenticated;
GRANT SELECT, INSERT ON public.donations TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.saved_campaigns TO authenticated;

GRANT ALL ON public.profiles TO service_role;
GRANT ALL ON public.user_roles TO service_role;
GRANT ALL ON public.donations TO service_role;
GRANT ALL ON public.saved_campaigns TO service_role;