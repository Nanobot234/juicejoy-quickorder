
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import { CartItem, OrderDetails } from "@/types";
import { createOrder } from "@/services/ordersService";
import { useAuth } from "@/context/AuthContext";

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [orderItems, setOrderItems] = useState<CartItem[]>([]);
  const [orderTotal, setOrderTotal] = useState<number>(0);
  const [orderNumber, setOrderNumber] = useState<string>("");

  useEffect(() => {
    // Retrieve order details from session storage
    const storedOrderDetails = sessionStorage.getItem("orderDetails");
    const storedOrderItems = sessionStorage.getItem("orderItems");
    const storedOrderTotal = sessionStorage.getItem("orderTotal");

    if (!storedOrderDetails || !storedOrderItems || !storedOrderTotal) {
      // If no order details exist, redirect to the menu
      navigate("/menu");
      return;
    }

    try {
      const parsedOrderDetails = JSON.parse(storedOrderDetails);
      const parsedOrderItems = JSON.parse(storedOrderItems);
      const parsedOrderTotal = parseFloat(storedOrderTotal);
      
      setOrderDetails(parsedOrderDetails);
      setOrderItems(parsedOrderItems);
      setOrderTotal(parsedOrderTotal);
      
      // Generate a random order number
      const randomOrderNumber = "JJ" + Math.floor(10000 + Math.random() * 90000).toString();
      setOrderNumber(randomOrderNumber);
      
      // If user is logged in, create an order in our service
      if (currentUser) {
        const newOrder = createOrder(
          currentUser.id,
          parsedOrderItems,
          parsedOrderDetails,
          parsedOrderTotal
        );
        
        // Set the order ID from the created order
        setOrderNumber(newOrder.id);
      }
    } catch (error) {
      console.error("Error parsing order details:", error);
      navigate("/menu");
    }
  }, [navigate, currentUser]);

  // Calculate remaining values
  const subtotal = orderTotal;
  const tax = subtotal * 0.08;
  const deliveryFee = orderDetails?.deliveryMethod === "delivery" ? 3.99 : 0;
  const total = subtotal + tax + deliveryFee;

  // Get estimated time
  const getEstimatedTime = () => {
    const now = new Date();
    const estimatedMinutes = orderDetails?.deliveryMethod === "delivery" ? 45 : 20;
    const estimatedTime = new Date(now.getTime() + estimatedMinutes * 60000);
    return estimatedTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  if (!orderDetails || orderItems.length === 0) {
    return null; // This will allow the useEffect to handle the redirect
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
            <p className="text-gray-600 mb-6">
              Thank you for your order. We've received your request and are preparing your fresh juices!
            </p>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-8">
              <div className="text-lg font-semibold mb-2">Order #{orderNumber.slice(-5)}</div>
              <div className="text-gray-600">Estimated {orderDetails.deliveryMethod === "pickup" ? "pickup" : "delivery"} time: {getEstimatedTime()}</div>
            </div>

            <div className="divide-y divide-gray-200">
              <div className="pb-6 text-left">
                <h2 className="text-xl font-semibold mb-4">Order Details</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-gray-500 text-sm">Name</div>
                    <div>{orderDetails.name}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-sm">Phone</div>
                    <div>{orderDetails.phone}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-sm">Email</div>
                    <div>{orderDetails.email}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-sm">Method</div>
                    <div className="capitalize">{orderDetails.deliveryMethod}</div>
                  </div>
                  {orderDetails.deliveryMethod === "delivery" && orderDetails.address && (
                    <div className="col-span-2">
                      <div className="text-gray-500 text-sm">Delivery Address</div>
                      <div>{orderDetails.address}</div>
                    </div>
                  )}
                  <div className="col-span-2">
                    <div className="text-gray-500 text-sm">Payment Method</div>
                    <div className="capitalize">{orderDetails.paymentMethod}</div>
                  </div>
                </div>
              </div>

              <div className="py-6 text-left">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                <div className="space-y-4">
                  {orderItems.map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <div>
                        <span className="font-medium">{item.quantity}x</span> {item.name}
                      </div>
                      <div className="font-medium">${(item.price * item.quantity).toFixed(2)}</div>
                    </div>
                  ))}
                </div>
                
                <div className="border-t border-gray-200 mt-4 pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  {deliveryFee > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Delivery Fee</span>
                      <span>${deliveryFee.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="border-t border-gray-200 my-2 pt-2 flex justify-between font-semibold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => navigate("/menu")} 
                className="bg-juicy-green hover:bg-juicy-green/90"
              >
                Order More Juices <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              
              {currentUser && (
                <Button 
                  variant="outline" 
                  onClick={() => navigate("/my-orders")}
                >
                  View My Orders
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OrderConfirmation;
