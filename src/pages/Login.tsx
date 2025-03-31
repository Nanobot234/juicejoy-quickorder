
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Layout from "@/components/Layout";
import PhoneLoginForm from "@/components/PhoneLoginForm";
import BusinessLoginForm from "@/components/BusinessLoginForm";
import { useAuth } from "@/context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isBusinessOwner } = useAuth();
  const [activeTab, setActiveTab] = useState("customer");

  useEffect(() => {
    if (isAuthenticated) {
      if (isBusinessOwner) {
        navigate("/business-dashboard");
      } else {
        navigate("/my-orders");
      }
    }
  }, [isAuthenticated, isBusinessOwner, navigate]);

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
              <PhoneLoginForm />
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
