
import React from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";

interface OrdersHeaderProps {
  title?: string;
}

const OrdersHeader: React.FC<OrdersHeaderProps> = ({ title = "My Orders" }) => {
  const navigate = useNavigate();
  const { cartItems } = useCart();
  const cartItemCount = cartItems.length;
  
  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold">{title}</h1>
      
      <div className="flex space-x-3">
        {cartItemCount > 0 && (
          <Button
            onClick={() => navigate("/cart")}
            className="flex items-center bg-juicy-orange hover:bg-juicy-orange/90"
          >
            <ShoppingBag className="h-4 w-4 mr-2" /> 
            View Cart ({cartItemCount})
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
  );
};

export default OrdersHeader;
