GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

GRANT SELECT, INSERT ON public.donations TO authenticated;
GRANT ALL ON public.donations TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.saved_campaigns TO authenticated;
GRANT ALL ON public.saved_campaigns TO service_role;