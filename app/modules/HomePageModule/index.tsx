import { useLoaderData } from "@remix-run/react";
import { ShoppingCart, Heart } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";

export default function HomeModule() {
  // Mendapatkan data dari loader
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
            Temukan berbagai produk terbaik di KACAWMart! Belanja berbagai macam kebutuhan dengan harga terbaik, kualitas terjamin, dan pengalaman belanja yang menyenangkan. Segera jelajahi berbagai kategori dan temukan produk favoritmu!
          </p>
        </div>
      </div>
    </section>


      {/* Categories Section with Horizontal Scroll */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <Badge className="mb-3 px-3 py-1 bg-emerald-100 text-emerald-800 hover:bg-emerald-200 transition-colors">
              Kategori
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-serif">
              Jelajahi Berdasarkan Kategori
            </h2>
          </div>

          <div className="flex overflow-x-auto gap-6">
            {data?.kategoriProduk?.map((category) => (
              <div
                key={category.id}
                className="bg-gray-50 hover:bg-emerald-50 rounded-xl p-6 text-center transition-all duration-300 hover:shadow-md cursor-pointer group w-64"
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
                Produk
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-serif">
                Produk Terlaris
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
            {data?.produkTerlaris?.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl shadow p-4 hover:shadow-lg transition-all"
              >
                {/* Tampilkan gambar produk */}
                <img
                  src={product.gambar || "/path/to/default-image.jpg"} // Ganti dengan 'gambar'
                  alt={product.nama}
                  className="w-full h-64 object-cover rounded-lg mb-4"
                />
                <h3 className="font-medium text-gray-900 mb-2">
                  {product.nama}
                </h3>
                <p className="text-emerald-600 font-bold">
                  Rp {product.harga}
                </p>
                {/* Add to Cart Button with Icon */}
                <Button className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  <span>Keranjang</span>
                </Button>
                {/* Add to Favorite Button with Icon */}
                <Button className="mt-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2">
                  <Heart className="h-5 w-5" />
                  <span>Favorit</span>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
