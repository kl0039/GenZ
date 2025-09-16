
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { fetchOrders } from '@/services/orders';
import { useAuth } from '@/context/AuthContext';
import { OrderWithItems } from '@/services/orders/types';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Loader2, Package, AlertCircle, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const Orders = () => {
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if not logged in
    if (!user) {
      navigate('/login', { replace: true });
      return;
    }

    const loadOrders = async () => {
      try {
        const ordersData = await fetchOrders();
        
        console.log('All fetched orders:', ordersData);
        console.log('Current user ID:', user.id);
        
        // Filter orders for current user - make sure we're strictly comparing with the correct type
        // This is important because sometimes UUIDs might not be compared correctly
        const userOrders = ordersData.filter(order => {
          const matchesUser = order.user_id === user.id;
          console.log(`Order ${order.id} - user_id: ${order.user_id}, matches current user: ${matchesUser}`);
          return matchesUser;
        });
        
        console.log('Filtered user orders:', userOrders);
        setOrders(userOrders);
      } catch (err: any) {
        console.error('Error loading orders:', err);
        setError(err.message || 'Failed to load your orders');
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [user, navigate]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (e) {
      return 'Invalid date';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'processing':
        return 'bg-amber-100 text-amber-800 hover:bg-amber-100';
      case 'shipped':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
      case 'delivered':
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'cancelled':
        return 'bg-red-100 text-red-800 hover:bg-red-100';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="pt-28 pb-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="h-10 w-10 animate-spin text-asianred-600 mb-4" />
              <p className="text-gray-600">Loading your order history...</p>
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
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Your Orders</h1>
            <p className="text-gray-600">
              View and track your order history
            </p>
          </div>

          {error && (
            <Alert className="mb-8 border-red-200 bg-red-50 text-red-800">
              <AlertCircle className="h-5 w-5" />
              <AlertTitle className="text-lg font-semibold">Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {!error && orders.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h2 className="text-2xl font-semibold mb-2">No orders found</h2>
              <p className="text-gray-600 mb-6">
                You haven't placed any orders yet. Start shopping to see your orders here.
              </p>
              <Link to="/products/all">
                <Button className="bg-asianred-600 hover:bg-asianred-700">
                  Browse Products
                </Button>
              </Link>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map(order => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">
                        {order.id.substring(0, 8)}...
                      </TableCell>
                      <TableCell>{formatDate(order.created_at)}</TableCell>
                      <TableCell>£{Number(order.total_price).toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge className={`font-normal ${getStatusColor(order.order_status)}`}>
                          {order.order_status}
                        </Badge>
                      </TableCell>
                      <TableCell>{order.items.length} items</TableCell>
                      <TableCell className="text-right">
                        <Link to={`/order-confirmation/${order.id}`}>
                          <Button variant="ghost" size="sm" className="hover:bg-gray-100">
                            View <ChevronRight className="ml-1 h-4 w-4" />
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Orders;
