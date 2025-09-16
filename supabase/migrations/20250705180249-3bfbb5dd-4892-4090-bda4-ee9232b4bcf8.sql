-- Create admin roles system
CREATE TYPE public.admin_role AS ENUM ('super_admin', 'manager', 'staff');

-- Create admin_users table for role-based access
CREATE TABLE public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role admin_role NOT NULL DEFAULT 'staff',
  permissions JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check admin roles
CREATE OR REPLACE FUNCTION public.is_admin_user(_user_id UUID, _role admin_role DEFAULT NULL)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admin_users
    WHERE user_id = _user_id
    AND (_role IS NULL OR role = _role OR role = 'super_admin')
  )
$$;

-- Create RLS policies for admin_users
CREATE POLICY "Super admins can manage all admin users"
ON public.admin_users
FOR ALL
TO authenticated
USING (public.is_admin_user(auth.uid(), 'super_admin'))
WITH CHECK (public.is_admin_user(auth.uid(), 'super_admin'));

CREATE POLICY "Admin users can view their own record"
ON public.admin_users
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Create audit log table for tracking admin actions
CREATE TABLE public.admin_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID REFERENCES public.admin_users(user_id) NOT NULL,
  action TEXT NOT NULL,
  table_name TEXT,
  record_id TEXT,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on audit log
ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;

-- Create policy for audit log access
CREATE POLICY "Admin users can view audit logs"
ON public.admin_audit_log
FOR SELECT
TO authenticated  
USING (public.is_admin_user(auth.uid()));

-- Insert initial admin users (replace with actual admin emails)
INSERT INTO public.admin_users (user_id, role) 
SELECT id, 'super_admin' 
FROM auth.users 
WHERE email IN ('admin@example.com', 'kclai3@gmail.com');

-- Create trigger for updating updated_at
CREATE TRIGGER update_admin_users_updated_at
  BEFORE UPDATE ON public.admin_users
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Update orders RLS policies to allow admin access
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;
CREATE POLICY "Users can view their own orders or admins can view all"
ON public.orders
FOR SELECT
TO authenticated
USING (auth.uid() = user_id OR public.is_admin_user(auth.uid()));

DROP POLICY IF EXISTS "Users can update their own orders" ON public.orders;
CREATE POLICY "Users can update their own orders or admins can update all"
ON public.orders
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id OR public.is_admin_user(auth.uid()));

-- Allow admins to delete orders
CREATE POLICY "Admins can delete orders"
ON public.orders
FOR DELETE
TO authenticated
USING (public.is_admin_user(auth.uid()));

-- Update order_items RLS policies for admin access
DROP POLICY IF EXISTS "Users can view their own order items" ON public.order_items;
CREATE POLICY "Users can view their own order items or admins can view all"
ON public.order_items
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM orders 
    WHERE orders.id = order_items.order_id 
    AND (orders.user_id = auth.uid() OR public.is_admin_user(auth.uid()))
  )
);

-- Allow admins to insert/update/delete order items
CREATE POLICY "Admins can manage order items"
ON public.order_items
FOR ALL
TO authenticated
USING (public.is_admin_user(auth.uid()))
WITH CHECK (public.is_admin_user(auth.uid()));