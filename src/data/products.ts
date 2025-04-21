
import { Product } from "../types";

// Pre-generated UUIDs for each product (replace with real ones in the future if needed)
export const products: Product[] = [
  {
    id: "e624de0a-68bc-4fcf-bfb8-471c17df2aea",
    name: "Green Goddess",
    description: "A refreshing blend of kale, cucumber, apple and mint for a revitalizing boost.",
    price: 7.99,
    image: "https://images.unsplash.com/photo-1622597467836-f3e9ec9f818e?q=80&w=800&auto=format&fit=crop",
    category: "green",
    ingredients: ["Kale", "Cucumber", "Green Apple", "Mint", "Lemon"],
    benefits: ["Rich in vitamins A, C, and K", "Detoxifying", "Immune-boosting"]
  },
  {
    id: "d7a72814-cda9-41f1-8188-b67843ff5f2e",
    name: "Berry Blast",
    description: "Sweet and tangy mix of strawberries, blueberries and raspberries for antioxidant power.",
    price: 8.49,
    image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?q=80&w=800&auto=format&fit=crop",
    category: "berry",
    ingredients: ["Strawberries", "Blueberries", "Raspberries", "Banana", "Almond Milk"],
    benefits: ["High in antioxidants", "Heart healthy", "Skin nourishing"]
  },
  {
    id: "24bdc845-8604-4292-85f6-744f2fa1d5ba",
    name: "Tropical Paradise",
    description: "Exotic blend of mango, pineapple and coconut for a beachside getaway in a glass.",
    price: 8.99,
    image: "https://images.unsplash.com/photo-1596392301391-4a4b81b3a518?q=80&w=800&auto=format&fit=crop",
    category: "tropical",
    ingredients: ["Mango", "Pineapple", "Coconut Water", "Banana", "Lime"],
    benefits: ["Digestive aid", "Hydrating", "Energy boosting"]
  },
  {
    id: "810a3d14-dee9-4c41-9343-b7d9c234c3a4",
    name: "Carrot Sunrise",
    description: "Classic carrot juice with hints of ginger and orange for a morning boost.",
    price: 7.49,
    image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?q=80&w=800&auto=format&fit=crop",
    category: "veggie",
    ingredients: ["Carrots", "Orange", "Ginger", "Turmeric", "Lemon"],
    benefits: ["Improves vision", "Anti-inflammatory", "Boosts immunity"]
  },
  {
    id: "b7fbbde9-0883-4f33-b004-7c1d4a1be4df",
    name: "Beet Energizer",
    description: "Hearty blend of beets, apples and ginger to power your day.",
    price: 8.49,
    image: "https://images.unsplash.com/photo-1638176066371-35d34af661cc?q=80&w=800&auto=format&fit=crop",
    category: "veggie",
    ingredients: ["Beets", "Apple", "Ginger", "Lemon", "Celery"],
    benefits: ["Improves athletic performance", "Supports liver health", "Rich in iron"]
  },
  {
    id: "c479253c-c828-4b26-8b66-fd09051cafd7",
    name: "Citrus Splash",
    description: "Zesty mix of orange, grapefruit and lemon for a vitamin C boost.",
    price: 7.99,
    image: "https://images.unsplash.com/photo-1534353473418-4cfa6c56fd51?q=80&w=800&auto=format&fit=crop",
    category: "citrus",
    ingredients: ["Orange", "Grapefruit", "Lemon", "Lime", "Mint"],
    benefits: ["Immune boosting", "Skin brightening", "Hydrating"]
  },
  {
    id: "ee1777d8-0dc9-4ce9-8013-84d8ba8adf34",
    name: "Watermelon Refresh",
    description: "Simple, cooling watermelon juice with a hint of lime and mint.",
    price: 7.49,
    image: "https://images.unsplash.com/photo-1573500713426-f97ab264d2b1?q=80&w=800&auto=format&fit=crop",
    category: "fruit",
    ingredients: ["Watermelon", "Lime", "Mint"],
    benefits: ["Hydrating", "Rich in lycopene", "Muscle recovery"]
  },
  {
    id: "18d68dee-a08e-488d-bb81-4ede68d3ab05",
    name: "Protein Supreme",
    description: "Hearty blend with almond butter, banana, and plant protein for post-workout recovery.",
    price: 9.49,
    image: "https://images.unsplash.com/photo-1577805947697-89e18249d767?q=80&w=800&auto=format&fit=crop",
    category: "protein",
    ingredients: ["Banana", "Almond Butter", "Plant Protein", "Almond Milk", "Dates"],
    benefits: ["Muscle recovery", "Filling", "Energy boosting"]
  }
];
