
import { supabase } from "@/integrations/supabase/client";
import { SubscriptionPlan, UserSubscription, SubscriptionItem, Product } from "@/types";
import { toast } from "sonner";

// Get all available subscription plans
export const getSubscriptionPlans = async (): Promise<SubscriptionPlan[]> => {
  try {
    const { data, error } = await supabase
      .from("subscription_plans")
      .select("*")
      .order("price");

    if (error) throw error;
    
    // Cast the data to ensure it matches our defined types
    return (data || []).map(plan => ({
      ...plan,
      frequency: plan.frequency as "weekly" | "bi-weekly" | "monthly"
    }));
  } catch (error) {
    console.error("Error fetching subscription plans:", error);
    toast.error("Failed to load subscription plans");
    return [];
  }
};

// Get user subscriptions with plan details
export const getUserSubscriptions = async (userId: string): Promise<UserSubscription[]> => {
  try {
    const { data, error } = await supabase
      .from("user_subscriptions")
      .select(`
        *,
        plan:plan_id(*)
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    
    // Cast the data to ensure it matches our defined types
    return (data || []).map(subscription => ({
      ...subscription,
      status: subscription.status as "active" | "paused" | "cancelled",
      plan: subscription.plan ? {
        ...subscription.plan,
        frequency: subscription.plan.frequency as "weekly" | "bi-weekly" | "monthly"
      } : undefined
    }));
  } catch (error) {
    console.error("Error fetching user subscriptions:", error);
    toast.error("Failed to load your subscriptions");
    return [];
  }
};

// Get subscription items with product details
export const getSubscriptionItems = async (subscriptionId: string): Promise<SubscriptionItem[]> => {
  try {
    const { data, error } = await supabase
      .from("subscription_items")
      .select(`
        *,
        product:product_id(*)
      `)
      .eq("subscription_id", subscriptionId);

    if (error) throw error;
    
    // Map and adapt the product data structure
    return (data || []).map(item => ({
      ...item,
      product: item.product ? {
        ...item.product,
        image: item.product.image_url || "",
        ingredients: [], // Default empty arrays as these aren't in the DB
        benefits: []     // Default empty arrays as these aren't in the DB
      } : undefined
    }));
  } catch (error) {
    console.error("Error fetching subscription items:", error);
    toast.error("Failed to load subscription items");
    return [];
  }
};

// Create a new subscription
export const createSubscription = async (
  userId: string,
  planId: string,
  nextDeliveryDate: string,
  shippingAddress: string,
  items: { product_id: string; quantity: number }[]
): Promise<UserSubscription | null> => {
  try {
    // Create the subscription
    const { data: subscription, error: subscriptionError } = await supabase
      .from("user_subscriptions")
      .insert({
        user_id: userId,
        plan_id: planId,
        next_delivery_date: nextDeliveryDate,
        shipping_address: shippingAddress
      })
      .select()
      .single();

    if (subscriptionError) throw subscriptionError;
    
    if (subscription) {
      // Add subscription items
      const subscriptionItems = items.map(item => ({
        subscription_id: subscription.id,
        product_id: item.product_id,
        quantity: item.quantity
      }));

      const { error: itemsError } = await supabase
        .from("subscription_items")
        .insert(subscriptionItems);

      if (itemsError) throw itemsError;
      
      toast.success("Subscription created successfully!");
      // Cast to ensure type compatibility
      return {
        ...subscription,
        status: subscription.status as "active" | "paused" | "cancelled"
      };
    }
    
    return null;
  } catch (error) {
    console.error("Error creating subscription:", error);
    toast.error("Failed to create subscription");
    return null;
  }
};

// Update subscription status
export const updateSubscriptionStatus = async (
  subscriptionId: string, 
  status: "active" | "paused" | "cancelled"
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("user_subscriptions")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", subscriptionId);

    if (error) throw error;
    
    const statusText = 
      status === "active" ? "activated" : 
      status === "paused" ? "paused" : 
      "cancelled";
      
    toast.success(`Subscription ${statusText} successfully!`);
    return true;
  } catch (error) {
    console.error("Error updating subscription status:", error);
    toast.error("Failed to update subscription");
    return false;
  }
};

// Update next delivery date
export const updateNextDeliveryDate = async (
  subscriptionId: string,
  nextDeliveryDate: string
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("user_subscriptions")
      .update({ 
        next_delivery_date: nextDeliveryDate,
        updated_at: new Date().toISOString()
      })
      .eq("id", subscriptionId);

    if (error) throw error;
    toast.success("Next delivery date updated successfully!");
    return true;
  } catch (error) {
    console.error("Error updating delivery date:", error);
    toast.error("Failed to update delivery date");
    return false;
  }
};

// Get all active subscriptions (for business dashboard)
export const getAllActiveSubscriptions = async (): Promise<UserSubscription[]> => {
  try {
    const { data, error } = await supabase
      .from("user_subscriptions")
      .select(`
        *,
        plan:plan_id(*),
        profile:user_id(name, email, phone)
      `)
      .eq("status", "active")
      .order("next_delivery_date", { ascending: true });

    if (error) throw error;
    
    // Cast the data to ensure it matches our defined types
    return (data || []).map(subscription => ({
      ...subscription,
      status: subscription.status as "active" | "paused" | "cancelled",
      plan: subscription.plan ? {
        ...subscription.plan,
        frequency: subscription.plan.frequency as "weekly" | "bi-weekly" | "monthly"
      } : undefined
    }));
  } catch (error) {
    console.error("Error fetching active subscriptions:", error);
    toast.error("Failed to load active subscriptions");
    return [];
  }
};
