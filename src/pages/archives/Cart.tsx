import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import CartItem from '@/components/cart/CartItem';
import DeliveryOptions from '@/components/cart/DeliveryOptions';
import OrderSummary from '@/components/cart/OrderSummary';
import CheckoutForm from '@/components/cart/CheckoutForm';

// Get the anon key from the environment
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0YW50ZG1ia3VtbmljbnN6emNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM0NTgzODksImV4cCI6MjA1OTAzNDM4OX0.fCQmDbN1gHgTKY08HRiC5XSyyIZQyfiZnKjZwWwqNQc";

const Cart = () => {
  const { items, removeItem, updateQuantity, clearCart, subtotal } = useCart();
  const [deliveryOption, setDeliveryOption] = useState('standard');
  const [deliveryCost, setDeliveryCost] = useState(4.99);
  const [isProcessing, setIsProcessing] = useState(false);
  const { user } = useAuth();
  const [email, setEmail] = useState(user?.email || '');
  const [promoCode, setPromoCode] = useState('');
  const [isPromoApplied, setIsPromoApplied] = useState(false);
  const [address, setAddress] = useState('');

  // Create a formData state object to pass to CheckoutForm
  const [shippingFormData, setShippingFormData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    postcode: '',
  });
  
  // Handle form data changes
  const handleFormDataChange = (key: string, value: string) => {
    setShippingFormData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Check if any item in the cart has free delivery promotion
  const hasFreeDeliveryItem = items.some(item => item.product.promotion === 'freeDelivery');

  const handlePromoCodeApply = () => {
    if (promoCode.toLowerCase() === 'frankie2025') {
      setDeliveryCost(0);
      setIsPromoApplied(true);
      toast.success('Promo code applied! Free delivery.');
    } else {
      setDeliveryCost(deliveryOption === 'express' ? 7.99 : 4.99);
      setIsPromoApplied(false);
      toast.error('Invalid promo code');
    }
  };

  const handleDeliveryChange = (option: string) => {
    setDeliveryOption(option);
    if (isPromoApplied || hasFreeDeliveryItem) {
      setDeliveryCost(0);
    } else {
      setDeliveryCost(option === 'express' ? 7.99 : 4.99);
    }
  };

  // Updated logic to check for free delivery
  const isEligibleForFreeDelivery = subtotal >= 60 || hasFreeDeliveryItem;
  const actualDeliveryCost = isEligibleForFreeDelivery || isPromoApplied ? 0 : deliveryCost;
  const tax = subtotal * 0.2; // 20% VAT
  const totalPrice = subtotal + actualDeliveryCost + tax;

  const handleCheckout = async () => {
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    // Validate email if user is not logged in
    if (!user && (!email || !email.includes('@'))) {
      toast.error("Please enter a valid email address");
      return;
    }

    // Validate delivery address
    if (!address.trim()) {
      toast.error("Please enter a delivery address");
      return;
    }

    setIsProcessing(true);

    try {
      console.log("Invoking create-checkout function with:", {
        items: items.length,
        email: user?.email || email,
        address: address,
        userId: user?.id // Log the user ID for debugging
      });
      
      // Pass the anon key explicitly in the headers using the constant
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          items,
          email: user?.email || email,
          deliveryAddress: address,
          deliveryCost: actualDeliveryCost,
          userId: user?.id // Important: Pass the user ID if the user is logged in
        },
        // Use the constant for the apikey header
        headers: {
          "apikey": SUPABASE_ANON_KEY
        }
      });

      if (error) {
        console.error("Supabase function error:", error);
        toast.error(`Failed to checkout: ${error.message || "Please try again"}`);
        setIsProcessing(false);
        return;
      }
      
      if (data?.url) {
        console.log("Redirecting to checkout URL:", data.url);
        window.location.href = data.url;
      } else {
        console.error("No checkout URL received:", data);
        toast.error("Failed to create checkout session. Please try again.");
        setIsProcessing(false);
      }
    } catch (error: any) {
      console.error("Error creating checkout session:", error);
      toast.error(`Failed to checkout: ${error.message || "Please try again"}`);
      setIsProcessing(false);
    }
  };

  // Update the address state when the shipping address form changes
  React.useEffect(() => {
    if (shippingFormData.address && shippingFormData.city && shippingFormData.postcode) {
      setAddress(`${shippingFormData.address}, ${shippingFormData.city}, ${shippingFormData.postcode}, United Kingdom`);
    }
  }, [shippingFormData]);

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 pt-32 pb-16">
          <div className="text-center py-16">
            <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
            <p className="text-gray-600 mb-8">Looks like you haven't added anything to your cart yet.</p>
            <Link to="/">
              <button className="bg-asianred-600 hover:bg-asianred-700 text-white px-6 py-3 rounded-lg">
                Continue Shopping
              </button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-2/3">
              <div id="cart-items" className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <h2 className="text-2xl font-bold mb-6">Shopping Cart ({items.length} items)</h2>
                {items.map((item) => (
                  <CartItem
                    key={item.product.id}
                    item={item}
                    onRemove={removeItem}
                    onUpdateQuantity={updateQuantity}
                  />
                ))}
              </div>

              <DeliveryOptions
                deliveryOption={deliveryOption}
                onDeliveryChange={handleDeliveryChange}
                isEligibleForFreeDelivery={isEligibleForFreeDelivery}
              />

              <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <h3 className="text-lg font-semibold mb-4">Delivery Address</h3>
                <div className="mb-4">
                  <textarea
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-asianred-300"
                    placeholder="Enter your full delivery address"
                    rows={3}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
              </div>

              <CheckoutForm
                email={email}
                onEmailChange={setEmail}
                isAuthenticated={!!user}
                formData={shippingFormData}
                onFormDataChange={handleFormDataChange}
              />

              <button 
                className="w-full bg-asianred-600 text-white py-4 rounded-lg hover:bg-asianred-700 mt-6 transition-all duration-200"
                onClick={handleCheckout}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center">
                    <span className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-white rounded-full"></span>
                    Processing...
                  </span>
                ) : (
                  'Continue to Payment'
                )}
              </button>
            </div>

            <div className="lg:w-1/3">
              <OrderSummary
                subtotal={subtotal}
                deliveryCost={deliveryCost}
                isEligibleForFreeDelivery={isEligibleForFreeDelivery}
                tax={tax}
                totalPrice={totalPrice}
                promoCode={promoCode}
                isPromoApplied={isPromoApplied}
                onPromoCodeChange={setPromoCode}
                onPromoCodeApply={handlePromoCodeApply}
                onClearCart={clearCart}
              />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Cart;
