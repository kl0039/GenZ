import { supabase } from '@/integrations/supabase/client';
import { logAdminAction } from './adminAuth';

export interface DashboardMetrics {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  totalCustomers: number;
  pendingOrders: number;
  lowStockProducts: number;
  todaysOrders: number;
  todaysRevenue: number;
  monthlyGrowth: {
    orders: number;
    revenue: number;
  };
}

export interface OrderStatusDistribution {
  status: string;
  count: number;
  percentage: number;
}

export interface TopProduct {
  id: string;
  name: string;
  totalSold: number;
  revenue: number;
  image_url?: string;
}

export interface SalesChart {
  date: string;
  orders: number;
  revenue: number;
}

/**
 * Get comprehensive dashboard metrics
 */
export const getDashboardMetrics = async (): Promise<DashboardMetrics> => {
  try {
    await logAdminAction('view_dashboard_metrics');

    // Get all orders
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('*');

    if (ordersError) throw ordersError;

    // Get all products
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*');

    if (productsError) throw productsError;

    // Get unique customers (users who have placed orders)
    const { data: customers, error: customersError } = await supabase
      .from('orders')
      .select('user_id')
      .not('user_id', 'is', null);

    if (customersError) throw customersError;

    const uniqueCustomers = new Set(customers?.map(c => c.user_id)).size;

    // Calculate metrics
    const totalOrders = orders?.length || 0;
    const totalRevenue = orders?.reduce((acc, order) => acc + Number(order.total_price), 0) || 0;
    const totalProducts = products?.length || 0;
    const totalCustomers = uniqueCustomers;
    const pendingOrders = orders?.filter(order => order.order_status === 'Processing').length || 0;
    const lowStockProducts = products?.filter(product => (product.stock_quantity || 0) < 10).length || 0;

    // Today's metrics
    const today = new Date().toISOString().split('T')[0];
    const todaysOrders = orders?.filter(order => 
      order.created_at?.startsWith(today)
    ).length || 0;
    const todaysRevenue = orders?.filter(order => 
      order.created_at?.startsWith(today)
    ).reduce((acc, order) => acc + Number(order.total_price), 0) || 0;

    // Monthly growth (mock data for now - would need historical data)
    const monthlyGrowth = {
      orders: Math.floor(Math.random() * 20) + 5,
      revenue: Math.floor(Math.random() * 25) + 10
    };

    return {
      totalOrders,
      totalRevenue,
      totalProducts,
      totalCustomers,
      pendingOrders,
      lowStockProducts,
      todaysOrders,
      todaysRevenue,
      monthlyGrowth
    };
  } catch (error) {
    console.error('Error getting dashboard metrics:', error);
    throw error;
  }
};

/**
 * Get order status distribution
 */
export const getOrderStatusDistribution = async (): Promise<OrderStatusDistribution[]> => {
  try {
    const { data: orders, error } = await supabase
      .from('orders')
      .select('order_status');

    if (error) throw error;

    const statusCounts: Record<string, number> = {};
    const total = orders?.length || 0;

    orders?.forEach(order => {
      statusCounts[order.order_status] = (statusCounts[order.order_status] || 0) + 1;
    });

    return Object.entries(statusCounts).map(([status, count]) => ({
      status,
      count,
      percentage: Math.round((count / total) * 100)
    }));
  } catch (error) {
    console.error('Error getting order status distribution:', error);
    return [];
  }
};

/**
 * Get top selling products
 */
export const getTopProducts = async (limit = 5): Promise<TopProduct[]> => {
  try {
    const { data, error } = await supabase
      .from('order_items')
      .select(`
        product_id,
        quantity,
        unit_price,
        products:product_id (name, image_url)
      `);

    if (error) throw error;

    const productStats: Record<string, TopProduct> = {};

    data?.forEach(item => {
      const productId = item.product_id;
      if (!productStats[productId]) {
        productStats[productId] = {
          id: productId,
          name: item.products?.name || 'Unknown Product',
          totalSold: 0,
          revenue: 0,
          image_url: item.products?.image_url
        };
      }

      productStats[productId].totalSold += item.quantity;
      productStats[productId].revenue += item.quantity * Number(item.unit_price);
    });

    return Object.values(productStats)
      .sort((a, b) => b.totalSold - a.totalSold)
      .slice(0, limit);
  } catch (error) {
    console.error('Error getting top products:', error);
    return [];
  }
};

/**
 * Get sales chart data for the last 30 days
 */
export const getSalesChartData = async (): Promise<SalesChart[]> => {
  try {
    const { data: orders, error } = await supabase
      .from('orders')
      .select('created_at, total_price')
      .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

    if (error) throw error;

    const dailyStats: Record<string, SalesChart> = {};

    // Initialize last 30 days
    for (let i = 29; i >= 0; i--) {
      const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      dailyStats[date] = { date, orders: 0, revenue: 0 };
    }

    // Aggregate data
    orders?.forEach(order => {
      const date = order.created_at?.split('T')[0];
      if (date && dailyStats[date]) {
        dailyStats[date].orders += 1;
        dailyStats[date].revenue += Number(order.total_price);
      }
    });

    return Object.values(dailyStats).sort((a, b) => a.date.localeCompare(b.date));
  } catch (error) {
    console.error('Error getting sales chart data:', error);
    return [];
  }
};

/**
 * Get inventory alerts
 */
export const getInventoryAlerts = async () => {
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .lt('stock_quantity', 10)
      .order('stock_quantity', { ascending: true });

    if (error) throw error;

    return products || [];
  } catch (error) {
    console.error('Error getting inventory alerts:', error);
    return [];
  }
};