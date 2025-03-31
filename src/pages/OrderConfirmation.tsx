
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { useCart } from "@/context/CartContext";
import { Order } from "@/types";
import { Button } from "@/components/ui/button";
import { Check, Loader2 } from "lucide-react";
import { toast } from "sonner";

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadOrder = async () => {
      try {
        // Check if we have an order promise from the location state
        if (location.state?.orderPromise) {
          const orderPromise = location.state.orderPromise;
          const resolvedOrder = await orderPromise;
          
          if (resolvedOrder) {
            setOrder(resolvedOrder);
            clearCart();
          } else {
            toast.error("Could not retrieve order details");
            navigate("/");
          }
        } else {
          // No order in state, redirect to home
          navigate("/");
        }
      } catch (error) {
        console.error("Error loading order:", error);
        toast.error("An error occurred while loading your order");
        navigate("/");
      } finally {
        setIsLoading(false);
      }
    };

    loadOrder();
  }, [location.state, navigate, clearCart]);

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 flex justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-juicy-green" />
        </div>
      </Layout>
    );
  }

  if (!order) {
    return null;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-8">
            <div className="flex justify-center mb-6">
              <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
                <Check className="h-8 w-8 text-green-600" />
              </div>
            </div>
            
            <h1 className="text-2xl font-bold text-center mb-2">Order Confirmed!</h1>
            <p className="text-gray-600 text-center mb-6">
              Thank you for your order. We've received your request and will prepare it right away.
            </p>
            
            <div className="border-t border-b border-gray-200 py-4 mb-4">
              <p className="font-medium">Order #{order.id.slice(-5)}</p>
              <p className="text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
            
            <div className="mb-6">
              <h3 className="font-medium mb-2">Order Details</h3>
              <div className="space-y-2">
                <p>Name: <span className="text-gray-700">{order.orderDetails.name}</span></p>
                <p>Phone: <span className="text-gray-700">{order.orderDetails.phone}</span></p>
                <p>Method: <span className="capitalize text-gray-700">{order.orderDetails.deliveryMethod}</span></p>
                {order.orderDetails.deliveryMethod === "delivery" && (
                  <p>Address: <span className="text-gray-700">{order.orderDetails.address}</span></p>
                )}
                <p>Items: <span className="text-gray-700">{order.items.reduce((sum, item) => sum + item.quantity, 0)}</span></p>
                <p>Total: <span className="text-gray-700">${order.total.toFixed(2)}</span></p>
              </div>
            </div>
            
            <div className="flex justify-center space-x-4">
              <Button onClick={() => navigate("/menu")}>Order More</Button>
              <Button variant="outline" onClick={() => navigate("/my-orders")}>View My Orders</Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OrderConfirmation;
