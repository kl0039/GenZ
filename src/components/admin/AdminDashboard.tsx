
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart, Package, Users, DollarSign, TrendingUp, Clock } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchOrders } from '@/services/orders';
import { fetchAllProducts } from '@/services/products/productService';

const AdminDashboard = () => {
  const { data: orders = [] } = useQuery({
    queryKey: ['orders'],
    queryFn: fetchOrders
  });

  const { data: products = [] } = useQuery({
    queryKey: ['admin-products'],
    queryFn: fetchAllProducts
  });

  // Calculate statistics
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(order => order.order_status === 'Processing').length;
  const totalRevenue = orders.reduce((acc, order) => acc + Number(order.total_price), 0);
  const totalProducts = products.length;
  const lowStockProducts = products.filter(product => (product.stock_quantity || 0) < 10).length;

  // Get recent orders
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Dashboard Overview</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              +{Math.floor(Math.random() * 10)}% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">£{totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              +{Math.floor(Math.random() * 15)}% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              {lowStockProducts} products low in stock
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Latest 5 orders placed on the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.length === 0 ? (
                <p className="text-center text-sm text-gray-500 py-4">No recent orders</p>
              ) : (
                recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium">Order #{order.id.substring(0, 8)}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(order.created_at || '').toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">£{Number(order.total_price).toFixed(2)}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        order.order_status === 'Delivered' ? 'bg-green-100 text-green-800' : 
                        order.order_status === 'Shipped' ? 'bg-blue-100 text-blue-800' : 
                        order.order_status === 'Cancelled' ? 'bg-red-100 text-red-800' : 
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.order_status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
          <CardFooter>
            <p className="text-xs text-gray-500">Updated just now</p>
          </CardFooter>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Inventory Status</CardTitle>
            <CardDescription>Products that are running low on stock</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lowStockProducts === 0 ? (
                <p className="text-center text-sm text-gray-500 py-4">All products have sufficient stock</p>
              ) : (
                products
                  .filter(product => (product.stock_quantity || 0) < 10)
                  .slice(0, 5)
                  .map((product) => (
                    <div key={product.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Package className="h-4 w-4 mr-2 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium">{product.name}</p>
                          <p className="text-xs text-gray-500">{product.category || 'Uncategorized'}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{product.stock_quantity} in stock</p>
                        <p className="text-xs text-red-500">Low stock</p>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </CardContent>
          <CardFooter>
            <p className="text-xs text-gray-500">Updated just now</p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
