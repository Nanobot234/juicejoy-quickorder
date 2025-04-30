
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Users, ShoppingBag, DollarSign } from "lucide-react";
import { Order } from "@/types";

interface DashboardCardsProps {
  orders: Order[] | undefined;
}

const DashboardCards: React.FC<DashboardCardsProps> = ({ orders }) => {
  const pendingOrders = orders?.filter(o => o.status === "pending").length || 0;
  const totalOrders = orders?.length || 0;
  const totalRevenue = orders?.reduce((acc, o) => acc + o.total, 0) || 0;
  const readyOrders = orders?.filter(o => o.status === "ready").length || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
          <ShoppingBag className="h-4 w-4 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{pendingOrders}</div>
          <p className="text-xs text-muted-foreground">
            Orders awaiting preparation
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Ready for Pickup</CardTitle>
          <PieChart className="h-4 w-4 text-purple-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{readyOrders}</div>
          <p className="text-xs text-muted-foreground">
            Orders ready for customers
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
          <Users className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalOrders}</div>
          <p className="text-xs text-muted-foreground">
            All-time order count
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">
            All-time sales
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardCards;
