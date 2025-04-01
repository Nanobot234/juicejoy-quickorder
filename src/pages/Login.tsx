
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Layout from "@/components/Layout";
import EmailLoginForm from "@/components/EmailLoginForm";
import BusinessLoginForm from "@/components/BusinessLoginForm";
import PhoneLoginForm from "@/components/PhoneLoginForm";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isBusinessOwner, currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState("customer");

  useEffect(() => {
    // Check if user is authenticated and redirect accordingly
    if (isAuthenticated) {
      if (isBusinessOwner) {
        console.log("Redirecting business owner to dashboard");
        navigate("/business-dashboard");
      } else {
        console.log("Redirecting customer to my orders", currentUser);
        toast.success("Welcome back! Your orders are ready.");
        navigate("/my-orders");
      }
    }
  }, [isAuthenticated, isBusinessOwner, navigate, currentUser]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md p-8">
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="customer">Customer</TabsTrigger>
              <TabsTrigger value="business">Business Owner</TabsTrigger>
            </TabsList>
            <TabsContent value="customer">
              <Tabs defaultValue="email" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="email">Email</TabsTrigger>
                  <TabsTrigger value="phone">Phone</TabsTrigger>
                </TabsList>
                <TabsContent value="email">
                  <EmailLoginForm />
                </TabsContent>
                <TabsContent value="phone">
                  <PhoneLoginForm />
                </TabsContent>
              </Tabs>
            </TabsContent>
            <TabsContent value="business">
              <BusinessLoginForm />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
