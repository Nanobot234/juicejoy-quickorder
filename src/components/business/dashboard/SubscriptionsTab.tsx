
import React, { useEffect, useState } from "react";
import { UserSubscription } from "@/types";
import { getAllActiveSubscriptions, getSubscriptionItems } from "@/services/subscriptionService";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw } from "lucide-react";
import { format, parseISO } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";

const SubscriptionsTab: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<UserSubscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSubscription, setSelectedSubscription] = useState<UserSubscription | null>(null);
  const [subscriptionItems, setSubscriptionItems] = useState<any[]>([]);
  const [isItemsLoading, setIsItemsLoading] = useState(false);

  const fetchSubscriptions = async () => {
    setIsLoading(true);
    const data = await getAllActiveSubscriptions();
    setSubscriptions(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const handleViewItems = async (subscription: UserSubscription) => {
    setSelectedSubscription(subscription);
    setIsItemsLoading(true);
    const items = await getSubscriptionItems(subscription.id);
    setSubscriptionItems(items);
    setIsItemsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-juicy-green" />
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Active Subscriptions</h2>
        <Button variant="outline" onClick={fetchSubscriptions} size="sm">
          <RefreshCw className="h-4 w-4 mr-1" />
          Refresh
        </Button>
      </div>

      {subscriptions.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No active subscriptions found.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Next Delivery</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscriptions.map((subscription) => {
                const profile = (subscription as any).profile;
                return (
                  <TableRow key={subscription.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{profile?.name || 'N/A'}</p>
                        <p className="text-sm text-gray-500">{profile?.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-juicy-green text-white">
                        {subscription.plan?.name}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {format(parseISO(subscription.next_delivery_date), "PP")}
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {subscription.shipping_address}
                    </TableCell>
                    <TableCell>${subscription.plan?.price.toFixed(2)}</TableCell>
                    <TableCell>
                      <Sheet>
                        <SheetTrigger asChild>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleViewItems(subscription)}
                          >
                            View Items
                          </Button>
                        </SheetTrigger>
                        <SheetContent>
                          <SheetHeader>
                            <SheetTitle>Subscription Items</SheetTitle>
                            <SheetDescription>
                              Items in subscription for {profile?.name || 'Customer'}
                            </SheetDescription>
                          </SheetHeader>
                          <div className="mt-6">
                            {isItemsLoading ? (
                              <div className="flex justify-center my-8">
                                <Loader2 className="h-6 w-6 animate-spin text-juicy-green" />
                              </div>
                            ) : (
                              <>
                                {subscriptionItems.length === 0 ? (
                                  <p className="text-center text-gray-500 my-8">
                                    No items found in this subscription.
                                  </p>
                                ) : (
                                  <div className="space-y-4">
                                    {subscriptionItems.map((item) => (
                                      <div 
                                        key={item.id} 
                                        className="flex items-center justify-between border-b pb-3"
                                      >
                                        <div className="flex items-center">
                                          <div className="h-12 w-12 rounded bg-gray-100 mr-3 overflow-hidden">
                                            {item.product?.image_url && (
                                              <img 
                                                src={item.product.image_url} 
                                                alt={item.product.name}
                                                className="w-full h-full object-cover"
                                              />
                                            )}
                                          </div>
                                          <div>
                                            <p className="font-medium">{item.product?.name}</p>
                                            <p className="text-sm text-gray-500">
                                              Qty: {item.quantity}
                                            </p>
                                          </div>
                                        </div>
                                        <div className="text-right">
                                          <p className="font-medium">
                                            ${(item.product?.price * item.quantity).toFixed(2)}
                                          </p>
                                        </div>
                                      </div>
                                    ))}
                                    <div className="flex justify-between pt-3 font-bold">
                                      <span>Total</span>
                                      <span>
                                        ${subscriptionItems.reduce((total, item) => 
                                          total + (item.product?.price || 0) * item.quantity, 0
                                        ).toFixed(2)}
                                      </span>
                                    </div>
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        </SheetContent>
                      </Sheet>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default SubscriptionsTab;
