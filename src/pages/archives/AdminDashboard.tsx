
import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { SidebarProvider } from "@/components/ui/sidebar";
import { useAuth } from '@/context/AuthContext';
import { checkAdminStatus } from '@/services/admin/adminAuth';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminContent from '@/components/admin/AdminContent';
import { toast } from 'sonner';

const AdminDashboard = () => {
  const { user, isLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const location = useLocation();
  
  // Set products tab active when returning from add/edit product
  useEffect(() => {
    // Check if we're coming from product add/edit pages
    const fromProductPage = location.state?.from === 'product-edit' || 
                            location.state?.from === 'product-add';
    
    if (fromProductPage) {
      setActiveTab('products');
    }
  }, [location]);
  
  // Check if user is admin using enhanced auth system
  useEffect(() => {
    const checkAdmin = async () => {
      if (!user || isLoading) return;
      
      try {
        const { isAdmin: adminStatus } = await checkAdminStatus();
        setIsAdmin(adminStatus);
        
        if (!adminStatus) {
          toast.error('You do not have admin privileges');
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
        toast.error('Error verifying admin access');
      }
    };

    checkAdmin();
  }, [user, isLoading]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Redirect non-admin users
  if (!isAdmin && !isLoading) {
    return <Navigate to="/" replace />;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="container mx-auto p-6">
          <AdminHeader />
          <AdminContent activeTab={activeTab} />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminDashboard;
