import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ShoppingCart, 
  Package, 
  Users, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle,
  Eye,
  Download,
  RefreshCw
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { 
  getDashboardMetrics, 
  getOrderStatusDistribution, 
  getTopProducts, 
  getSalesChartData,
  getInventoryAlerts,
  DashboardMetrics,
  OrderStatusDistribution,
  TopProduct,
  SalesChart
} from '@/services/admin/adminAnalytics';
import { getAdminAuditLogs, AdminAuditLog } from '@/services/admin/adminAuth';

const EnhancedAdminDashboard = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  // Queries for dashboard data
  const { data: metrics, isLoading: metricsLoading, refetch: refetchMetrics } = useQuery({
    queryKey: ['admin-dashboard-metrics', refreshKey],
    queryFn: getDashboardMetrics,
    refetchInterval: 60000, // Refresh every minute
  });

  const { data: orderStatusData } = useQuery({
    queryKey: ['admin-order-status', refreshKey],
    queryFn: getOrderStatusDistribution,
  });

  const { data: topProducts } = useQuery({
    queryKey: ['admin-top-products', refreshKey],
    queryFn: () => getTopProducts(5),
  });

  const { data: salesChart } = useQuery({
    queryKey: ['admin-sales-chart', refreshKey],
    queryFn: getSalesChartData,
  });

  const { data: inventoryAlerts } = useQuery({
    queryKey: ['admin-inventory-alerts', refreshKey],
    queryFn: getInventoryAlerts,
  });

  const { data: auditLogs } = useQuery({
    queryKey: ['admin-audit-logs', refreshKey],
    queryFn: () => getAdminAuditLogs(10),
  });

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
    refetchMetrics();
    toast.success('Dashboard refreshed');
  };

  const handleExportMetrics = () => {
    if (!metrics) return;
    
    const csvContent = [
      'Metric,Value',
      `Total Orders,${metrics.totalOrders}`,
      `Total Revenue,£${metrics.totalRevenue.toFixed(2)}`,
      `Total Products,${metrics.totalProducts}`,
      `Total Customers,${metrics.totalCustomers}`,
      `Pending Orders,${metrics.pendingOrders}`,
      `Low Stock Products,${metrics.lowStockProducts}`,
      `Today's Orders,${metrics.todaysOrders}`,
      `Today's Revenue,£${metrics.todaysRevenue.toFixed(2)}`
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `admin-metrics-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success('Metrics exported successfully');
  };

  if (metricsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Enhanced Admin Dashboard</h2>
          <p className="text-muted-foreground">
            Comprehensive overview of your e-commerce operations
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportMetrics}>
            <Download className="h-4 w-4 mr-2" />
            Export Metrics
          </Button>
          <Button onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.totalOrders || 0}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+{metrics?.monthlyGrowth.orders || 0}%</span> from last month
            </p>
            <div className="mt-2 text-xs text-muted-foreground">
              Today: {metrics?.todaysOrders || 0} orders
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">£{metrics?.totalRevenue.toFixed(2) || '0.00'}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+{metrics?.monthlyGrowth.revenue || 0}%</span> from last month
            </p>
            <div className="mt-2 text-xs text-muted-foreground">
              Today: £{metrics?.todaysRevenue.toFixed(2) || '0.00'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products & Inventory</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.totalProducts || 0}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-600">{metrics?.lowStockProducts || 0}</span> low stock alerts
            </p>
            {(metrics?.lowStockProducts || 0) > 0 && (
              <Badge variant="destructive" className="mt-2">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Action Required
              </Badge>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.totalCustomers || 0}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-yellow-600">{metrics?.pendingOrders || 0}</span> pending orders
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="orders">Order Analysis</TabsTrigger>
          <TabsTrigger value="products">Product Performance</TabsTrigger>
          <TabsTrigger value="inventory">Inventory Alerts</TabsTrigger>
          <TabsTrigger value="audit">Activity Log</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Order Status Distribution</CardTitle>
                <CardDescription>Current status of all orders</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {orderStatusData?.map((status) => (
                    <div key={status.status} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{status.status}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-secondary rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full"
                            style={{ width: `${status.percentage}%` }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground w-12">
                          {status.count}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest admin actions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {auditLogs?.slice(0, 5).map((log) => (
                    <div key={log.id} className="flex items-center justify-between text-sm">
                      <div>
                        <span className="font-medium capitalize">
                          {log.action.replace(/_/g, ' ')}
                        </span>
                        {log.table_name && (
                          <span className="text-muted-foreground ml-1">
                            on {log.table_name}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(log.created_at).toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Order Analysis</CardTitle>
              <CardDescription>Detailed order performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    £{((metrics?.totalRevenue || 0) / Math.max(metrics?.totalOrders || 1, 1)).toFixed(2)}
                  </div>
                  <div className="text-sm text-muted-foreground">Average Order Value</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {((metrics?.pendingOrders || 0) / Math.max(metrics?.totalOrders || 1, 1) * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Pending Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {metrics?.todaysOrders || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Today's Orders</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Products</CardTitle>
              <CardDescription>Best selling products by quantity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topProducts?.map((product, index) => (
                  <div key={product.id} className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    {product.image_url && (
                      <img 
                        src={product.image_url} 
                        alt={product.name}
                        className="w-12 h-12 rounded object-cover"
                      />
                    )}
                    <div className="flex-1">
                      <div className="font-medium">{product.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {product.totalSold} sold · £{product.revenue.toFixed(2)} revenue
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Alerts</CardTitle>
              <CardDescription>Products requiring immediate attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {inventoryAlerts?.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Package className="h-8 w-8 mx-auto mb-2" />
                    <p>All products have sufficient stock</p>
                  </div>
                ) : (
                  inventoryAlerts?.slice(0, 10).map((product: any) => (
                    <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                        <div>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {product.categories?.name || 'Uncategorized'}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="destructive">
                          {product.stock_quantity} left
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit">
          <Card>
            <CardHeader>
              <CardTitle>Admin Activity Log</CardTitle>
              <CardDescription>Complete audit trail of admin actions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {auditLogs?.map((log) => (
                  <div key={log.id} className="flex items-start gap-3 p-3 border rounded-lg">
                    <Eye className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div className="flex-1">
                      <div className="font-medium capitalize">
                        {log.action.replace(/_/g, ' ')}
                      </div>
                      {log.table_name && (
                        <div className="text-sm text-muted-foreground">
                          Table: {log.table_name}
                          {log.record_id && ` · ID: ${log.record_id.substring(0, 8)}`}
                        </div>
                      )}
                      <div className="text-xs text-muted-foreground mt-1">
                        {new Date(log.created_at).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedAdminDashboard;