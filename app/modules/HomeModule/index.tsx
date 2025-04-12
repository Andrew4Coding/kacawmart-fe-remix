import { useLoaderData } from "@remix-run/react";
import type { loader } from "./loader.js";

import { ArrowRight } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";

export default function HomeModule() {
  const data = useLoaderData<typeof loader>();

  return (
    <main className="w-full font-sans">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="space-y-6">
            <Badge className="px-3 py-1 bg-emerald-100 text-emerald-800 hover:bg-emerald-200 transition-colors">
              Welcome to KACAWMart
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 font-serif">
              Discover, Shop, <span className="text-emerald-600">Enjoy</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-lg">
              {data?.description ?? "-"}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-6 rounded-lg text-lg">
                Shop Now <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
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
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
            {data?.kategoriProduk?.map((category) => (
              <div
                key={category.id}
                className="bg-gray-50 hover:bg-emerald-50 rounded-xl p-6 text-center transition-all duration-300 hover:shadow-md cursor-pointer group"
              >
                <h3 className="font-medium text-gray-900 mb-1 group-hover:text-emerald-700 transition-colors">
                  {category.nama}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Products Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
            <div>
              <Badge className="mb-3 px-3 py-1 bg-emerald-100 text-emerald-800 hover:bg-emerald-200 transition-colors">
                Products
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-serif">
                Popular Products
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
            {data?.produkTerlaris?.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl shadow p-4 hover:shadow-lg transition-all"
              >
                <h3 className="font-medium text-gray-900 mb-2">
                  {product.nama}
                </h3>
                <p className="text-emerald-600 font-bold">
                  Rp {product.harga}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
