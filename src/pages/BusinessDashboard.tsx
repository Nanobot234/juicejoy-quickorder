
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { useAuth } from "@/context/AuthContext";
import { getAllOrders, updateOrderStatus } from "@/services/ordersService";
import { Order } from "@/types";
import OrderManagementTable from "@/components/OrderManagementTable";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const BusinessDashboard = () => {
  const { currentUser, isAuthenticated, isBusinessOwner } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
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
  
  const { data: orders, isLoading } = useQuery({
    queryKey: ['allOrders'],
    queryFn: getAllOrders
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
        <h1 className="text-3xl font-bold mb-8">Business Dashboard</h1>
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Order Management</h2>
          <OrderManagementTable 
            orders={orders || []} 
            onStatusChange={handleStatusChange}
          />
        </div>
      </div>
    </Layout>
  );
};

export default BusinessDashboard;
