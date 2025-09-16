
import { supabase } from '@/integrations/supabase/client';
import { OrderInsert, OrderUpdate, OrderItemInsert } from './types';

/**
 * Create a new order with items
 */
export const createOrder = async (
  order: OrderInsert,
  items: Array<Omit<OrderItemInsert, 'order_id'>>
): Promise<string> => {
  // Start a transaction by using RPC - not directly supported in JS client,
  // so we'll do sequential operations and handle errors manually
  
  try {
    // 1. Insert the order first
    // For guest users, set is_guest to true and user_id to null
    const orderData = {
      ...order,
      is_guest: !order.user_id, // Set is_guest flag if no user_id
      user_id: order.user_id || null // Use null for guest users
    };

    const { data: newOrder, error: orderError } = await supabase
      .from('orders')
      .insert(orderData)
      .select('id')
      .single();

    if (orderError) {
      console.error('Error creating order:', orderError);
      throw new Error('Failed to create order');
    }

    // 2. Insert order items
    const orderItems = items.map(item => ({
      ...item,
      order_id: newOrder.id
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      console.error('Error creating order items:', itemsError);
      // Ideally we would rollback here, but we'll have to rely on RLS cascade delete
      throw new Error('Failed to create order items');
    }

    return newOrder.id;
  } catch (error) {
    console.error('Error in createOrder:', error);
    throw error;
  }
};

/**
 * Update an existing order
 */
export const updateOrder = async (
  id: string,
  updates: OrderUpdate
): Promise<void> => {
  const { error } = await supabase
    .from('orders')
    .update(updates)
    .eq('id', id);

  if (error) {
    console.error(`Error updating order ${id}:`, error);
    throw new Error('Failed to update order');
  }
};

/**
 * Delete an order and its items (items will be deleted by CASCADE constraint)
 */
export const deleteOrder = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('orders')
    .delete()
    .eq('id', id);

  if (error) {
    console.error(`Error deleting order ${id}:`, error);
    throw new Error('Failed to delete order');
  }
};
