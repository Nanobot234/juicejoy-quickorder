
import React, { useState, useEffect } from "react";
import { UserSubscription } from "@/types";
import { getUserSubscriptions } from "@/services/subscriptionService";
import { useAuth } from "@/context/AuthContext";
import SubscriptionCard from "./SubscriptionCard";
import { Button } from "@/components/ui/button";
import { Loader2, PlusCircle, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";

const SubscriptionsSection: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<UserSubscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser } = useAuth();

  const fetchSubscriptions = async () => {
    if (!currentUser) return;
    
    setIsLoading(true);
    const data = await getUserSubscriptions(currentUser.id);
    setSubscriptions(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchSubscriptions();
  }, [currentUser]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-juicy-green" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">My Subscriptions</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchSubscriptions}>
            <RefreshCw className="h-4 w-4 mr-1" /> Refresh
          </Button>
          <Button size="sm" className="bg-juicy-green hover:bg-juicy-green/90" asChild>
            <Link to="/menu?subscription=new">
              <PlusCircle className="h-4 w-4 mr-1" /> New Subscription
            </Link>
          </Button>
        </div>
      </div>
      
      {subscriptions.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">You don't have any active subscriptions yet.</p>
          <Button asChild>
            <Link to="/menu?subscription=new" className="bg-juicy-green hover:bg-juicy-green/90">
              <PlusCircle className="h-4 w-4 mr-1" /> Start a Subscription
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subscriptions.map((subscription) => (
            <SubscriptionCard 
              key={subscription.id} 
              subscription={subscription}
              onRefresh={fetchSubscriptions}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SubscriptionsSection;
