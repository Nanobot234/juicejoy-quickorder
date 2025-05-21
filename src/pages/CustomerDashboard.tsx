
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Layout from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OrdersHeader from "@/components/orders/OrdersHeader";
import OrdersList from "@/components/orders/OrdersList";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { UserCircle } from "lucide-react";
import SubscriptionsSection from "@/components/subscription/SubscriptionsSection";
import { useQuery } from "@tanstack/react-query";
import { getUserOrders } from "@/services/ordersService";

const CustomerDashboard = () => {
  const { currentUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("orders");
  const navigate = useNavigate();

  const { data: orders = [] } = useQuery({
    queryKey: ['userOrders', currentUser?.id],
    queryFn: () => currentUser?.id ? getUserOrders(currentUser.id) : [],
    enabled: !!currentUser?.id,
  });

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">My Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Welcome back, {currentUser?.name || "Customer"}
            </p>
          </div>
          <Button onClick={handleLogout} variant="outline">
            <UserCircle className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="bg-white rounded-xl shadow-md mb-6"
        >
          <div className="px-6 pt-6">
            <TabsList className="w-full">
              <TabsTrigger value="orders" className="flex-1">My Orders</TabsTrigger>
              <TabsTrigger value="subscriptions" className="flex-1">My Subscriptions</TabsTrigger>
              <TabsTrigger value="profile" className="flex-1">Profile</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="orders" className="p-0">
            <div className="p-6">
              <OrdersHeader />
              <OrdersList orders={orders} />
            </div>
          </TabsContent>

          <TabsContent value="subscriptions" className="p-0">
            <div className="p-6">
              <SubscriptionsSection />
            </div>
          </TabsContent>

          <TabsContent value="profile" className="p-6">
            <h2 className="text-2xl font-bold mb-4">Profile</h2>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-gray-500">Name</h3>
                  <p>{currentUser?.name || "Not provided"}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-500">Email</h3>
                  <p>{currentUser?.email || "Not provided"}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-500">Phone</h3>
                  <p>{currentUser?.phone || "Not provided"}</p>
                </div>
              </div>
              <div className="mt-6">
                <Button variant="outline">Edit Profile</Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default CustomerDashboard;
