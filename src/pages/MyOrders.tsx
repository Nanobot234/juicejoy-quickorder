
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { useAuth } from "@/context/AuthContext";
import { getUserOrders } from "@/services/ordersService";
import { Order } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Loader2, ShoppingBag, ListFilter } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";

const statusColors = {
  pending: "bg-yellow-500",
  preparing: "bg-blue-500",
  ready: "bg-purple-500",
  delivered: "bg-green-500",
  completed: "bg-gray-500"
};

const MyOrders = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { state: cartState } = useCart();
  
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
  
  const getStatusBadge = (status: Order["status"]) => {
    return (
      <Badge className={`${statusColors[status]} text-white capitalize`}>
        {status}
      </Badge>
    );
  };
  
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      return dateString;
    }
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

  if (error) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">My Orders</h1>
            <div className="text-center py-12">
              <p className="text-red-500 mb-4">There was an error loading your orders.</p>
              <button
                onClick={() => navigate("/menu")}
                className="text-juicy-green hover:underline"
              >
                Browse our menu to place an order
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">My Orders</h1>
            
            <div className="flex space-x-3">
              {cartState.items.length > 0 && (
                <Button
                  onClick={() => navigate("/cart")}
                  className="flex items-center bg-juicy-orange hover:bg-juicy-orange/90"
                >
                  <ShoppingBag className="h-4 w-4 mr-2" /> 
                  View Cart ({cartState.items.length})
                </Button>
              )}
              
              <Button 
                onClick={() => navigate("/menu")} 
                className="bg-juicy-green hover:bg-juicy-green/90"
              >
                Order Now
              </Button>
            </div>
          </div>
          
          {!orders || orders.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">You don't have any orders yet.</p>
              <button
                onClick={() => navigate("/menu")}
                className="text-juicy-green hover:underline"
              >
                Browse our menu to place an order
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <Card key={order.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle className="text-lg">Order #{order.id.slice(-5)}</CardTitle>
                        <CardDescription>{formatDate(order.createdAt)}</CardDescription>
                      </div>
                      {getStatusBadge(order.status)}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pb-2">
                    <ul className="space-y-2">
                      {order.items.map((item, index) => (
                        <li key={`${order.id}-item-${index}`} className="flex justify-between">
                          <span>
                            <span className="font-medium">{item.quantity}x</span> {item.name}
                          </span>
                          <span className="text-gray-600">${(item.price * item.quantity).toFixed(2)}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Separator className="my-4" />
                    
                    <div className="flex justify-between font-medium">
                      <span>Total</span>
                      <span>${order.total.toFixed(2)}</span>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="pt-2 text-sm text-gray-500">
                    <div className="w-full">
                      <p>
                        <span className="font-medium">Method:</span>{" "}
                        <span className="capitalize">{order.orderDetails.deliveryMethod}</span>
                      </p>
                      <p>
                        <span className="font-medium">Payment:</span>{" "}
                        <span className="capitalize">{order.orderDetails.paymentMethod}</span>
                      </p>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default MyOrders;
