
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface ProductFormProps {
  onProductCreated: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ onProductCreated }) => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    category: "",
    // Ingredients and benefits - comma separated for now
    ingredients: "",
    benefits: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { createProduct } = await import("@/services/productsService");
    const newProduct = {
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
    const success = await createProduct(newProduct);
    setLoading(false);
    if (success) {
      toast.success("Product added!");
      setForm({
        name: "",
        description: "",
        price: "",
        image: "",
        category: "",
        ingredients: "",
        benefits: "",
      });
      onProductCreated();
    } else {
      toast.error("Failed to add product");
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <Input
        name="name"
        placeholder="Product name"
        value={form.name}
        onChange={handleChange}
        required
      />
      <Textarea
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
        required
      />
      <Input
        name="price"
        placeholder="Price (number)"
        type="number"
        step="0.01"
        value={form.price}
        onChange={handleChange}
        required
      />
      <Input
        name="image"
        placeholder="Image URL"
        value={form.image}
        onChange={handleChange}
        required
      />
      <Input
        name="category"
        placeholder="Category"
        value={form.category}
        onChange={handleChange}
        required
      />
      <Input
        name="ingredients"
        placeholder="Ingredients (comma separated)"
        value={form.ingredients}
        onChange={handleChange}
      />
      <Input
        name="benefits"
        placeholder="Benefits (comma separated)"
        value={form.benefits}
        onChange={handleChange}
      />
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Adding..." : "Add Product"}
      </Button>
    </form>
  );
};

export default ProductForm;
