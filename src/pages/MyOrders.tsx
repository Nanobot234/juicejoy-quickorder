
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { useAuth } from "@/context/AuthContext";
import { getUserOrders } from "@/services/ordersService";
import { useQuery } from "@tanstack/react-query";
import { useCart } from "@/context/CartContext";
import OrdersHeader from "@/components/orders/OrdersHeader";
import OrdersList from "@/components/orders/OrdersList";
import OrdersLoading from "@/components/orders/OrdersLoading";
import OrdersError from "@/components/orders/OrdersError";

const MyOrders = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { cartItems } = useCart();
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    
    console.log("Current user in MyOrders:", currentUser);
  }, [isAuthenticated, navigate, currentUser]);

  const { data: orders, isLoading, error, refetch } = useQuery({
    queryKey: ['userOrders', currentUser?.id],
    queryFn: () => {
      console.log("Query function called with user ID:", currentUser?.id);
      if (!currentUser?.id) {
        console.error("No user ID available for fetching orders");
        return [];
      }
      return getUserOrders(currentUser.id);
    },
    enabled: !!currentUser?.id,
    staleTime: 30000, // Consider data fresh for 30 seconds
  });
  
  useEffect(() => {
    if (isAuthenticated && currentUser?.id) {
      refetch();
    }
  }, [isAuthenticated, currentUser?.id, refetch]);

  const cartItemCount = cartItems.length;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <OrdersHeader />
          
          {isLoading ? (
            <OrdersLoading />
          ) : error ? (
            <OrdersError />
          ) : (
            <OrdersList orders={orders} />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default MyOrders;
