
import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Check, Loader2 } from "lucide-react";
import { toast } from "sonner";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const [isLoading, setIsLoading] = useState(true);
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    // Clear cart after successful payment
    clearCart();
    toast.success("Payment successful! Your order has been received.");
    setIsLoading(false);
  }, [clearCart]);

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 flex justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-juicy-green" />
        </div>
      </Layout>
    );
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
            
            <h1 className="text-2xl font-bold text-center mb-2">Payment Successful!</h1>
            <p className="text-gray-600 text-center mb-6">
              Thank you for your order. We've received your payment and will prepare your order right away.
            </p>
            
            {sessionId && (
              <div className="border-t border-b border-gray-200 py-4 mb-4">
                <p className="font-medium">Payment ID: {sessionId.slice(-8)}</p>
                <p className="text-gray-600">{new Date().toLocaleDateString()}</p>
              </div>
            )}
            
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

export default PaymentSuccess;
