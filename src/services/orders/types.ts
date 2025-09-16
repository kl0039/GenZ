
// Define interfaces manually instead of relying on auto-generated types
// that haven't been updated yet

export interface OrderRow {
  id: string;
  user_id: string | null; // Updated to allow null for guest users
  is_guest?: boolean;     // Added new field for guest flag
  total_price: number;
  order_status: string;
  payment_status: string;
  tracking_number?: string;
  delivery_address: string;
  delivery_cost?: number;
  estimated_delivery_date?: string;
  created_at?: string;
  updated_at?: string;
  stripe_session_id?: string;
}

export type OrderInsert = Partial<OrderRow> & {
  delivery_address: string;
  total_price: number;
  user_id?: string | null; // Made optional to support guest orders
};

export type OrderUpdate = Partial<OrderRow>;

export interface OrderItemRow {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  created_at?: string;
  products?: { name: string }; // For joined product data
  name?: string; // Add name property for joined product data display
}

// Update OrderItemInsert to make order_id optional since it will be set in createOrder function
export type OrderItemInsert = Omit<OrderItemRow, 'id' | 'created_at' | 'products' | 'name'> & {
  order_id?: string; // Make order_id optional
};

export type OrderItemUpdate = Partial<OrderItemRow>;

export interface OrderWithItems extends OrderRow {
  items: OrderItemRow[];
}
