
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Product } from "@/types";
import { updateProduct } from "@/services/productsService";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";

interface ProductEditFormProps {
  product: Product;
  onProductUpdated: () => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ProductEditForm: React.FC<ProductEditFormProps> = ({ 
  product, 
  onProductUpdated,
  open,
  onOpenChange
}) => {
  const [form, setForm] = useState({
    name: product.name,
    description: product.description,
    price: product.price.toString(),
    image: product.image,
    category: product.category,
    ingredients: product.ingredients.join(", "),
    benefits: product.benefits.join(", "),
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const updatedProduct = {
      id: product.id,
      name: form.name,
      description: form.description,
      price: parseFloat(form.price) || 0,
      image: form.image,
      category: form.category,
      ingredients: form.ingredients
        .split(",")
        .map(i => i.trim())
        .filter(Boolean),
      benefits: form.benefits
        .split(",")
        .map(b => b.trim())
        .filter(Boolean),
    };
    
    const success = await updateProduct(updatedProduct);
    setLoading(false);
    
    if (success) {
      toast.success("Product updated successfully!");
      onProductUpdated();
      onOpenChange(false);
    } else {
      toast.error("Failed to update product");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
        </DialogHeader>
        
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">Name</label>
            <Input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">Description</label>
            <Textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="price" className="text-sm font-medium">Price ($)</label>
            <Input
              id="price"
              name="price"
              type="number"
              step="0.01"
              value={form.price}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="image" className="text-sm font-medium">Image URL</label>
            <Input
              id="image"
              name="image"
              value={form.image}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="category" className="text-sm font-medium">Category</label>
            <Input
              id="category"
              name="category"
              value={form.category}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="ingredients" className="text-sm font-medium">Ingredients (comma separated)</label>
            <Input
              id="ingredients"
              name="ingredients"
              value={form.ingredients}
              onChange={handleChange}
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="benefits" className="text-sm font-medium">Benefits (comma separated)</label>
            <Input
              id="benefits"
              name="benefits"
              value={form.benefits}
              onChange={handleChange}
            />
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProductEditForm;
