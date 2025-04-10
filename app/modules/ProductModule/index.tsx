import { Plus } from "lucide-react";
import { Button } from "~/components/ui/button";
import ProductCard from "./components/card";
import Pagination from "./components/pagination";
import { Link } from "@remix-run/react";
import { useEffect, useState } from "react";
import { Product } from "~/lib/types";

// const ProductDetailsPage = () => {
//   const [products, setProducts] = useState<Product[] | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     // Mengambil data produk dari API
//     fetch("api/product/filter") 
//       .then((res) => {
//         if (res.status !== 200) {
//           console.log("Error fetching product data");
//           throw new Error("Failed to fetch product data");
//         }
//         return res.json();
//       })
//       .then((data) => {
//         setProducts(data);
//         setIsLoading(false);
//       })
//       .catch((err) => {
//         setError(err.message);
//         setIsLoading(false);
//         console.error(err);
//       });
//   }, []);

//   if (isLoading) {
//     return <p>Loading...</p>;
//   }

//   if (error) {
//     return <p>Error: {error}</p>;
//   }

//   // Ensure products is not null before passing to ProductModule
//   return products ? <ProductModule products={products} /> : null;
//};

export default function ProductModule({ products }: { products: Product[] }) {
  // Add additional check to prevent mapping on undefined
  if (!products || products.length === 0) {
    return <p>No products found</p>;
  }

  return (
    <div className="min-h-screen pt-40 p-20 space-y-10">
      <div className="flex justify-between">
        <h1 className="font-libre font-bold text-2xl">All Products</h1>
        <Link to={"/products/create"}>
          <Button>
            <Plus />
            Add New Product
          </Button>
        </Link>
      </div>
      <div className="mt-10 grid grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard
            key={product.id} // Pastikan memberikan key yang unik
            product={product} // Kirimkan data produk yang sudah terstruktur
          />
        ))}
      </div>
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

//export { ProductDetailsPage };