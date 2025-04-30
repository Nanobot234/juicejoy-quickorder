
import React, { useEffect, useState } from "react";
import { Order } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { subscribeToOrderUpdates } from "@/services/ordersService";
import { toast } from "sonner";
import { RealtimeChannel } from "@supabase/supabase-js";

interface OrderCardProps {
  order: Order;
}

const statusColors = {
  pending: "bg-yellow-500",
  preparing: "bg-blue-500",
  ready: "bg-purple-500",
  delivered: "bg-green-500",
  completed: "bg-gray-500"
};

const statusMessages = {
  pending: "Your order has been received",
  preparing: "Your order is being prepared",
  ready: "Your order is ready for pickup/delivery",
  delivered: "Your order has been delivered",
  completed: "Your order is complete"
};

const OrderCard: React.FC<OrderCardProps> = ({ order: initialOrder }) => {
  const [order, setOrder] = useState<Order>(initialOrder);
  const [previousStatus, setPreviousStatus] = useState<Order["status"]>(initialOrder.status);

  useEffect(() => {
    let channel: RealtimeChannel | null = null;
    
    // Subscribe to real-time updates for this order
    channel = subscribeToOrderUpdates(initialOrder.id, (updatedOrder) => {
      if (updatedOrder.status !== previousStatus) {
        // Show a toast notification when the status changes
        toast.info(`Order #${updatedOrder.id.slice(-5)} status updated: ${updatedOrder.status}`);
        setPreviousStatus(updatedOrder.status);
      }
      setOrder(updatedOrder);
    });
    
    // Cleanup function to unsubscribe from updates when component unmounts
    return () => {
      if (channel) {
        channel.unsubscribe();
      }
    };
  }, [initialOrder.id, previousStatus]);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      return dateString;
    }
  };

  const getStatusBadge = (status: Order["status"]) => {
    return (
      <Badge className={`${statusColors[status]} text-white capitalize`}>
        {status}
      </Badge>
    );
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-lg">Order #{order.id.slice(-5)}</CardTitle>
            <CardDescription>{formatDate(order.createdAt)}</CardDescription>
          </div>
          {getStatusBadge(order.status)}
        </div>
      </CardHeader>
      
      <CardContent className="pb-2">
        <div className="mb-4">
          <p className="text-sm text-gray-600">{statusMessages[order.status]}</p>
        </div>
        
        <ul className="space-y-2">
          {order.items.map((item, index) => (
            <li key={`${order.id}-item-${index}`} className="flex justify-between">
              <span>
                <span className="font-medium">{item.quantity}x</span> {item.name}
              </span>
              <span className="text-gray-600">${(item.price * item.quantity).toFixed(2)}</span>
            </li>
          ))}
        </ul>
        
        <Separator className="my-4" />
        
        <div className="flex justify-between font-medium">
          <span>Total</span>
          <span>${order.total.toFixed(2)}</span>
        </div>
      </CardContent>
      
      <CardFooter className="pt-2 text-sm text-gray-500">
        <div className="w-full">
          <p>
            <span className="font-medium">Method:</span>{" "}
            <span className="capitalize">{order.orderDetails.deliveryMethod}</span>
          </p>
          <p>
            <span className="font-medium">Payment:</span>{" "}
            <span className="capitalize">{order.orderDetails.paymentMethod}</span>
          </p>
        </div>
      </CardFooter>
    </Card>
  );
};

export default OrderCard;
