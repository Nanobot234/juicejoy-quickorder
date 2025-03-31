
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import { useAuth } from "@/context/AuthContext";
import { getAllOrders } from "@/services/ordersService";
import { Order } from "@/types";
import { LogOut } from "lucide-react";
import OrderManagementTable from "@/components/OrderManagementTable";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

const BusinessDashboard = () => {
  const { currentUser, isAuthenticated, isBusinessOwner, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    if (!isAuthenticated || !isBusinessOwner) {
      navigate("/login");
      return;
    }

    loadOrders();
  }, [isAuthenticated, isBusinessOwner, navigate]);

  const loadOrders = () => {
    const allOrders = getAllOrders();
    setOrders(allOrders);
  };

  const handleOrderUpdate = (orderId: string, status: Order["status"]) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, status } : order
      )
    );
  };

  const filteredOrders = activeTab === "all" 
    ? orders 
    : orders.filter(order => order.status === activeTab);

  const statusCounts = {
    all: orders.length,
    pending: orders.filter(order => order.status === "pending").length,
    preparing: orders.filter(order => order.status === "preparing").length,
    ready: orders.filter(order => order.status === "ready").length,
    delivered: orders.filter(order => order.status === "delivered").length,
    completed: orders.filter(order => order.status === "completed").length
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Order Management</h1>
            <p className="text-gray-500">Manage customer orders and update their status</p>
          </div>
          <Button 
            variant="outline" 
            onClick={logout}
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardHeader className="py-4">
              <CardTitle className="text-lg">Total Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{statusCounts.all}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="py-4">
              <CardTitle className="text-lg">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-yellow-500">{statusCounts.pending}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="py-4">
              <CardTitle className="text-lg">Preparing</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-blue-500">{statusCounts.preparing}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="py-4">
              <CardTitle className="text-lg">Ready</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-purple-500">{statusCounts.ready}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="py-4">
              <CardTitle className="text-lg">Delivered/Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-500">
                {statusCounts.delivered + statusCounts.completed}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="px-4 py-4 border-b">
              <TabsList className="grid grid-cols-6 sm:w-auto w-full">
                <TabsTrigger value="all">
                  All ({statusCounts.all})
                </TabsTrigger>
                <TabsTrigger value="pending">
                  Pending ({statusCounts.pending})
                </TabsTrigger>
                <TabsTrigger value="preparing">
                  Preparing ({statusCounts.preparing})
                </TabsTrigger>
                <TabsTrigger value="ready">
                  Ready ({statusCounts.ready})
                </TabsTrigger>
                <TabsTrigger value="delivered">
                  Delivered ({statusCounts.delivered})
                </TabsTrigger>
                <TabsTrigger value="completed">
                  Completed ({statusCounts.completed})
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value={activeTab} className="m-0">
              <OrderManagementTable 
                orders={filteredOrders} 
                onOrderUpdate={handleOrderUpdate} 
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default BusinessDashboard;
