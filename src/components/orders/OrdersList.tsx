
import React from "react";
import { Order } from "@/types";
import OrderCard from "./OrderCard";
import EmptyOrdersState from "./EmptyOrdersState";

interface OrdersListProps {
  orders: Order[] | undefined;
}

const OrdersList: React.FC<OrdersListProps> = ({ orders }) => {
  if (!orders || orders.length === 0) {
    return <EmptyOrdersState />;
  }
  
  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  );
};

export default OrdersList;
