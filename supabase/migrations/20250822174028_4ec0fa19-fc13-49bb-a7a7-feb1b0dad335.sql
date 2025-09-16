-- Restrict read access to notification_subscribers to admins only
-- Ensure RLS is enabled
ALTER TABLE public.notification_subscribers ENABLE ROW LEVEL SECURITY;

-- Drop existing broad SELECT policy if present
DROP POLICY IF EXISTS "Allow select for authenticated users only" ON public.notification_subscribers;

-- Create admin-only SELECT policy
CREATE POLICY "Only admins can view subscribers"
ON public.notification_subscribers
FOR SELECT
TO authenticated
USING (public.is_admin_user(auth.uid()));