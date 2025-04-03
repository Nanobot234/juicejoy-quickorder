
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { useAuth } from "@/context/AuthContext";
import { getAllOrders, updateOrderStatus } from "@/services/ordersService";
import { Order } from "@/types";
import OrderManagementTable from "@/components/OrderManagementTable";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, PieChart, Users, ShoppingBag, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const BusinessDashboard = () => {
  const { currentUser, isAuthenticated, isBusinessOwner } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<string>("orders");
  
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
  
  const { data: orders, isLoading, refetch } = useQuery({
    queryKey: ['allOrders'],
    queryFn: getAllOrders,
    refetchInterval: 30000 // Refresh every 30 seconds
  });
  
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

  // Calculate summary metrics for the dashboard
  const pendingOrders = orders?.filter(o => o.status === "pending").length || 0;
  const totalOrders = orders?.length || 0;
  const totalRevenue = orders?.reduce((acc, o) => acc + o.total, 0) || 0;
  const readyOrders = orders?.filter(o => o.status === "ready").length || 0;

  const handleRefresh = () => {
    refetch();
    toast.success("Orders refreshed");
  };

  if (isLoading) {
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
        
        {/* Dashboard Stats */}
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
          <TabsList className="mb-4">
            <TabsTrigger value="orders">Order Management</TabsTrigger>
            <TabsTrigger value="settings">Business Settings</TabsTrigger>
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
        </Tabs>
      </div>
    </Layout>
  );
};

export default BusinessDashboard;
