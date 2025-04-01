
import { CartItem, Order, OrderDetails } from "../types";
import { supabase } from "@/integrations/supabase/client";

// Helper function to convert app Order format to database format
const orderToDbFormat = (order: Omit<Order, "id">) => {
  return {
    user_id: order.userId,
    items: order.items,
    order_details: order.orderDetails,
    total_amount: order.total,
    status: order.status,
    created_at: order.createdAt
  };
};

// Helper function to convert database response to app Order format
const dbToOrderFormat = (dbOrder: any): Order => {
  return {
    id: dbOrder.id,
    userId: dbOrder.user_id,
    items: dbOrder.items || [],
    orderDetails: dbOrder.order_details || {},
    total: dbOrder.total_amount,
    status: dbOrder.status,
    createdAt: dbOrder.created_at
  };
};

export const createOrder = async (userId: string, items: CartItem[], orderDetails: OrderDetails, total: number): Promise<Order | null> => {
  try {
    const newOrder: Omit<Order, "id"> = {
      userId,
      items,
      orderDetails,
      total,
      status: "pending",
      createdAt: new Date().toISOString()
    };
    
    const dbOrderData = orderToDbFormat(newOrder);
    
    const { data, error } = await supabase
      .from('orders')
      .insert(dbOrderData)
      .select('*')
      .single();
      
    if (error) {
      console.error("Error creating order:", error);
      return null;
    }
    
    return dbToOrderFormat(data);
  } catch (error) {
    console.error("Error in createOrder:", error);
    return null;
  }
};

export const getUserOrders = async (userId: string): Promise<Order[]> => {
  try {
    if (!userId) {
      console.error("No userId provided to getUserOrders");
      return [];
    }
    
    console.log("Fetching orders for user:", userId);
    
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error("Error fetching user orders:", error);
      return [];
    }
    
    console.log("Orders retrieved:", data);
    return data.map(dbToOrderFormat);
  } catch (error) {
    console.error("Error in getUserOrders:", error);
    return [];
  }
};

export const getAllOrders = async (): Promise<Order[]> => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error("Error fetching all orders:", error);
      return [];
    }
    
    return data.map(dbToOrderFormat);
  } catch (error) {
    console.error("Error in getAllOrders:", error);
    return [];
  }
};

export const updateOrderStatus = async (orderId: string, status: Order["status"]): Promise<Order | null> => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId)
      .select('*')
      .single();
      
    if (error) {
      console.error("Error updating order status:", error);
      return null;
    }
    
    return dbToOrderFormat(data);
  } catch (error) {
    console.error("Error in updateOrderStatus:", error);
    return null;
  }
};
