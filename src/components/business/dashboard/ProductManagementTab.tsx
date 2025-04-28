
import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Product } from "@/types";
import { fetchProducts } from "@/services/productsService";
import ProductForm from "@/components/business/ProductForm";
import ProductsGrid from "@/components/business/ProductsGrid";

const ProductManagementTab: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState<boolean>(false);

  const fetchDbProducts = async () => {
    setLoadingProducts(true);
    const data = await fetchProducts();
    setProducts(data);
    setLoadingProducts(false);
  };

  useEffect(() => {
    fetchDbProducts();
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Product Management</h2>
      <div className="mb-6">
        <ProductForm onProductCreated={fetchDbProducts} />
      </div>
      {loadingProducts ? (
        <div className="py-4 text-center">
          <Loader2 className="mx-auto animate-spin" />
          Loading products...
        </div>
      ) : (
        <ProductsGrid products={products} onProductsChanged={fetchDbProducts} />
      )}
    </div>
  );
};

export default ProductManagementTab;
