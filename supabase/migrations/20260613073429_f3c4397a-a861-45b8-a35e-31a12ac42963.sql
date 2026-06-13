
-- Avatars: users can read/write their own folder
CREATE POLICY "avatars_select_own" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "avatars_insert_own" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "avatars_update_own" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "avatars_delete_own" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Valid IDs: same — owner-only; admins can also view
CREATE POLICY "validids_select_own" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'valid-ids' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "validids_insert_own" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'valid-ids' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "validids_update_own" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'valid-ids' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "validids_admins_select" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'valid-ids' AND public.has_role(auth.uid(), 'admin'));
