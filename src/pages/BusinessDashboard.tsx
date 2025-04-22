import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { useAuth } from "@/context/AuthContext";
import { getAllOrders, updateOrderStatus } from "@/services/ordersService";
import { fetchProducts } from "@/services/productsService";
import { Order, Product } from "@/types";
import OrderManagementTable from "@/components/OrderManagementTable";
import ProductForm from "@/components/business/ProductForm";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, PieChart, Users, ShoppingBag, DollarSign, List } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const BusinessDashboard = () => {
  const { currentUser, isAuthenticated, isBusinessOwner } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<string>("orders");

  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState<boolean>(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (!isBusinessOwner) {
      navigate("/");
      toast.error("You don't have permission to access this page.");
      return;
    }
  }, [isAuthenticated, isBusinessOwner, navigate]);

  const { data: orders, isLoading: loadingOrders, refetch } = useQuery({
    queryKey: ['allOrders'],
    queryFn: getAllOrders,
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  const fetchDbProducts = async () => {
    setLoadingProducts(true);
    const data = await fetchProducts();
    setProducts(data);
    setLoadingProducts(false);
  };

  useEffect(() => {
    if (isBusinessOwner) fetchDbProducts();
  }, [isBusinessOwner]);

  const updateStatusMutation = useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: Order["status"] }) => {
      return updateOrderStatus(orderId, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allOrders'] });
      toast.success("Order status updated successfully.");
    },
    onError: () => {
      toast.error("Failed to update order status.");
    }
  });

  const handleStatusChange = (orderId: string, newStatus: Order["status"]) => {
    updateStatusMutation.mutate({ orderId, status: newStatus });
  };

  const pendingOrders = orders?.filter(o => o.status === "pending").length || 0;
  const totalOrders = orders?.length || 0;
  const totalRevenue = orders?.reduce((acc, o) => acc + o.total, 0) || 0;
  const readyOrders = orders?.filter(o => o.status === "ready").length || 0;

  const handleRefresh = () => {
    refetch();
    toast.success("Orders refreshed");
  };

  const handleProductCreated = () => {
    fetchDbProducts();
  };

  if (loadingOrders) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-juicy-green" />
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Business Dashboard</h1>
          <Button onClick={handleRefresh} variant="outline">
            Refresh Data
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
              <ShoppingBag className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingOrders}</div>
              <p className="text-xs text-muted-foreground">
                Orders awaiting preparation
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ready for Pickup</CardTitle>
              <PieChart className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{readyOrders}</div>
              <p className="text-xs text-muted-foreground">
                Orders ready for customers
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <Users className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalOrders}</div>
              <p className="text-xs text-muted-foreground">
                All-time order count
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                All-time sales
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4 flex flex-wrap gap-2">
            <TabsTrigger value="orders">Order Management</TabsTrigger>
            <TabsTrigger value="settings">Business Settings</TabsTrigger>
            <TabsTrigger value="products">
              <List className="inline w-4 h-4 mr-2" />
              Product Management
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-4">Order Management</h2>
              <OrderManagementTable 
                orders={orders || []} 
                onStatusChange={handleStatusChange}
              />
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-4">Business Settings</h2>
              <p className="text-gray-600 mb-4">
                Configure your store settings, hours, and preferences here.
              </p>
              <div className="space-y-4">
                <p>Store settings will be available in a future update.</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="products">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-4">Product Management</h2>
              <div className="mb-6">
                <ProductForm onProductCreated={handleProductCreated} />
              </div>
              {loadingProducts ? (
                <div className="py-4 text-center">
                  <Loader2 className="mx-auto animate-spin" />
                  Loading products...
                </div>
              ) : (
                <div>
                  {products.length === 0 ? (
                    <div className="text-gray-500 py-8 text-center">No products created yet.</div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                      {products.map(product => (
                        <div key={product.id}>
                          <h4 className="font-semibold text-md mb-2">{product.name}</h4>
                          <div className="mb-2">
                            <img src={product.image} alt={product.name} className="w-full h-32 object-cover rounded" />
                          </div>
                          <div className="text-xs text-gray-600 mb-2">{product.category}</div>
                          <div className="font-bold mb-2">${product.price?.toFixed(2)}</div>
                          <div className="text-gray-700 text-sm mb-1">{product.description}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default BusinessDashboard;
