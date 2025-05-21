
import React from "react";
import { format, parseISO } from "date-fns";
import { UserSubscription } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { updateSubscriptionStatus } from "@/services/subscriptionService";
import { Calendar, PauseCircle, PlayCircle, XCircle } from "lucide-react";

interface SubscriptionCardProps {
  subscription: UserSubscription;
  onRefresh: () => void;
}

const SubscriptionCard: React.FC<SubscriptionCardProps> = ({ subscription, onRefresh }) => {
  const handleStatusUpdate = async (status: "active" | "paused" | "cancelled") => {
    const success = await updateSubscriptionStatus(subscription.id, status);
    if (success) {
      onRefresh();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500 hover:bg-green-600";
      case "paused":
        return "bg-amber-500 hover:bg-amber-600";
      case "cancelled":
        return "bg-red-500 hover:bg-red-600";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardContent className="pt-6 flex-grow">
        <div className="flex justify-between mb-4">
          <h3 className="text-xl font-bold">{subscription.plan?.name}</h3>
          <Badge className={getStatusColor(subscription.status)}>
            {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
          </Badge>
        </div>
        
        <div className="space-y-2 text-gray-600">
          <p>
            <span className="font-semibold">Price:</span> ${subscription.plan?.price.toFixed(2)}/{subscription.plan?.frequency}
          </p>
          <p>
            <span className="font-semibold">Started:</span> {format(parseISO(subscription.started_at), "PP")}
          </p>
          <p className="flex items-center">
            <Calendar className="mr-1 h-4 w-4" />
            <span className="font-semibold">Next Delivery:</span> {format(parseISO(subscription.next_delivery_date), "PP")}
          </p>
          <p>
            <span className="font-semibold">Address:</span> {subscription.shipping_address}
          </p>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4">
        {subscription.status === "active" && (
          <Button 
            variant="outline" 
            className="mr-2 flex-1"
            onClick={() => handleStatusUpdate("paused")}
          >
            <PauseCircle className="mr-1 h-4 w-4" /> Pause
          </Button>
        )}
        {subscription.status === "paused" && (
          <Button 
            variant="outline" 
            className="mr-2 flex-1"
            onClick={() => handleStatusUpdate("active")}
          >
            <PlayCircle className="mr-1 h-4 w-4" /> Resume
          </Button>
        )}
        {(subscription.status === "active" || subscription.status === "paused") && (
          <Button 
            variant="outline" 
            className="flex-1 text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
            onClick={() => handleStatusUpdate("cancelled")}
          >
            <XCircle className="mr-1 h-4 w-4" /> Cancel
          </Button>
        )}
        {subscription.status === "cancelled" && (
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={() => handleStatusUpdate("active")}
          >
            <PlayCircle className="mr-1 h-4 w-4" /> Reactivate
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default SubscriptionCard;
