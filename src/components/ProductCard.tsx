
import React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useCart } from "@/context/CartContext";
import { Product } from "@/types";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  product: Product;
  className?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, className }) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "green":
        return "bg-juicy-green text-white";
      case "berry":
        return "bg-juicy-purple text-white";
      case "tropical":
        return "bg-juicy-yellow text-black";
      case "veggie":
        return "bg-juicy-orange text-white";
      case "citrus":
        return "bg-amber-400 text-black";
      case "fruit":
        return "bg-red-500 text-white";
      case "protein":
        return "bg-brown-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  return (
    <Card className={cn("juice-card h-full flex flex-col", className)}>
      <div className="relative h-48 overflow-hidden rounded-t-xl">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-500"
        />
        <Badge className={`absolute top-2 right-2 ${getCategoryColor(product.category)}`}>
          {product.category}
        </Badge>
      </div>
      <CardContent className="pt-4 flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg text-gray-800">{product.name}</h3>
          <span className="font-semibold text-juicy-green">${product.price.toFixed(2)}</span>
        </div>
        <p className="text-gray-600 text-sm">{product.description}</p>
      </CardContent>
      <CardFooter className="pt-0">
        <Button 
          onClick={handleAddToCart} 
          className="w-full bg-juicy-green hover:bg-juicy-green/90"
        >
          <Plus className="mr-2 h-4 w-4" /> Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
