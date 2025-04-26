"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Plus, Search } from "lucide-react";
import { Link, useNavigate } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import type { Product } from "~/lib/types";
import ProductCard from "./components/card";
import Pagination from "./components/pagination";
import { useState, useEffect } from "react";

export default function ProductModule({
  products,
  categories,
  selectedCategoryId,
}: {
  products: Product[];
  categories: { id: string; name: string }[];
  selectedCategoryId: string | null;
}) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);

  // Log props to help debug
  console.log("Products:", products);
  console.log("Categories:", categories);
  console.log("Selected Category ID:", selectedCategoryId);

  // Filter products based on search query
  useEffect(() => {
    const filtered = products.filter((product) => {
      const matchesSearch =
        searchQuery === "" ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.description &&
          product.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase()));

      return matchesSearch;
    });

    setFilteredProducts(filtered);
  }, [searchQuery, products]);

  // Handle category change - simple approach using direct navigation
  const handleCategoryChange = (categoryId: string) => {
    if (categoryId === "all") {
      // Navigate to the base URL without category filter
      navigate(`/products`);
    } else {
      // Navigate with the category filter
      navigate(`/products?categoryId=${categoryId}`);
    }
  };

  // If products array is undefined or not an array, show a message
  if (!Array.isArray(products)) {
    return (
      <div className="min-h-screen pt-40 p-20">
        <p>Error: Products data is not in the expected format</p>
        <pre>{JSON.stringify(products, null, 2)}</pre>
      </div>
    );
  }

  // If no products, show a message
  if (products.length === 0) {
    return (
      <div className="min-h-screen pt-40 p-20">
        <p>No products found</p>
        <Button onClick={() => navigate("/products")} variant="outline">
          Clear Filters
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-40 p-20 space-y-10">
      <div className="flex justify-between items-center">
        <h1 className="font-libre font-bold text-2xl">All Products</h1>
        <div className="flex items-center space-x-4">
          <Link to={"/products/create"}>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add New Product
            </Button>
          </Link>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="w-full md:w-auto flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search products..."
              className="pl-10 py-2 border-gray-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="w-full md:w-48">
          <Select
            value={selectedCategoryId || "all"}
            onValueChange={handleCategoryChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results Summary */}
      <div className="text-sm text-gray-500">
        Showing {filteredProducts.length} of {products.length} products
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-gray-500 mb-4">
            No products found matching your criteria.
          </div>
          <Button
            onClick={() => {
              setSearchQuery("");
              navigate("/products");
            }}
            variant="outline"
          >
            Clear Filters
          </Button>
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      <Pagination
        currentPage={1}
        totalPages={10}
        onPageChange={(page) => {
          console.log(`Page changed to: ${page}`);
        }}
      />
    </div>
  );
}
