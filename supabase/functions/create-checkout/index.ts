
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Stripe with the secret key
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Parse request body
    const { items, email, deliveryAddress, deliveryCost, userId } = await req.json();
    
    console.log("Received checkout request:", { 
      email, 
      itemCount: items.length, 
      deliveryAddress,
      userId: userId || 'Guest user' // Log whether we received a user ID
    });

    // Validate request data
    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new Error("Invalid cart items");
    }

    // Create line items from cart items
    const lineItems = items.map((item: any) => {
      // Create product data object with conditional description to avoid empty string
      const productData: any = {
        name: item.product.name,
        images: [item.product.image_url || item.product.image], // Support both image field names
      };
      
      // Only add description if it's not empty
      if (item.product.description && item.product.description.trim() !== "") {
        productData.description = item.product.description;
      }

      return {
        price_data: {
          currency: "gbp",
          product_data: productData,
          unit_amount: Math.round(item.product.price * 100), // Convert price to cents
        },
        quantity: item.quantity,
      };
    });

    console.log("Creating checkout session with line items:", lineItems);

    // Initialize Supabase client - using the service role key to bypass RLS
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") || "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "",
      { auth: { persistSession: false } }
    );

    // Calculate subtotal
    const subtotal = items.reduce((sum: number, item: any) => 
      sum + (item.product.price * item.quantity), 0);
    const tax = subtotal * 0.2; // 20% VAT
    const totalPrice = subtotal + (deliveryCost || 0) + tax;
    
    // Create an order in the database - properly setting user_id if present
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert({
        user_id: userId || null, // Set user_id if we have it
        is_guest: !userId, // Mark as guest order only if no userId
        delivery_address: deliveryAddress || "Address not provided",
        total_price: totalPrice,
        delivery_cost: deliveryCost || 0,
        order_status: "Processing",
        payment_status: "Pending",
        estimated_delivery_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 7 days from now
      })
      .select('id')
      .single();

    if (orderError) {
      console.error("Error creating order:", orderError);
      throw new Error(`Failed to create order: ${orderError.message}`);
    }

    console.log("Order created with ID:", order.id, "User ID:", userId || "Guest");

    // Insert order items
    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      product_id: item.product.id,
      quantity: item.quantity,
      unit_price: item.product.price
    }));

    const { error: itemsError } = await supabaseAdmin
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      console.error("Error inserting order items:", itemsError);
      throw new Error(`Failed to create order items: ${itemsError.message}`);
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${req.headers.get("origin") || "http://localhost:5173"}/order-confirmation/${order.id}`,
      cancel_url: `${req.headers.get("origin") || "http://localhost:5173"}/cart`,
      customer_email: email,
      metadata: {
        order_id: order.id,
        user_id: userId || "guest" // Store user ID in metadata for potential webhook usage
      }
    });

    console.log("Checkout session created:", session.id);

    // Update order with stripe session ID
    await supabaseAdmin
      .from('orders')
      .update({ stripe_session_id: session.id })
      .eq('id', order.id);

    // Return the session URL for redirection
    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error in create-checkout:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
