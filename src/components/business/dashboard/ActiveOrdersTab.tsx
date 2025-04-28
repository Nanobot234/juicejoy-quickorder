
import React from "react";
import OrderManagementTable from "@/components/OrderManagementTable";
import { Order } from "@/types";

interface ActiveOrdersTabProps {
  orders: Order[];
  onStatusChange: (orderId: string, status: Order["status"]) => void;
}

const ActiveOrdersTab: React.FC<ActiveOrdersTabProps> = ({ orders, onStatusChange }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Active Order Management</h2>
      <OrderManagementTable 
        orders={orders} 
        onStatusChange={onStatusChange}
        filterStatus="all"
      />
    </div>
  );
};

export default ActiveOrdersTab;
