
import React from 'react';
import AdminCategories from '@/components/admin/AdminCategories';
import AdminProducts from '@/components/admin/AdminProducts';
import AdminOrders from '@/components/admin/AdminOrders';
import AdminInventory from '@/components/admin/AdminInventory';
import AdminDelivery from '@/components/admin/AdminDelivery';
import AdminVideos from '@/components/admin/AdminVideos';
import AdminArticles from '@/components/admin/AdminArticles';
import EnhancedAdminDashboard from '@/components/admin/enhanced/EnhancedAdminDashboard';

interface AdminContentProps {
  activeTab: string;
}

const AdminContent = ({ activeTab }: AdminContentProps) => {
  const getTabContent = () => {
    switch(activeTab) {
      case 'dashboard':
        return <EnhancedAdminDashboard />;
      case 'categories':
        return <AdminCategories />;
      case 'products':
        return <AdminProducts />;
      case 'inventory':
        return <AdminInventory />;
      case 'delivery':
        return <AdminDelivery />;
      case 'orders':
        return <AdminOrders />;
      case 'videos':
        return <AdminVideos />;
      case 'articles':
        return <AdminArticles />;
      default:
        return <EnhancedAdminDashboard />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      {getTabContent()}
    </div>
  );
};

export default AdminContent;
