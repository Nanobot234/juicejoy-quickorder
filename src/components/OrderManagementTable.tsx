
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, Clock, Check, Truck, PackageCheck } from "lucide-react";
import { Order } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger, 
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

export interface OrderManagementTableProps {
  orders: Order[];
  onStatusChange: (orderId: string, status: Order["status"]) => void;
}

const statusColors = {
  pending: "bg-yellow-500",
  preparing: "bg-blue-500",
  ready: "bg-purple-500",
  delivered: "bg-green-500",
  completed: "bg-gray-500"
};

const statusIcons = {
  pending: <Clock className="h-4 w-4" />,
  preparing: <PackageCheck className="h-4 w-4" />,
  ready: <Check className="h-4 w-4" />,
  delivered: <Truck className="h-4 w-4" />,
  completed: <Check className="h-4 w-4" />
};

const statusOptions: Order["status"][] = ["pending", "preparing", "ready", "delivered", "completed"];

const OrderManagementTable: React.FC<OrderManagementTableProps> = ({ orders, onStatusChange }) => {
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      return dateString;
    }
  };
  
  const handleStatusChange = (orderId: string, newStatus: Order["status"], currentStatus: Order["status"]) => {
    if (newStatus === currentStatus) {
      return;
    }
    
    console.log(`Changing order ${orderId} status from ${currentStatus} to ${newStatus}`);
    onStatusChange(orderId, newStatus);
    toast.success(`Order #${orderId.slice(-5)} status updated to ${newStatus}`);
  };
  
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Method</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                No orders found
              </TableCell>
            </TableRow>
          ) : (
            orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">
                  #{order.id.slice(-5)}
                  <span className="text-xs text-gray-500 block">
                    Full ID: {order.id}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span>{order.orderDetails.name}</span>
                    <span className="text-xs text-gray-500">{order.orderDetails.phone}</span>
                  </div>
                </TableCell>
                <TableCell>{formatDate(order.createdAt)}</TableCell>
                <TableCell>
                  <span className="font-medium">{order.items.reduce((sum, item) => sum + item.quantity, 0)} items</span>
                </TableCell>
                <TableCell>${order.total.toFixed(2)}</TableCell>
                <TableCell className="capitalize">{order.orderDetails.deliveryMethod}</TableCell>
                <TableCell>
                  <Badge className={`${statusColors[order.status]} text-white`}>
                    <span className="flex items-center gap-1">
                      {statusIcons[order.status]}
                      <span className="capitalize">{order.status}</span>
                    </span>
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        Update Status <ChevronDown className="ml-1 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {statusOptions.map((status) => (
                        <DropdownMenuItem 
                          key={status}
                          className="capitalize"
                          onClick={() => handleStatusChange(order.id, status, order.status)}
                          disabled={order.status === status}
                        >
                          <div className="flex items-center gap-2">
                            {statusIcons[status]}
                            <span>{status}</span>
                          </div>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default OrderManagementTable;
