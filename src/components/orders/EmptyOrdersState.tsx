
import React from "react";
import { useNavigate } from "react-router-dom";

const EmptyOrdersState: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="text-center py-12">
      <p className="text-gray-500 mb-4">You don't have any orders yet.</p>
      <button
        onClick={() => navigate("/menu")}
        className="text-juicy-green hover:underline"
      >
        Browse our menu to place an order
      </button>
    </div>
  );
};

export default EmptyOrdersState;
