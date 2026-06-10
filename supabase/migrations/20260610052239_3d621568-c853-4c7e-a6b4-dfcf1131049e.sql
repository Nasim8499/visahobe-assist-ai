
-- generated-images: owner-only access (path prefix = user id)
CREATE POLICY "Users read own generated images"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'generated-images' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Users upload own generated images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'generated-images' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Users delete own generated images"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'generated-images' AND (storage.foldername(name))[1] = auth.uid()::text);

-- kb-files: owner-only access
CREATE POLICY "Users read own kb files"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'kb-files' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Users upload own kb files"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'kb-files' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Users delete own kb files"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'kb-files' AND (storage.foldername(name))[1] = auth.uid()::text);
