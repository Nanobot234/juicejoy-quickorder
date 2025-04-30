
import React, { createContext, useContext, useReducer, ReactNode } from "react";
import { CartItem, Product } from "../types";
import { toast } from "sonner";

// Define the shape of the cart state
interface CartState {
  items: CartItem[];
  total: number;
}

// Define the possible actions for the cart
type CartAction =
  | { type: "ADD_ITEM"; payload: Product }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "CLEAR_CART" };

// Initial cart state
const initialCartState: CartState = {
  items: [],
  total: 0,
};

// Create context
const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
  addToCart: (product: Product) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
} | undefined>(undefined);

// Calculate the total price of items in the cart
const calculateTotal = (items: CartItem[]): number => {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
};

// Helper function to compare IDs (now comparing strings)
const isSameId = (id1: string, id2: string): boolean => {
  return id1 === id2;
};

// Reducer function to handle cart state updates
const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItemIndex = state.items.findIndex(
        (item) => isSameId(item.id, action.payload.id)
      );

      if (existingItemIndex !== -1) {
        // If the item already exists, update its quantity
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + 1,
        };

        return {
          ...state,
          items: updatedItems,
          total: calculateTotal(updatedItems),
        };
      } else {
        // If the item doesn't exist, add it with quantity 1
        const newItem: CartItem = { ...action.payload, quantity: 1 };
        const updatedItems = [...state.items, newItem];

        return {
          ...state,
          items: updatedItems,
          total: calculateTotal(updatedItems),
        };
      }
    }

    case "REMOVE_ITEM": {
      const updatedItems = state.items.filter(
        (item) => !isSameId(item.id, action.payload)
      );
      
      return {
        ...state,
        items: updatedItems,
        total: calculateTotal(updatedItems),
      };
    }

    case "UPDATE_QUANTITY": {
      const { id, quantity } = action.payload;

      if (quantity <= 0) {
        // If quantity is 0 or less, remove the item
        const updatedItems = state.items.filter((item) => !isSameId(item.id, id));
        return {
          ...state,
          items: updatedItems,
          total: calculateTotal(updatedItems),
        };
      }

      const updatedItems = state.items.map((item) =>
        isSameId(item.id, id) ? { ...item, quantity } : item
      );

      return {
        ...state,
        items: updatedItems,
        total: calculateTotal(updatedItems),
      };
    }

    case "CLEAR_CART":
      return initialCartState;

    default:
      return state;
  }
};

// Create the provider component
export const CartProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(cartReducer, initialCartState);

  // Helper functions
  const addToCart = (product: Product) => {
    dispatch({ type: "ADD_ITEM", payload: product });
    toast.success(`Added ${product.name} to cart!`);
  };

  const removeFromCart = (id: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: id });
    toast.info("Item removed from cart");
  };

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  const value = {
    state,
    dispatch,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// Custom hook to use the cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
