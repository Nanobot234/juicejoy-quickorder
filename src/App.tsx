
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import Index from "./pages/Index";
import Menu from "./pages/Menu";
import Contact from "./pages/Contact";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import Login from "./pages/Login";
import MyOrders from "./pages/MyOrders";
import BusinessDashboard from "./pages/BusinessDashboard";
import NotFound from "./pages/NotFound";
import { TooltipProvider } from "./components/ui/tooltip";
import React from "react";
// Create a new QueryClient instance
const queryClient = new QueryClient();

const App = () => {
  return (
    <React.Fragment>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <AuthProvider>
              <CartProvider>
                <Toaster />
                <Sonner />
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/menu" element={<Menu />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/order-confirmation" element={<OrderConfirmation />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/my-orders" element={<MyOrders />} />
                  <Route path="/business-dashboard" element={<BusinessDashboard />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </CartProvider>
            </AuthProvider>
          </TooltipProvider>
        </QueryClientProvider>
      </BrowserRouter>
    </React.Fragment>
  );
};

export default App;
