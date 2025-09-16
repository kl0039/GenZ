
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Check, Truck, Calendar, Package, Clock, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import RecommendedProducts from '@/components/products/RecommendedProducts';
import { fetchOrderById } from '@/services/orders';
import { format } from 'date-fns';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useCart } from '@/context/CartContext';

const OrderConfirmation = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { clearCart } = useCart();
  const [hasCleared, setHasCleared] = useState(false); // Track if cart has been cleared
  
  useEffect(() => {
    const loadOrder = async () => {
      if (!orderId) {
        setError('No order ID provided');
        setLoading(false);
        return;
      }
      
      try {
        console.log(`Loading order with ID: ${orderId}`);
        const orderData = await fetchOrderById(orderId);
        console.log('Order data received:', orderData);
        
        if (!orderData) {
          throw new Error('Order not found');
        }
        
        setOrder(orderData);
        
        // Clear the cart only once after successful order and if not cleared yet
        if (!hasCleared) {
          clearCart();
          setHasCleared(true); // Mark as cleared so it doesn't happen again
        }
      } catch (error: any) {
        console.error('Error loading order:', error);
        setError(`Failed to load order details: ${error.message || 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    };
    
    loadOrder();
  }, [orderId, clearCart, hasCleared]); // Include hasCleared in dependencies
  
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMMM dd, yyyy');
    } catch (e) {
      return 'Invalid date';
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="pt-28 pb-16 px-4 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-asianred-600" />
            <p className="mt-4 text-gray-600">Loading your order details...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="pt-28 pb-16 px-4">
          <div className="container mx-auto max-w-4xl">
            <Alert className="mb-8 border-red-200 bg-red-50 text-red-800">
              <AlertCircle className="h-5 w-5" />
              <AlertTitle className="text-lg font-semibold">Error Loading Order</AlertTitle>
              <AlertDescription>{error || 'Could not find your order'}</AlertDescription>
            </Alert>
            
            <div className="text-center">
              <p className="mb-6 text-gray-700">You can check your order status in your account if you're logged in.</p>
              <Link to="/">
                <Button className="bg-asianred-600 hover:bg-asianred-700">
                  Return to Home
                </Button>
              </Link>
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
        <div className="container mx-auto max-w-4xl">
          {/* Order Confirmation Header */}
          <div className="bg-white rounded-lg shadow-sm p-8 text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
              <Check size={32} />
            </div>
            <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
            <p className="text-lg text-gray-600 mb-4">
              Thank you for your order. We've received it and are processing it now.
            </p>
            <p className="text-gray-500">
              Order Number: <span className="font-semibold">{order.id.substring(0, 8)}</span>
            </p>
            <p className="text-gray-500">
              Date: <span className="font-semibold">{formatDate(order.created_at)}</span>
            </p>
          </div>
          
          {/* Delivery Information */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Delivery Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 border border-gray-100 rounded-lg text-center">
                <div className="w-12 h-12 bg-asianred-100 text-asianred-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Package size={24} />
                </div>
                <h3 className="font-medium mb-1">Order Status</h3>
                <p className="text-sm text-gray-600">{order.order_status || 'Processing'}</p>
              </div>
              
              <div className="p-4 border border-gray-100 rounded-lg text-center">
                <div className="w-12 h-12 bg-asianred-100 text-asianred-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Clock size={24} />
                </div>
                <h3 className="font-medium mb-1">Estimated Delivery</h3>
                <p className="text-sm text-gray-600">
                  {order.estimated_delivery_date 
                    ? formatDate(order.estimated_delivery_date) 
                    : '3-5 business days'}
                </p>
              </div>
              
              <div className="p-4 border border-gray-100 rounded-lg text-center">
                <div className="w-12 h-12 bg-asianred-100 text-asianred-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Truck size={24} />
                </div>
                <h3 className="font-medium mb-1">Delivery Address</h3>
                <p className="text-sm text-gray-600 truncate" title={order.delivery_address}>
                  {order.delivery_address}
                </p>
              </div>
            </div>
          </div>
          
          {/* Order Total Information */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span>£{(Number(order.total_price) - (Number(order.delivery_cost) || 0) * 0.8).toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">VAT (20%):</span>
                <span>£{((Number(order.total_price) - (Number(order.delivery_cost) || 0)) * 0.2).toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery:</span>
                <span>£{Number(order.delivery_cost || 0).toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between font-bold pt-2 border-t">
                <span>Total:</span>
                <span>£{Number(order.total_price).toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          {/* Tracking Information */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xl font-semibold mb-2">Track Your Order</h2>
                <p className="text-gray-600">
                  You will receive an email with tracking information once your order ships.
                </p>
              </div>
              <Button className="mt-4 md:mt-0 bg-asianred-600 hover:bg-asianred-700">
                View Order Status
              </Button>
            </div>
          </div>
          
          {/* What's Next */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-12">
            <h2 className="text-xl font-semibold mb-4">What's Next?</h2>
            
            <ol className="relative border-l border-gray-200 ml-3 space-y-8">
              <li className="ml-6">
                <span className="absolute flex items-center justify-center w-8 h-8 bg-asianred-600 rounded-full -left-4 ring-4 ring-white">
                  <Check className="w-4 h-4 text-white" />
                </span>
                <h3 className="font-medium">Order Confirmation</h3>
                <p className="text-sm text-gray-600">
                  We've received your order and are processing it now.
                </p>
              </li>
              <li className="ml-6">
                <span className="absolute flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full -left-4 ring-4 ring-white">
                  <Package className="w-4 h-4 text-gray-500" />
                </span>
                <h3 className="font-medium">Order Processing</h3>
                <p className="text-sm text-gray-600">
                  Your items are being prepared and packaged for shipping.
                </p>
              </li>
              <li className="ml-6">
                <span className="absolute flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full -left-4 ring-4 ring-white">
                  <Truck className="w-4 h-4 text-gray-500" />
                </span>
                <h3 className="font-medium">Shipping</h3>
                <p className="text-sm text-gray-600">
                  You'll receive an email with tracking information once your order ships.
                </p>
              </li>
              <li className="ml-6">
                <span className="absolute flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full -left-4 ring-4 ring-white">
                  <Calendar className="w-4 h-4 text-gray-500" />
                </span>
                <h3 className="font-medium">Delivery</h3>
                <p className="text-sm text-gray-600">
                  Your order will be delivered within the estimated delivery timeframe.
                </p>
              </li>
            </ol>
          </div>
          
          <Separator className="my-12" />
          
          {/* Recommendations */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6">Recommended For You</h2>
            <RecommendedProducts limit={4} />
          </div>
          
          {/* Continue Shopping Button */}
          <div className="text-center mt-12">
            <Link to="/">
              <Button className="bg-asianred-600 hover:bg-asianred-700 flex items-center">
                Continue Shopping <ArrowRight className="ml-2" size={18} />
              </Button>
            </Link>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default OrderConfirmation;
