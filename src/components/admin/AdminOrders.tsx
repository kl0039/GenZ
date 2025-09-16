import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit, Search, Truck } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchOrders, updateOrder } from '@/services/orders';
import { toast } from 'sonner';
import { OrderUpdate } from '@/services/orders/types';

const orderStatuses = ["Processing", "Shipped", "Delivered", "Cancelled"];
const paymentStatuses = ["Pending", "Paid", "Refunded", "Failed"];

interface OrderDetailsProps {
  orderId: string;
  onClose: () => void;
}

import { fetchOrderById } from '@/services/orders';

const OrderDetails = ({ orderId, onClose }: OrderDetailsProps) => {
  const [orderStatus, setOrderStatus] = useState<string>('');
  const [paymentStatus, setPaymentStatus] = useState<string>('');
  const [trackingNumber, setTrackingNumber] = useState<string>('');
  
  const queryClient = useQueryClient();
  
  const { data: order, isLoading } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => fetchOrderById(orderId),
    enabled: !!orderId,
  });
  
  const updateMutation = useMutation({
    mutationFn: (data: OrderUpdate) => updateOrder(data.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['order', orderId] });
      toast.success('Order updated successfully');
      onClose();
    },
    onError: (error) => {
      console.error('Error updating order:', error);
      toast.error('Failed to update order');
    }
  });
  
  React.useEffect(() => {
    if (order) {
      setOrderStatus(order.order_status || '');
      setPaymentStatus(order.payment_status || '');
      setTrackingNumber(order.tracking_number || '');
    }
  }, [order]);
  
  const handleUpdateOrder = () => {
    if (!order) return;
    
    updateMutation.mutate({
      id: order.id,
      order_status: orderStatus,
      payment_status: paymentStatus,
      tracking_number: trackingNumber
    });
  };
  
  if (isLoading) {
    return <div className="p-4">Loading order details...</div>;
  }
  
  if (!order) {
    return <div className="p-4">Order not found</div>;
  }
  
  return (
    <div className="space-y-6 p-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="text-lg font-medium">Order #{order.id.substring(0, 8)}</h3>
          <p className="text-sm text-gray-500">Created: {new Date(order.created_at || '').toLocaleString()}</p>
        </div>
        <div className="text-right">
          <p className="font-bold">Total: £{Number(order.total_price).toFixed(2)}</p>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="order-status">Order Status</Label>
          <Select 
            value={orderStatus} 
            onValueChange={setOrderStatus}
          >
            <SelectTrigger id="order-status">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {orderStatuses.map((status) => (
                <SelectItem key={status} value={status}>{status}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="payment-status">Payment Status</Label>
          <Select 
            value={paymentStatus} 
            onValueChange={setPaymentStatus}
          >
            <SelectTrigger id="payment-status">
              <SelectValue placeholder="Select payment status" />
            </SelectTrigger>
            <SelectContent>
              {paymentStatuses.map((status) => (
                <SelectItem key={status} value={status}>{status}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="tracking">Tracking Number</Label>
          <Input 
            id="tracking" 
            value={trackingNumber || ''} 
            onChange={(e) => setTrackingNumber(e.target.value)}
            placeholder="Enter tracking number"
          />
        </div>
      </div>
      
      <div className="pt-4 border-t">
        <h4 className="font-medium mb-2">Customer Information</h4>
        <p className="text-sm">Delivery Address:</p>
        <p className="text-sm text-gray-500">{order.delivery_address}</p>
      </div>
      
      <Button 
        onClick={handleUpdateOrder} 
        className="w-full"
        disabled={updateMutation.isPending}
      >
        {updateMutation.isPending ? 'Updating...' : 'Update Order'}
      </Button>
    </div>
  );
};

const AdminOrders = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: fetchOrders
  });
  
  const handleCloseDetails = () => {
    setSelectedOrderId(null);
  };
  
  const filteredOrders = orders.filter(order => 
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.order_status.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.payment_status.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Order Management</h2>
      </div>

      <div className="relative">
        <Input
          placeholder="Search orders..."
          className="pl-10 mb-4"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Search className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Total</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <div className="flex justify-center items-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-500"></div>
                    <span className="ml-2">Loading orders...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  No orders found
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">#{order.id.substring(0, 8)}</TableCell>
                  <TableCell>{new Date(order.created_at || '').toLocaleDateString()}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      order.order_status === 'Delivered' ? 'bg-green-100 text-green-800' : 
                      order.order_status === 'Shipped' ? 'bg-blue-100 text-blue-800' : 
                      order.order_status === 'Cancelled' ? 'bg-red-100 text-red-800' : 
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.order_status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      order.payment_status === 'Paid' ? 'bg-green-100 text-green-800' : 
                      order.payment_status === 'Refunded' ? 'bg-purple-100 text-purple-800' : 
                      order.payment_status === 'Failed' ? 'bg-red-100 text-red-800' : 
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.payment_status}
                    </span>
                  </TableCell>
                  <TableCell>£{Number(order.total_price).toFixed(2)}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setSelectedOrderId(order.id)}
                        title="View Details"
                      >
                        <Edit size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      <Dialog open={!!selectedOrderId} onOpenChange={(open) => !open && handleCloseDetails()}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>
          {selectedOrderId && <OrderDetails orderId={selectedOrderId} onClose={handleCloseDetails} />}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminOrders;
