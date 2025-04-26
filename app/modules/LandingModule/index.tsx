"use client";

import { useState, useEffect } from "react";
import {
  ArrowRight,
  ShoppingBag,
  Truck,
  Shield,
  CreditCard,
  Star,
  ChevronLeft,
  ChevronRight,
  Heart,
  ArrowDown,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardFooter } from "~/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

// Sample product data with real images
const featuredProducts = [
  {
    id: 1,
    name: "Premium Wireless Headphones",
    price: 129.99,
    rating: 4.8,
    reviews: 234,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80",
    category: "electronics",
    discount: 15,
    badge: "Best Seller",
  },
  {
    id: 2,
    name: "Organic Cotton T-Shirt",
    price: 24.99,
    rating: 4.5,
    reviews: 187,
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80",
    category: "fashion",
    discount: 0,
    badge: "",
  },
  {
    id: 3,
    name: "Smart Home Assistant",
    price: 79.99,
    rating: 4.7,
    reviews: 156,
    image:
      "https://images.unsplash.com/photo-1558089687-f282ffcbc0d4?w=500&q=80",
    category: "electronics",
    discount: 10,
    badge: "New",
  },
  {
    id: 4,
    name: "Stainless Steel Water Bottle",
    price: 19.99,
    rating: 4.6,
    reviews: 203,
    image:
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&q=80",
    category: "home",
    discount: 0,
    badge: "Eco-Friendly",
  },
  {
    id: 5,
    name: "Leather Crossbody Bag",
    price: 59.99,
    rating: 4.9,
    reviews: 112,
    image:
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=500&q=80",
    category: "fashion",
    discount: 20,
    badge: "Limited",
  },
  {
    id: 6,
    name: "Fitness Tracker Watch",
    price: 89.99,
    rating: 4.4,
    reviews: 178,
    image:
      "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&q=80",
    category: "electronics",
    discount: 0,
    badge: "",
  },
  {
    id: 7,
    name: "Ceramic Coffee Mug Set",
    price: 34.99,
    rating: 4.7,
    reviews: 95,
    image:
      "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500&q=80",
    category: "home",
    discount: 0,
    badge: "",
  },
  {
    id: 8,
    name: "Wireless Charging Pad",
    price: 29.99,
    rating: 4.5,
    reviews: 142,
    image:
      "https://images.unsplash.com/photo-1618577608401-46f4a95e0e4d?w=500&q=80",
    category: "electronics",
    discount: 0,
    badge: "",
  },
];

// Categories with real icons
const categories = [
  {
    id: 1,
    name: "Electronics",
    icon: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=200&h=200&fit=crop&q=80",
    count: 1243,
  },
  {
    id: 2,
    name: "Fashion",
    icon: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=200&h=200&fit=crop&q=80",
    count: 876,
  },
  {
    id: 3,
    name: "Home & Kitchen",
    icon: "https://images.unsplash.com/photo-1556911220-bda9f7f7597e?w=200&h=200&fit=crop&q=80",
    count: 932,
  },
  {
    id: 4,
    name: "Beauty",
    icon: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200&h=200&fit=crop&q=80",
    count: 654,
  },
  {
    id: 5,
    name: "Sports",
    icon: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=200&h=200&fit=crop&q=80",
    count: 421,
  },
  {
    id: 6,
    name: "Books",
    icon: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=200&h=200&fit=crop&q=80",
    count: 765,
  },
];

// Testimonials with real avatars
const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Regular Shopper",
    content:
      "KACAWMart has completely transformed my online shopping experience. The variety of products and the ease of use make it my go-to marketplace!",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 5,
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Tech Enthusiast",
    content:
      "I've been using KACAWMart for all my tech purchases. The prices are competitive and the delivery is always on time. Highly recommended!",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 5,
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Fashion Blogger",
    content:
      "As someone who shops for fashion items regularly, I'm impressed by the quality and variety available on KACAWMart. The return policy is also excellent!",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    rating: 4,
  },
];

// Format price with discount
const formatPrice = (price, discount = 0) => {
  if (discount > 0) {
    const discountedPrice = price - (price * discount) / 100;
    return (
      <div className="flex items-center gap-2">
        <span className="text-lg font-bold text-emerald-600">
          ${discountedPrice.toFixed(2)}
        </span>
        <span className="text-sm line-through text-gray-400">
          ${price.toFixed(2)}
        </span>
      </div>
    );
  }
  return (
    <span className="text-lg font-bold text-emerald-600">
      ${price.toFixed(2)}
    </span>
  );
};

export default function LandingModule() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);

    // Auto-rotate testimonials
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length,
    );
  };

  return (
    <main className="w-full font-sans">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div
              className={`space-y-6 ${isVisible ? "animate-fadeIn" : "opacity-0"}`}
            >
              <Badge className="px-3 py-1 bg-emerald-100 text-emerald-800 hover:bg-emerald-200 transition-colors">
                Welcome to KACAWMart
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 font-serif">
                Discover, Shop, <span className="text-emerald-600">Enjoy</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 max-w-lg">
                Your one-stop marketplace for quality products at unbeatable
                prices. Join thousands of satisfied customers today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-6 rounded-lg text-lg">
                  Shop Now <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 px-6 py-6 rounded-lg text-lg"
                >
                  Explore Categories
                </Button>
              </div>
              <div className="flex items-center gap-6 pt-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full border-2 border-white overflow-hidden"
                    >
                      <img
                        src={`https://randomuser.me/api/portraits/${i % 2 === 0 ? "women" : "men"}/${20 + i}.jpg`}
                        alt="User"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-600">
                  <span className="font-bold text-emerald-600">10,000+</span>{" "}
                  happy customers
                </p>
              </div>
            </div>
            <div
              className={`relative ${isVisible ? "animate-fadeInRight" : "opacity-0"}`}
            >
              <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&h=600&fit=crop&q=80"
                  alt="Featured Products"
                  className="w-full h-auto"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-yellow-400 rounded-full opacity-70 blur-xl"></div>
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-emerald-400 rounded-full opacity-70 blur-xl"></div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex flex-col items-center animate-bounce">
          <p className="text-sm text-gray-500 mb-2">Scroll to explore</p>
          <ArrowDown className="h-5 w-5 text-emerald-600" />
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <Badge className="mb-3 px-3 py-1 bg-emerald-100 text-emerald-800 hover:bg-emerald-200 transition-colors">
              Categories
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-serif">
              Browse by Category
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore our wide range of categories and find exactly what you're
              looking for.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category) => (
              <div
                key={category.id}
                className="bg-gray-50 hover:bg-emerald-50 rounded-xl p-6 text-center transition-all duration-300 hover:shadow-md cursor-pointer group"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:shadow group-hover:bg-emerald-100 transition-all duration-300 overflow-hidden">
                  <img
                    src={category.icon || "/placeholder.svg"}
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-medium text-gray-900 mb-1 group-hover:text-emerald-700 transition-colors">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-500">
                  {category.count} products
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
            <div>
              <Badge className="mb-3 px-3 py-1 bg-emerald-100 text-emerald-800 hover:bg-emerald-200 transition-colors">
                Products
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-serif">
                Featured Products
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl">
                Discover our handpicked selection of top-rated products.
              </p>
            </div>
            <div className="mt-6 md:mt-0">
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="bg-white border border-gray-200 p-1 rounded-lg">
                  <TabsTrigger
                    value="all"
                    className="rounded-md data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-700"
                  >
                    All
                  </TabsTrigger>
                  <TabsTrigger
                    value="electronics"
                    className="rounded-md data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-700"
                  >
                    Electronics
                  </TabsTrigger>
                  <TabsTrigger
                    value="fashion"
                    className="rounded-md data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-700"
                  >
                    Fashion
                  </TabsTrigger>
                  <TabsTrigger
                    value="home"
                    className="rounded-md data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-700"
                  >
                    Home
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="mt-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
                    {featuredProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="electronics" className="mt-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
                    {featuredProducts
                      .filter((p) => p.category === "electronics")
                      .map((product) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                  </div>
                </TabsContent>

                <TabsContent value="fashion" className="mt-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
                    {featuredProducts
                      .filter((p) => p.category === "fashion")
                      .map((product) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                  </div>
                </TabsContent>

                <TabsContent value="home" className="mt-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
                    {featuredProducts
                      .filter((p) => p.category === "home")
                      .map((product) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          <div className="text-center mt-12">
            <Button
              variant="outline"
              className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 px-6 py-6 rounded-lg text-lg"
            >
              View All Products <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Special Offer Banner */}
      <section className="py-16 bg-gradient-to-r from-emerald-600 to-teal-700 text-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-3 px-3 py-1 bg-white text-emerald-800 hover:bg-gray-100 transition-colors">
                Limited Time Offer
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 font-serif">
                Get 20% Off Your First Purchase
              </h2>
              <p className="text-lg opacity-90 mb-8 max-w-lg">
                Sign up for our newsletter and receive a special discount code
                for your first order. Don't miss out on this exclusive offer!
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-white/70"
                  />
                </div>
                <Button className="bg-white text-emerald-700 hover:bg-gray-100 px-6 py-3 rounded-lg">
                  Subscribe
                </Button>
              </div>
              <p className="text-sm opacity-70 mt-4">
                By subscribing, you agree to receive marketing emails from us.
              </p>
            </div>
            <div className="relative">
              <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=600&h=400&fit=crop&q=80"
                  alt="Special Offer"
                  className="w-full h-auto"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-yellow-400 rounded-full opacity-30 blur-xl"></div>
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-emerald-300 rounded-full opacity-30 blur-xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <Badge className="mb-3 px-3 py-1 bg-emerald-100 text-emerald-800 hover:bg-emerald-200 transition-colors">
              Testimonials
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-serif">
              What Our Customers Say
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Don't just take our word for it. Here's what our customers have to
              say about their shopping experience.
            </p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <div className="overflow-hidden">
              <div
                className="transition-all duration-500 ease-in-out"
                style={{
                  transform: `translateX(-${currentTestimonial * 100}%)`,
                }}
              >
                <div className="flex">
                  {testimonials.map((testimonial) => (
                    <div key={testimonial.id} className="min-w-full px-4">
                      <div className="bg-gray-50 rounded-2xl p-8 md:p-10 shadow-sm">
                        <div className="flex items-center gap-4 mb-6">
                          <div className="w-12 h-12 rounded-full overflow-hidden">
                            <img
                              src={testimonial.avatar || "/placeholder.svg"}
                              alt={testimonial.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900">
                              {testimonial.name}
                            </h4>
                            <p className="text-sm text-gray-500">
                              {testimonial.role}
                            </p>
                          </div>
                          <div className="ml-auto flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-5 w-5 ${i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-lg text-gray-700 italic">
                          "{testimonial.content}"
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={prevTestimonial}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 md:-translate-x-6 bg-white rounded-full p-2 shadow-md hover:bg-gray-50 transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-5 w-5 text-gray-700" />
            </button>

            <button
              onClick={nextTestimonial}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 md:translate-x-6 bg-white rounded-full p-2 shadow-md hover:bg-gray-50 transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-5 w-5 text-gray-700" />
            </button>

            <div className="flex justify-center mt-8 gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentTestimonial(i)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    i === currentTestimonial
                      ? "bg-emerald-600 w-6"
                      : "bg-gray-300"
                  }`}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <Badge className="mb-3 px-3 py-1 bg-emerald-100 text-emerald-800 hover:bg-emerald-200 transition-colors">
              Why Choose Us
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-serif">
              The KACAWMart Advantage
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We're committed to providing the best shopping experience for our
              customers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                <Truck className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Free Shipping
              </h3>
              <p className="text-gray-600">
                Enjoy free shipping on all orders over $50. Fast and reliable
                delivery to your doorstep.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Secure Payments
              </h3>
              <p className="text-gray-600">
                Your transactions are protected with industry-leading security
                protocols.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                <CreditCard className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Easy Returns
              </h3>
              <p className="text-gray-600">
                Not satisfied? Return your purchase within 30 days for a full
                refund.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                <ShoppingBag className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Quality Products
              </h3>
              <p className="text-gray-600">
                We carefully curate our selection to ensure you get only the
                best quality products.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-emerald-600 text-white">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 font-serif">
            Ready to Start Shopping?
          </h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers and discover the best deals on
            KACAWMart today.
          </p>
          <Button className="bg-white text-emerald-700 hover:bg-gray-100 px-8 py-6 rounded-lg text-lg">
            Shop Now <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>
    </main>
  );
}

// Product Card Component
function ProductCard({ product }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card
      className="overflow-hidden transition-all duration-300 hover:shadow-md group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden pt-[100%]">
        <img
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          className={`absolute inset-0 w-full h-full object-cover transition-transform duration-500 ${isHovered ? "scale-110" : "scale-100"}`}
        />
        {product.badge && (
          <Badge className="absolute top-3 left-3 bg-emerald-600 text-white hover:bg-emerald-700">
            {product.badge}
          </Badge>
        )}
        {product.discount > 0 && (
          <Badge className="absolute top-3 right-3 bg-red-500 text-white hover:bg-red-600">
            {product.discount}% OFF
          </Badge>
        )}
        <div
          className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300 ${isHovered ? "opacity-100" : "opacity-0"}`}
        >
          <Button className="bg-white text-emerald-700 hover:bg-gray-100 mr-2">
            <ShoppingBag className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            className="border-white text-white hover:bg-white/20"
          >
            <Heart className="h-5 w-5" />
          </Button>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="flex items-center mb-2">
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
            <span className="text-sm font-medium ml-1">{product.rating}</span>
          </div>
          <span className="text-xs text-gray-500 ml-2">
            ({product.reviews} reviews)
          </span>
          <Badge
            variant="outline"
            className="ml-auto text-xs border-gray-200 text-gray-600"
          >
            {product.category}
          </Badge>
        </div>
        <h3 className="font-medium text-gray-900 group-hover:text-emerald-600 transition-colors line-clamp-2 h-12">
          {product.name}
        </h3>
        <div className="mt-2">
          {formatPrice(product.price, product.discount)}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
