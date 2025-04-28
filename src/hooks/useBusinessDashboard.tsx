
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllOrders, updateOrderStatus } from "@/services/ordersService";
import { Order } from "@/types";
import { toast } from "sonner";

export const useBusinessDashboard = () => {
  const [activeTab, setActiveTab] = useState<string>("orders");
  const queryClient = useQueryClient();

  // Fetch orders data
  const { 
    data: orders, 
    isLoading: loadingOrders, 
    refetch 
  } = useQuery({
    queryKey: ['allOrders'],
    queryFn: getAllOrders,
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  // Filter orders by status
  const activeOrders = orders?.filter(o => o.status !== "completed") || [];
  const completedOrders = orders?.filter(o => o.status === "completed") || [];

  // Mutation for updating order status
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

  // Handle status change
  const handleStatusChange = (orderId: string, newStatus: Order["status"]) => {
    updateStatusMutation.mutate({ orderId, status: newStatus });
  };

  // Handle refresh
  const handleRefresh = () => {
    refetch();
    toast.success("Orders refreshed");
  };

  return {
    activeTab,
    setActiveTab,
    orders,
    loadingOrders,
    activeOrders,
    completedOrders,
    handleStatusChange,
    handleRefresh
  };
};
