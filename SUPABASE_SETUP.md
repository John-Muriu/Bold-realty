# Supabase Setup Instructions

The application requires a Storage Bucket and a few Database Tables to function correctly.

## 1. Create 'images' Storage Bucket

To enable image uploads for properties, you must create a public storage bucket.

1.  Login to your [Supabase Dashboard](https://supabase.com/dashboard).
2.  Select your project.
3.  Go to **Storage** in the left sidebar.
4.  Click **New Bucket**.
5.  Name the bucket: `images` (must be exact).
6.  Toggle **Public bucket** to `ON` (so users can view the images).
7.  Click **Save**.

### 1a. Storage Policies (If Required)

If uploads still fail, you may need to add policies to allow uploads. Go to the **Configuration** or **Policies** tab of your bucket:

*   **SELECT**: Enable for anyone (Public).
*   **INSERT**: Enable for authenticated users (or anyone if testing).
    *   Policy Template: `Give users access to their own folder` or custom.
    *   Simple Policy (for testing): `true` (Allows anyone to upload - NOT SECURE FOR PRODUCTION).
    *   Secure Policy: `auth.uid() = owner_id` (requires you to save owner_id in metadata).

Given the current simple implementation, a policy like this for INSERT is often used for early dev:

```sql
-- Allow anyone to upload images (Dev only)
CREATE POLICY "Allow Public Uploads" ON storage.objects FOR INSERT WITH CHECK ( bucket_id = 'images' );
```

## 2. Database Schema

The database schema should have been applied via migrations. If you see errors about missing tables (`properties`, `testimonials`, `inquiries`), please run the SQL found in:
`supabase/migrations/20251223095553_547f518e-4213-4c13-95b0-0a02d7818915.sql`
