
import { supabase } from '@/integrations/supabase/client';
import { OrderWithItems, OrderRow, OrderItemRow } from './types';

/**
 * Fetch all orders with their items
 */
export const fetchOrders = async (): Promise<OrderWithItems[]> => {
  console.log('Fetching orders from Supabase');
  
  const { data: orders, error: ordersError } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (ordersError) {
    console.error('Error fetching orders:', ordersError);
    throw new Error('Failed to fetch orders');
  }

  console.log('Orders retrieved:', orders?.length || 0);

  // For each order, fetch its items
  const ordersWithItems = await Promise.all(
    (orders as OrderRow[]).map(async (order) => {
      console.log(`Fetching items for order ${order.id}, user_id: ${order.user_id || 'none'}`);
      
      const { data: items, error: itemsError } = await supabase
        .from('order_items')
        .select(`
          id,
          order_id,
          product_id,
          quantity,
          unit_price,
          created_at,
          products:product_id (name)
        `)
        .eq('order_id', order.id);

      if (itemsError) {
        console.error(`Error fetching items for order ${order.id}:`, itemsError);
        return { ...order, items: [] } as OrderWithItems;
      }

      return {
        ...order,
        items: (items || []).map((item: any) => ({
          ...item,
          name: item.products?.name || 'Unknown Product'
        })) as OrderItemRow[]
      } as OrderWithItems;
    })
  );

  console.log('Orders with items prepared:', ordersWithItems.length);
  return ordersWithItems;
};

/**
 * Fetch a single order by ID with its items
 */
export const fetchOrderById = async (orderId: string): Promise<OrderWithItems | null> => {
  console.log(`Fetching order with ID: ${orderId}`);
  
  try {
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (orderError) {
      console.error(`Error fetching order ${orderId}:`, orderError);
      throw new Error('Failed to fetch order');
    }

    console.log('Order data found:', order);

    const { data: items, error: itemsError } = await supabase
      .from('order_items')
      .select(`
        id,
        order_id,
        product_id,
        quantity,
        unit_price,
        created_at,
        products:product_id (name)
      `)
      .eq('order_id', orderId);

    if (itemsError) {
      console.error(`Error fetching items for order ${orderId}:`, itemsError);
      return { ...(order as OrderRow), items: [] } as OrderWithItems;
    }

    console.log(`Found ${items?.length || 0} items for order`);

    return {
      ...(order as OrderRow),
      items: (items || []).map((item: any) => ({
        ...item,
        name: item.products?.name || 'Unknown Product'
      })) as OrderItemRow[]
    } as OrderWithItems;
  } catch (error) {
    console.error(`Failed to fetch order ${orderId}:`, error);
    throw error;
  }
};
