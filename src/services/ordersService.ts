
import { CartItem, Order, OrderDetails } from "../types";
import { supabase } from "@/lib/supabase";

export const createOrder = async (userId: string, items: CartItem[], orderDetails: OrderDetails, total: number): Promise<Order | null> => {
  try {
    const newOrder: Omit<Order, 'id'> = {
      userId,
      items,
      orderDetails,
      total,
      status: "pending",
      createdAt: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('orders')
      .insert(newOrder)
      .select('*')
      .single();
      
    if (error) {
      console.error("Error creating order:", error);
      return null;
    }
    
    return data as Order;
  } catch (error) {
    console.error("Error in createOrder:", error);
    return null;
  }
};

export const getUserOrders = async (userId: string): Promise<Order[]> => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('userId', userId)
      .order('createdAt', { ascending: false });
      
    if (error) {
      console.error("Error fetching user orders:", error);
      return [];
    }
    
    return data as Order[];
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
      .order('createdAt', { ascending: false });
      
    if (error) {
      console.error("Error fetching all orders:", error);
      return [];
    }
    
    return data as Order[];
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
    
    return data as Order;
  } catch (error) {
    console.error("Error in updateOrderStatus:", error);
    return null;
  }
};
