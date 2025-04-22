
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types";

/**
 * Fetch all products from Supabase
 */
export async function fetchProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });
  
  if (error) {
    console.error("Error fetching products:", error);
    return [];
  }

  // Convert db row to Product type
  return (data || []).map((row) => ({
    id: row.id,
    name: row.name,
    description: row.description ?? "",
    price: parseFloat(row.price.toString()), // Convert price to number
    image: row.image_url ?? "",
    category: row.category ?? "other",
    ingredients: [], // Could be extended in schema
    benefits: [], // Could be extended in schema
  }));
}

/**
 * Insert a new product (business owner only)
 */
export async function createProduct(product: Omit<Product, "id">): Promise<boolean> {
  const { name, description, price, image, category, ingredients, benefits } = product;
  const { error } = await supabase
    .from("products")
    .insert([
      {
        name,
        description,
        price: price.toString(), // Convert price to string for Supabase
        image_url: image,
        category,
        // Could be extended to save ingredients/benefits as JSON in db
      }
    ]);
  if (error) {
    console.error("Error creating product:", error);
    return false;
  }
  return true;
}

