
import React from "react";
import { Loader2 } from "lucide-react";

const OrdersLoading: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-64">
      <Loader2 className="h-8 w-8 animate-spin text-juicy-green" />
    </div>
  );
};

export default OrdersLoading;
