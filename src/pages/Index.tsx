
import React from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, LeafyGreen, ThumbsUp, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import { useIsMobile } from "@/hooks/use-mobile";
import { products } from "@/data/products";
import ProductCard from "@/components/ProductCard";

const Index = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  // Get 3 featured products
  const featuredProducts = products.slice(0, 3);

  const testimonials = [
    {
      name: "Sarah Johnson",
      text: "JuiceJoy's Green Goddess is now a part of my daily routine. I've never felt more energized!",
      role: "Yoga Instructor"
    },
    {
      name: "Michael Chen",
      text: "The variety and freshness of ingredients keep me coming back. Best juice bar in town by far!",
      role: "Fitness Coach"
    },
    {
      name: "Emily Rodriguez",
      text: "I love that I can order ahead and pick up my favorite Berry Blast on my way to work.",
      role: "Marketing Executive"
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-juicy-green/90 to-juicy-lightGreen/90 text-white">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1589733955941-5eeaf752f6dd?q=80&w=2064" 
            alt="Fresh fruits and juices" 
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 text-center md:text-left mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight animate-fade-in">
                Fresh Juice For A<br />
                <span className="text-juicy-yellow">Healthier You</span>
              </h1>
              <p className="text-lg md:text-xl mb-8 max-w-lg mx-auto md:mx-0 animate-fade-in" style={{animationDelay: "0.2s"}}>
                Handcrafted, cold-pressed juices made from locally sourced, organic ingredients. Delivered fresh to your door.
              </p>
              <Button 
                onClick={() => navigate("/menu")} 
                className="juice-button bg-white text-juicy-green hover:bg-juicy-yellow hover:text-black animate-fade-in"
                style={{animationDelay: "0.4s"}}
              >
                Browse Our Juices <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <div className="md:w-1/2 flex justify-center md:justify-end">
              <div className="relative animate-fade-in" style={{animationDelay: "0.3s"}}>
                <img 
                  src="https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?q=80&w=987&auto=format&fit=crop" 
                  alt="Colorful juices" 
                  className="rounded-2xl shadow-2xl max-w-xs md:max-w-md"
                />
                <div className="absolute -bottom-5 -left-5 bg-white p-3 rounded-xl shadow-lg">
                  <div className="text-black font-bold">100% Natural</div>
                  <div className="text-sm text-gray-600">No preservatives</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose JuiceJoy</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We're dedicated to creating the most nutritious and delicious juices using only the freshest ingredients.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-md text-center hover:shadow-lg transition-shadow">
            <div className="bg-juicy-green/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <LeafyGreen className="h-8 w-8 text-juicy-green" />
            </div>
            <h3 className="text-xl font-bold mb-3">Fresh Ingredients</h3>
            <p className="text-gray-600">
              We source all our fruits and vegetables from local organic farms to ensure maximum freshness and nutrition.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md text-center hover:shadow-lg transition-shadow">
            <div className="bg-juicy-yellow/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <ThumbsUp className="h-8 w-8 text-juicy-yellow" />
            </div>
            <h3 className="text-xl font-bold mb-3">Nutrient Rich</h3>
            <p className="text-gray-600">
              Our cold-pressed process preserves enzymes and nutrients that would otherwise be lost in traditional juicing methods.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md text-center hover:shadow-lg transition-shadow">
            <div className="bg-juicy-purple/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="h-8 w-8 text-juicy-purple" />
            </div>
            <h3 className="text-xl font-bold mb-3">Award Winning</h3>
            <p className="text-gray-600">
              Voted "Best Juice Bar" in town three years running for our commitment to quality and taste.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Most Popular Juices</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Try our customer favorites and best sellers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center mt-10">
            <Button 
              onClick={() => navigate("/menu")} 
              variant="outline" 
              className="juice-button border-juicy-green text-juicy-green hover:bg-juicy-green hover:text-white"
            >
              View All Juices <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Customers Say</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Hear from our happy and healthy customers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-juicy-yellow">★</span>
                ))}
              </div>
              <p className="text-gray-600 mb-6 italic">"{testimonial.text}"</p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-300 rounded-full mr-4"></div>
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-juicy-green text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to start your health journey?</h2>
          <p className="mb-8 max-w-2xl mx-auto">
            Order online for pickup or delivery and enjoy fresh, nutritious juices today!
          </p>
          <Button 
            onClick={() => navigate("/menu")} 
            className="juice-button bg-white text-juicy-green hover:bg-juicy-yellow hover:text-black"
          >
            Order Now <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
