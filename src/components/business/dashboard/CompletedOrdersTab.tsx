
import React from "react";
import OrderManagementTable from "@/components/OrderManagementTable";
import { Order } from "@/types";

interface CompletedOrdersTabProps {
  orders: Order[];
  onStatusChange: (orderId: string, status: Order["status"]) => void;
}

const CompletedOrdersTab: React.FC<CompletedOrdersTabProps> = ({ orders, onStatusChange }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Completed Order History</h2>
      <OrderManagementTable 
        orders={orders} 
        onStatusChange={onStatusChange}
        filterStatus="completed"
      />
    </div>
  );
};

export default CompletedOrdersTab;
