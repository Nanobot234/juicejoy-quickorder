
import React from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { useAuth } from "@/context/AuthContext";
import { getUserOrders } from "@/services/ordersService";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import OrdersList from "@/components/orders/OrdersList";

const CustomerDashboard = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const { data: orders, isLoading } = useQuery({
    queryKey: ['userOrders', currentUser?.id],
    queryFn: () => getUserOrders(currentUser?.id || ''),
    enabled: !!currentUser?.id,
  });

  if (!currentUser) {
    return null;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-6">
          {/* Profile Section */}
          <Card>
            <CardHeader>
              <CardTitle>My Profile</CardTitle>
              <CardDescription>Your personal information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p><span className="font-medium">Name:</span> {currentUser.name || 'Not set'}</p>
                <p><span className="font-medium">Email:</span> {currentUser.email}</p>
                <p><span className="font-medium">Phone:</span> {currentUser.phone || 'Not set'}</p>
              </div>
            </CardContent>
          </Card>

          {/* Orders Section */}
          <Card>
            <CardHeader>
              <CardTitle>My Orders</CardTitle>
              <CardDescription>Track your order history</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center p-4">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : (
                <OrdersList orders={orders} />
              )}
            </CardContent>
          </Card>
        </div>

        <div className="mt-6">
          <Button 
            onClick={() => navigate('/menu')} 
            className="w-full md:w-auto"
          >
            Order More Juices
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default CustomerDashboard;
