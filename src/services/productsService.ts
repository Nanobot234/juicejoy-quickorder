
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
    .insert({
      name,
      description,
      price, // Keep as number - don't convert to string
      image_url: image,
      category,
      // Could be extended to save ingredients/benefits as JSON in db
    });
  if (error) {
    console.error("Error creating product:", error);
    return false;
  }
  return true;
}

/**
 * Update an existing product
 */
export async function updateProduct(product: Product): Promise<boolean> {
  const { id, name, description, price, image, category } = product;
  const { error } = await supabase
    .from("products")
    .update({
      name,
      description,
      price,
      image_url: image,
      category,
      updated_at: new Date().toISOString()
    })
    .eq("id", id);
  
  if (error) {
    console.error("Error updating product:", error);
    return false;
  }
  return true;
}

/**
 * Delete a product by ID
 */
export async function deleteProduct(productId: string): Promise<boolean> {
  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", productId);
  
  if (error) {
    console.error("Error deleting product:", error);
    return false;
  }
  return true;
}
