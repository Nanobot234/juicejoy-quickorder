
import React from "react";
import { useNavigate } from "react-router-dom";

const OrdersError: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="text-center py-12">
      <p className="text-red-500 mb-4">There was an error loading your orders.</p>
      <button
        onClick={() => navigate("/menu")}
        className="text-juicy-green hover:underline"
      >
        Browse our menu to place an order
      </button>
    </div>
  );
};

export default OrdersError;
