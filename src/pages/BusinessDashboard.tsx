
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { useAuth } from "@/context/AuthContext";
import { Loader2, List, Archive } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";

// Import custom hooks and components
import { useBusinessDashboard } from "@/hooks/useBusinessDashboard";
import DashboardCards from "@/components/business/dashboard/DashboardCards";
import ActiveOrdersTab from "@/components/business/dashboard/ActiveOrdersTab";
import CompletedOrdersTab from "@/components/business/dashboard/CompletedOrdersTab";
import BusinessSettingsTab from "@/components/business/dashboard/BusinessSettingsTab";
import ProductManagementTab from "@/components/business/dashboard/ProductManagementTab";

const BusinessDashboard = () => {
  const { currentUser, isAuthenticated, isBusinessOwner } = useAuth();
  const navigate = useNavigate();
  const { 
    activeTab, 
    setActiveTab, 
    orders, 
    loadingOrders, 
    activeOrders, 
    completedOrders, 
    handleStatusChange, 
    handleRefresh 
  } = useBusinessDashboard();

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

        <DashboardCards orders={orders} />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4 flex flex-wrap gap-2">
            <TabsTrigger value="orders">Active Orders</TabsTrigger>
            <TabsTrigger value="completed">
              <Archive className="inline w-4 h-4 mr-2" />
              Completed Orders
            </TabsTrigger>
            <TabsTrigger value="settings">Business Settings</TabsTrigger>
            <TabsTrigger value="products">
              <List className="inline w-4 h-4 mr-2" />
              Product Management
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders">
            <ActiveOrdersTab 
              orders={activeOrders} 
              onStatusChange={handleStatusChange} 
            />
          </TabsContent>

          <TabsContent value="completed">
            <CompletedOrdersTab 
              orders={completedOrders} 
              onStatusChange={handleStatusChange} 
            />
          </TabsContent>

          <TabsContent value="settings">
            <BusinessSettingsTab />
          </TabsContent>

          <TabsContent value="products">
            <ProductManagementTab />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default BusinessDashboard;
