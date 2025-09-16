import { supabase } from '@/integrations/supabase/client';
import { logAdminAction } from './adminAuth';
import { OrderWithItems, OrderUpdate } from '../orders/types';

export interface BulkOrderUpdate {
  orderIds: string[];
  updates: Partial<OrderUpdate>;
}

export interface OrderSearchFilters {
  status?: string;
  paymentStatus?: string;
  dateFrom?: string;
  dateTo?: string;
  customerId?: string;
  search?: string;
}

/**
 * Search and filter orders with advanced options
 */
export const searchOrders = async (filters: OrderSearchFilters = {}): Promise<OrderWithItems[]> => {
  try {
    let query = supabase
      .from('orders')
      .select(`
        *,
        order_items (
          id,
          product_id,
          quantity,
          unit_price,
          products:product_id (name, image_url)
        )
      `);

    // Apply filters
    if (filters.status) {
      query = query.eq('order_status', filters.status);
    }

    if (filters.paymentStatus) {
      query = query.eq('payment_status', filters.paymentStatus);
    }

    if (filters.dateFrom) {
      query = query.gte('created_at', filters.dateFrom);
    }

    if (filters.dateTo) {
      query = query.lte('created_at', filters.dateTo);
    }

    if (filters.customerId) {
      query = query.eq('user_id', filters.customerId);
    }

    if (filters.search) {
      query = query.or(`id.ilike.%${filters.search}%, delivery_address.ilike.%${filters.search}%`);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;

    await logAdminAction('search_orders', 'orders', undefined, undefined, filters);

    return (data || []).map(order => ({
      ...order,
      items: order.order_items?.map((item: any) => ({
        ...item,
        name: item.products?.name || 'Unknown Product'
      })) || []
    }));
  } catch (error) {
    console.error('Error searching orders:', error);
    throw error;
  }
};

/**
 * Bulk update multiple orders
 */
export const bulkUpdateOrders = async (bulkUpdate: BulkOrderUpdate): Promise<void> => {
  try {
    const { error } = await supabase
      .from('orders')
      .update(bulkUpdate.updates)
      .in('id', bulkUpdate.orderIds);

    if (error) throw error;

    await logAdminAction(
      'bulk_update_orders',
      'orders',
      bulkUpdate.orderIds.join(','),
      undefined,
      { count: bulkUpdate.orderIds.length, updates: bulkUpdate.updates }
    );
  } catch (error) {
    console.error('Error bulk updating orders:', error);
    throw error;
  }
};

/**
 * Export orders to CSV format
 */
export const exportOrdersToCSV = async (filters: OrderSearchFilters = {}): Promise<string> => {
  try {
    const orders = await searchOrders(filters);

    const headers = [
      'Order ID',
      'Customer',
      'Status',
      'Payment Status',
      'Total',
      'Items',
      'Address',
      'Created At',
      'Tracking Number'
    ];

    const csvContent = [
      headers.join(','),
      ...orders.map(order => [
        order.id.substring(0, 8),
        order.user_id || 'Guest',
        order.order_status,
        order.payment_status,
        order.total_price,
        order.items?.length || 0,
        `"${order.delivery_address}"`,
        new Date(order.created_at || '').toLocaleDateString(),
        order.tracking_number || ''
      ].join(','))
    ].join('\n');

    await logAdminAction('export_orders', 'orders', undefined, undefined, { count: orders.length });

    return csvContent;
  } catch (error) {
    console.error('Error exporting orders:', error);
    throw error;
  }
};

/**
 * Get order statistics for reporting
 */
export const getOrderStatistics = async (dateFrom?: string, dateTo?: string) => {
  try {
    let query = supabase
      .from('orders')
      .select('*');

    if (dateFrom) {
      query = query.gte('created_at', dateFrom);
    }

    if (dateTo) {
      query = query.lte('created_at', dateTo);
    }

    const { data: orders, error } = await query;

    if (error) throw error;

    const stats = {
      totalOrders: orders?.length || 0,
      totalRevenue: orders?.reduce((acc, order) => acc + Number(order.total_price), 0) || 0,
      averageOrderValue: 0,
      statusBreakdown: {} as Record<string, number>,
      paymentBreakdown: {} as Record<string, number>
    };

    if (stats.totalOrders > 0) {
      stats.averageOrderValue = stats.totalRevenue / stats.totalOrders;
    }

    orders?.forEach(order => {
      stats.statusBreakdown[order.order_status] = (stats.statusBreakdown[order.order_status] || 0) + 1;
      stats.paymentBreakdown[order.payment_status] = (stats.paymentBreakdown[order.payment_status] || 0) + 1;
    });

    return stats;
  } catch (error) {
    console.error('Error getting order statistics:', error);
    throw error;
  }
};

/**
 * Update order status with tracking
 */
export const updateOrderStatus = async (
  orderId: string, 
  status: string, 
  trackingNumber?: string
): Promise<void> => {
  try {
    // Get current order for audit log
    const { data: currentOrder } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    const updates: any = { order_status: status };
    if (trackingNumber) {
      updates.tracking_number = trackingNumber;
    }

    const { error } = await supabase
      .from('orders')
      .update(updates)
      .eq('id', orderId);

    if (error) throw error;

    await logAdminAction(
      'update_order_status',
      'orders',
      orderId,
      currentOrder,
      updates
    );
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};

/**
 * Delete order (admin only)
 */
export const deleteOrder = async (orderId: string): Promise<void> => {
  try {
    // Get current order for audit log
    const { data: currentOrder } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', orderId);

    if (error) throw error;

    await logAdminAction(
      'delete_order',
      'orders',
      orderId,
      currentOrder
    );
  } catch (error) {
    console.error('Error deleting order:', error);
    throw error;
  }
};