
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Check, Truck, ArrowRight, ChevronDown, ChevronUp, Info } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { createOrder } from '@/services/orders';
import CheckoutForm from '@/components/cart/CheckoutForm';
import { z } from 'zod';

interface DeliveryMethod {
  id: string;
  name: string;
  description: string;
  price: number;
  deliveryTime: string;
}

const deliveryMethods: DeliveryMethod[] = [
  {
    id: 'standard',
    name: 'Standard Delivery',
    description: 'Delivery within 3-5 working days',
    price: 4.99,
    deliveryTime: '3-5 days'
  },
  {
    id: 'express',
    name: 'Express Delivery',
    description: 'Next day delivery if ordered before 2pm',
    price: 7.99,
    deliveryTime: '1-2 days'
  },
  {
    id: 'free',
    name: 'Free Delivery',
    description: 'Free for orders over £50',
    price: 0,
    deliveryTime: '4-6 days'
  }
];

// UK postcode validation schema
const ukPostcodeSchema = z.string().refine(
  (value) => {
    const ukPostcodeRegex = /^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$/i;
    return ukPostcodeRegex.test(value.trim());
  },
  { message: "Please enter a valid UK postcode" }
);

const Checkout = () => {
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    postcode: '',
    country: 'United Kingdom'
  });
  
  const [deliveryMethod, setDeliveryMethod] = useState<string>('standard');
  const [paymentMethod, setPaymentMethod] = useState<string>('card');
  const [showOrderSummary, setShowOrderSummary] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const selectedDelivery = deliveryMethods.find(m => m.id === deliveryMethod) || deliveryMethods[0];
  const deliveryCost = selectedDelivery.price;
  const tax = subtotal * 0.2; // 20% VAT
  const total = subtotal + deliveryCost + tax;
  
  const qualifiesForFreeShipping = subtotal >= 50;
  
  const handleEmailChange = (email: string) => {
    setFormData(prev => ({...prev, email}));
  };
  
  const handleFormDataChange = (key: string, value: string) => {
    setFormData(prev => ({...prev, [key]: value}));
  };
  
  const handleDeliveryChange = (value: string) => {
    setDeliveryMethod(value);
  };
  
  const handlePaymentMethodChange = (value: string) => {
    setPaymentMethod(value);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user && !formData.email) {
      toast({
        title: "Email Required",
        description: "Please provide an email address to continue.",
        variant: "destructive"
      });
      return;
    }

    // Validate UK postcode
    try {
      ukPostcodeSchema.parse(formData.postcode);
    } catch (error) {
      toast({
        title: "Invalid Postcode",
        description: "Please enter a valid UK postcode.",
        variant: "destructive"
      });
      return;
    }

    const requiredFields = ['firstName', 'lastName', 'email', 'address', 'city', 'postcode'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
    
    if (missingFields.length > 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Include user.id in the request if the user is logged in
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          items,
          email: user?.email || formData.email,
          deliveryAddress: `${formData.address}, ${formData.city}, ${formData.postcode}, ${formData.country}`,
          deliveryCost: deliveryCost,
          userId: user?.id // Include the user ID if user is logged in
        },
      });

      if (error) throw error;
      
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
      toast({
        title: "Checkout Failed",
        description: "There was an issue processing your order. Please try again.",
        variant: "destructive"
      });
      setIsProcessing(false);
    }
  };
  
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="pt-28 pb-16 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center py-16">
              <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
              <p className="text-gray-600 mb-8">You don't have any items in your cart to checkout.</p>
              <Button 
                className="bg-asianred-600 hover:bg-asianred-700" 
                onClick={() => navigate('/')}
              >
                Continue Shopping
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-28 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold">Checkout</h1>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit}>
                <CheckoutForm 
                  email={formData.email}
                  onEmailChange={handleEmailChange}
                  isAuthenticated={!!user}
                  formData={formData}
                  onFormDataChange={handleFormDataChange}
                />
                
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                  <h2 className="text-xl font-semibold mb-4">Delivery Method</h2>
                  
                  <RadioGroup value={deliveryMethod} onValueChange={handleDeliveryChange} className="space-y-3">
                    {deliveryMethods.map((method) => (
                      <div key={method.id} className={`
                        flex items-center justify-between border rounded-lg p-4
                        ${deliveryMethod === method.id ? 'border-asianred-600 bg-asianred-50' : 'border-gray-200'}
                      `}>
                        <div className="flex items-start gap-3">
                          <RadioGroupItem value={method.id} id={`delivery-${method.id}`} />
                          <div>
                            <Label htmlFor={`delivery-${method.id}`} className="font-medium">
                              {method.name}
                              {method.id === 'free' && !qualifiesForFreeShipping && (
                                <span className="text-gray-500 font-normal ml-2">(Orders over £50)</span>
                              )}
                            </Label>
                            <p className="text-sm text-gray-600">{method.description}</p>
                          </div>
                        </div>
                        
                        <div>
                          {method.price > 0 ? (
                            <span className="font-medium">£{method.price.toFixed(2)}</span>
                          ) : (
                            <span className="text-green-600 font-medium">FREE</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
                  
                  <RadioGroup value={paymentMethod} onValueChange={handlePaymentMethodChange} className="space-y-3">
                    <div className={`
                      flex items-center justify-between border rounded-lg p-4
                      ${paymentMethod === 'card' ? 'border-asianred-600 bg-asianred-50' : 'border-gray-200'}
                    `}>
                      <div className="flex items-start gap-3">
                        <RadioGroupItem value="card" id="payment-card" />
                        <div>
                          <Label htmlFor="payment-card" className="font-medium">Credit / Debit Card</Label>
                          <p className="text-sm text-gray-600">Pay securely with your card</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <CreditCard size={20} />
                      </div>
                    </div>
                    
                    <div className={`
                      flex items-center justify-between border rounded-lg p-4 opacity-50
                    `}>
                      <div className="flex items-start gap-3">
                        <RadioGroupItem value="paypal" id="payment-paypal" disabled />
                        <div>
                          <Label htmlFor="payment-paypal" className="font-medium">PayPal</Label>
                          <p className="text-sm text-gray-600">Coming soon</p>
                        </div>
                      </div>
                    </div>
                  </RadioGroup>
                  
                  {paymentMethod === 'card' && (
                    <div className="mt-6 border border-gray-200 rounded-lg p-4">
                      <p className="text-sm text-gray-600 flex items-center mb-4">
                        <Info size={16} className="mr-2" />
                        This is a demo checkout. No real payments will be processed.
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <Label htmlFor="cardName">Cardholder Name</Label>
                          <Input id="cardName" className="mt-1" placeholder="Name on card" />
                        </div>
                        <div>
                          <Label htmlFor="cardNumber">Card Number</Label>
                          <Input id="cardNumber" className="mt-1" placeholder="1234 5678 9012 3456" />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="expMonth">Expiry Month</Label>
                          <Input id="expMonth" className="mt-1" placeholder="MM" />
                        </div>
                        <div>
                          <Label htmlFor="expYear">Expiry Year</Label>
                          <Input id="expYear" className="mt-1" placeholder="YY" />
                        </div>
                        <div>
                          <Label htmlFor="cvc">CVC</Label>
                          <Input id="cvc" className="mt-1" placeholder="123" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="mt-8 hidden lg:block">
                  <Button 
                    type="submit" 
                    className="w-full bg-asianred-600 hover:bg-asianred-700 py-6 text-lg"
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <span className="flex items-center">
                        <span className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-white rounded-full"></span>
                        Processing...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        Complete Order <ArrowRight className="ml-2" size={18} />
                      </span>
                    )}
                  </Button>
                </div>
              </form>
            </div>
            
            <div>
              <div className="lg:hidden mb-4">
                <button
                  className="w-full flex items-center justify-between bg-white p-4 rounded-lg shadow-sm"
                  onClick={() => setShowOrderSummary(!showOrderSummary)}
                >
                  <div className="flex items-center">
                    <span className="font-medium">Order Summary</span>
                    <span className="ml-2 bg-gray-100 px-2 py-1 rounded-full text-sm">
                      {items.length} {items.length === 1 ? 'item' : 'items'}
                    </span>
                  </div>
                  {showOrderSummary ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
              </div>
              
              <div className={`bg-white rounded-lg shadow-sm p-6 sticky top-24 ${showOrderSummary ? 'block' : 'hidden lg:block'}`}>
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                
                <div className="max-h-[400px] overflow-y-auto mb-6 space-y-4 pr-2">
                  {items.map(item => (
                    <div key={item.product.id} className="flex items-center gap-3">
                      <div className="w-16 h-16 rounded bg-gray-100 overflow-hidden flex-shrink-0">
                        <img 
                          src={item.product.image} 
                          alt={item.product.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm">{item.product.name}</h4>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <div className="font-medium">£{(item.product.price * item.quantity).toFixed(2)}</div>
                    </div>
                  ))}
                </div>
                
                <div className="border-t border-gray-200 pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>£{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery</span>
                    {deliveryCost > 0 ? (
                      <span>£{deliveryCost.toFixed(2)}</span>
                    ) : (
                      <span className="text-green-600">FREE</span>
                    )}
                  </div>
                  <div className="flex justify-between">
                    <span>VAT (20%)</span>
                    <span>£{tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-200">
                    <span>Total</span>
                    <span>£{total.toFixed(2)}</span>
                  </div>
                </div>
                
                {!qualifiesForFreeShipping && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm text-gray-700">
                    <div className="flex items-center gap-2">
                      <Truck size={16} />
                      <p>
                        Add <span className="font-bold text-asianred-600">£{(50 - subtotal).toFixed(2)}</span> more to qualify for free delivery!
                      </p>
                    </div>
                  </div>
                )}
                
                <div className="mt-6 lg:hidden">
                  <Button 
                    type="submit" 
                    form="checkout-form"
                    className="w-full bg-asianred-600 hover:bg-asianred-700 py-6 text-lg"
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <span className="flex items-center">
                        <span className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-white rounded-full"></span>
                        Processing...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        Complete Order <ArrowRight className="ml-2" size={18} />
                      </span>
                    )}
                  </Button>
                </div>
                
                <div className="mt-6 text-center text-sm text-gray-500 space-y-2">
                  <p className="flex items-center justify-center gap-1">
                    <Check size={16} className="text-green-600" /> Secure checkout
                  </p>
                  <p>All transactions are secure and encrypted.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Checkout;
