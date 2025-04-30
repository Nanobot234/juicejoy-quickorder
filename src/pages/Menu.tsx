
import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { products as localProducts } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { fetchProducts } from "@/services/productsService";

const Menu = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [dbProducts, setDbProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch products from Supabase
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetchProducts().then((fetched) => {
      if (mounted) {
        setDbProducts(fetched);
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  // Merge DB products and hardcoded only if db is empty (fallback to old)
  const allProducts = (dbProducts.length > 0 ? dbProducts : localProducts);

  // Get unique categories
  const categories = ["all", ...Array.from(new Set(allProducts.map(p => p.category)))];

  // Filter products based on search term
  const filteredProducts = allProducts.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.ingredients.some((i: string) => i.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const getCategoryProducts = (category: string) => {
    if (category === "all") {
      return filteredProducts;
    }
    return filteredProducts.filter(p => p.category === category);
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-juicy-orange/90 to-juicy-yellow/90 py-12 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white">Our Juice Menu</h1>
          <p className="text-white/90 max-w-2xl mx-auto mb-8">
            Explore our selection of freshly pressed juices, packed with nutrients and bursting with flavor.
          </p>
          <div className="relative max-w-md mx-auto">
            <Input
              type="text"
              placeholder="Search juices, ingredients..."
              className="pl-10 py-6 rounded-full bg-white/90 backdrop-blur-sm border-transparent focus:border-white"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section className="container mx-auto px-4 py-12">
        {loading ? (
          <div className="text-center py-12">Loading products...</div>
        ) : (
        <Tabs defaultValue="all" className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList className="h-auto p-1">
              {categories.map((category) => (
                <TabsTrigger 
                  key={category} 
                  value={category}
                  className="px-4 py-2 capitalize"
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {categories.map((category) => (
            <TabsContent key={category} value={category}>
              {getCategoryProducts(category).length === 0 ? (
                <div className="text-center py-12">
                  <h3 className="text-2xl font-semibold mb-2">No juices found</h3>
                  <p className="text-gray-500">Try a different search term</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {getCategoryProducts(category).map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
        )}
      </section>

      {/* Benefits Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Benefits of Fresh Juice</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover why incorporating fresh juice into your daily routine can transform your health
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="font-bold text-lg mb-3 text-juicy-green">Increased Energy</h3>
              <p className="text-gray-600">
                Fresh juices provide an instant boost of vitamins and minerals that help fight fatigue and increase your energy levels naturally.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="font-bold text-lg mb-3 text-juicy-green">Improved Digestion</h3>
              <p className="text-gray-600">
                The enzymes in fresh juice aid digestion and help your body absorb nutrients more effectively.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="font-bold text-lg mb-3 text-juicy-green">Better Skin Health</h3>
              <p className="text-gray-600">
                Antioxidants in fresh juices help combat free radicals, leading to clearer, more radiant skin.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="font-bold text-lg mb-3 text-juicy-green">Immune System Support</h3>
              <p className="text-gray-600">
                Regular consumption of fresh juices strengthens your immune system and helps your body fight off illnesses.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Menu;
