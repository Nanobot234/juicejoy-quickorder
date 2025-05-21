
export interface Product {
  id: string; // UUID string only
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  ingredients: string[];
  benefits: string[];
}

export interface CartItem extends Product {
  quantity: number;
}

export type DeliveryMethod = "pickup" | "delivery";
export type PaymentMethod = "cash" | "card" | "online";

export interface OrderDetails {
  name: string;
  phone: string;
  email: string;
  address?: string;
  deliveryMethod: DeliveryMethod;
  paymentMethod: PaymentMethod;
}

export interface User {
  id: string;
  phone: string;
  name?: string;
  email?: string;
  isBusinessOwner?: boolean;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  orderDetails: OrderDetails;
  total: number;
  status: "pending" | "preparing" | "ready" | "delivered" | "completed";
  createdAt: string;
}

// Subscription Types
export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string | null;
  price: number;
  frequency: "weekly" | "bi-weekly" | "monthly";
  is_active: boolean;
}

export interface SubscriptionItem {
  id: string;
  subscription_id: string;
  product_id: string;
  product?: Product;
  quantity: number;
}

export interface UserSubscription {
  id: string;
  user_id: string;
  plan_id: string;
  plan?: SubscriptionPlan;
  status: "active" | "paused" | "cancelled";
  started_at: string;
  next_delivery_date: string;
  shipping_address: string;
  items?: SubscriptionItem[];
}
