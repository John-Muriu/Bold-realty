-- Copy and run this SQL in your Supabase Dashboard > SQL Editor

-- Preemptively drop existing policies to prevent "already exists" errors
DROP POLICY IF EXISTS "Give public access to images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow individual updates" ON storage.objects;
DROP POLICY IF EXISTS "Allow individual deletions" ON storage.objects;

-- 1. Allow public read access (so everyone can see the images)
CREATE POLICY "Give public access to images"
ON storage.objects FOR SELECT
USING ( bucket_id = 'images' );

-- 2. Allow uploads (INSERT) for authenticated users (Admin)
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'images' );

-- OR, if you want to allow ANYONE to upload (Debug only):
-- CREATE POLICY "Allow public uploads"
-- ON storage.objects FOR INSERT
-- WITH CHECK ( bucket_id = 'images' );

-- 3. Allow updates (if you need to replace images)
CREATE POLICY "Allow individual updates"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'images' );

-- 4. Allow deletions
CREATE POLICY "Allow individual deletions"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'images' );

