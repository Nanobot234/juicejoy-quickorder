
export interface Product {
  id: string | number;
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
