
import { CartItem, Order, OrderDetails } from "../types";

// In a real app, this would be in a backend database
let MOCK_ORDERS: Order[] = [
  {
    id: "order1",
    userId: "user1",
    items: [
      {
        id: 1,
        name: "Green Goddess",
        description: "A refreshing blend of kale, spinach, apple, and ginger",
        price: 8.99,
        image: "/images/green-juice.jpg",
        category: "green",
        ingredients: ["kale", "spinach", "apple", "ginger"],
        benefits: ["vitamin boost", "immunity", "detox"],
        quantity: 2
      }
    ],
    orderDetails: {
      name: "John Doe",
      phone: "+12345678900",
      email: "john@example.com",
      deliveryMethod: "pickup",
      paymentMethod: "card"
    },
    total: 17.98,
    status: "completed",
    createdAt: "2023-03-15T10:30:00Z"
  },
  {
    id: "order2",
    userId: "user2",
    items: [
      {
        id: 3,
        name: "Berry Blast",
        description: "Mixed berries with banana and almond milk",
        price: 7.99,
        image: "/images/berry-juice.jpg",
        category: "fruit",
        ingredients: ["strawberry", "blueberry", "banana", "almond milk"],
        benefits: ["antioxidants", "energy", "heart health"],
        quantity: 1
      }
    ],
    orderDetails: {
      name: "Jane Smith",
      phone: "+12345678901",
      email: "jane@example.com",
      address: "123 Main St",
      deliveryMethod: "delivery",
      paymentMethod: "cash"
    },
    total: 7.99,
    status: "pending",
    createdAt: "2023-03-16T14:45:00Z"
  }
];

export const createOrder = (userId: string, items: CartItem[], orderDetails: OrderDetails, total: number): Order => {
  const newOrder: Order = {
    id: `order${Date.now()}`,
    userId,
    items: [...items],
    orderDetails,
    total,
    status: "pending",
    createdAt: new Date().toISOString()
  };
  
  MOCK_ORDERS.push(newOrder);
  
  // Save to localStorage for persistence
  const storedOrders = JSON.parse(localStorage.getItem("juicejoy-orders") || "[]");
  storedOrders.push(newOrder);
  localStorage.setItem("juicejoy-orders", JSON.stringify(storedOrders));
  
  return newOrder;
};

export const getUserOrders = (userId: string): Order[] => {
  // Check localStorage first
  const storedOrders = JSON.parse(localStorage.getItem("juicejoy-orders") || "[]");
  const allOrders = [...MOCK_ORDERS, ...storedOrders.filter((order: Order) => 
    !MOCK_ORDERS.some(mockOrder => mockOrder.id === order.id)
  )];
  
  return allOrders.filter(order => order.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export const getAllOrders = (): Order[] => {
  // Check localStorage first
  const storedOrders = JSON.parse(localStorage.getItem("juicejoy-orders") || "[]");
  const allOrders = [...MOCK_ORDERS, ...storedOrders.filter((order: Order) => 
    !MOCK_ORDERS.some(mockOrder => mockOrder.id === order.id)
  )];
  
  return allOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export const updateOrderStatus = (orderId: string, status: Order["status"]): Order | null => {
  // First check if the order is in our mock data
  const orderIndex = MOCK_ORDERS.findIndex(order => order.id === orderId);
  
  if (orderIndex !== -1) {
    MOCK_ORDERS[orderIndex] = {
      ...MOCK_ORDERS[orderIndex],
      status
    };
    return MOCK_ORDERS[orderIndex];
  }
  
  // Then check localStorage
  const storedOrders = JSON.parse(localStorage.getItem("juicejoy-orders") || "[]");
  const storedOrderIndex = storedOrders.findIndex((order: Order) => order.id === orderId);
  
  if (storedOrderIndex !== -1) {
    storedOrders[storedOrderIndex] = {
      ...storedOrders[storedOrderIndex],
      status
    };
    localStorage.setItem("juicejoy-orders", JSON.stringify(storedOrders));
    return storedOrders[storedOrderIndex];
  }
  
  return null;
};
