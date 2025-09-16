import { supabase } from '@/integrations/supabase/client';

export type AdminRole = 'super_admin' | 'manager' | 'staff';

export interface AdminUser {
  id: string;
  user_id: string;
  role: AdminRole;
  permissions: any;
  created_at: string;
  updated_at: string;
  email?: string;
  name?: string;
}

export interface AdminAuditLog {
  id: string;
  admin_user_id: string;
  action: string;
  table_name?: string;
  record_id?: string;
  old_values?: any;
  new_values?: any;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

/**
 * Check if current user is an admin
 */
export const checkAdminStatus = async (): Promise<{ isAdmin: boolean; adminUser: AdminUser | null }> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { isAdmin: false, adminUser: null };
    }

    const { data: adminUser, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error || !adminUser) {
      return { isAdmin: false, adminUser: null };
    }

    return { 
      isAdmin: true, 
      adminUser: {
        ...adminUser,
        permissions: adminUser.permissions || {},
        email: user.email,
        name: user.user_metadata?.name
      } as AdminUser
    };
  } catch (error) {
    console.error('Error checking admin status:', error);
    return { isAdmin: false, adminUser: null };
  }
};

/**
 * Check if user has specific role or permission
 */
export const hasAdminPermission = async (requiredRole?: AdminRole): Promise<boolean> => {
  const { isAdmin, adminUser } = await checkAdminStatus();
  
  if (!isAdmin || !adminUser) return false;
  
  if (!requiredRole) return true;
  
  // Super admin has all permissions
  if (adminUser.role === 'super_admin') return true;
  
  return adminUser.role === requiredRole;
};

/**
 * Log admin action for audit trail
 */
export const logAdminAction = async (
  action: string,
  tableName?: string,
  recordId?: string,
  oldValues?: Record<string, any>,
  newValues?: Record<string, any>
): Promise<void> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('admin_audit_log')
      .insert({
        admin_user_id: user.id,
        action,
        table_name: tableName,
        record_id: recordId,
        old_values: oldValues,
        new_values: newValues,
        user_agent: navigator.userAgent
      });

    if (error) {
      console.error('Error logging admin action:', error);
    }
  } catch (error) {
    console.error('Error in logAdminAction:', error);
  }
};

/**
 * Get admin audit logs
 */
export const getAdminAuditLogs = async (limit = 100): Promise<AdminAuditLog[]> => {
  try {
    const { data, error } = await supabase
      .from('admin_audit_log')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching audit logs:', error);
      return [];
    }

    return (data || []).map(log => ({
      ...log,
      old_values: log.old_values || {},
      new_values: log.new_values || {}
    })) as AdminAuditLog[];
  } catch (error) {
    console.error('Error in getAdminAuditLogs:', error);
    return [];
  }
};

/**
 * Get all admin users (super admin only)
 */
export const getAdminUsers = async (): Promise<AdminUser[]> => {
  try {
    const hasPermission = await hasAdminPermission('super_admin');
    if (!hasPermission) {
      throw new Error('Insufficient permissions');
    }

    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching admin users:', error);
      return [];
    }

    return (data || []).map(user => ({
      ...user,
      permissions: user.permissions || {}
    })) as AdminUser[];
  } catch (error) {
    console.error('Error in getAdminUsers:', error);
    return [];
  }
};