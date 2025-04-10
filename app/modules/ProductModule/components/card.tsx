import { CirclePlus } from "lucide-react";
import { Link } from "@remix-run/react";
import { Product } from "~/lib/types";

interface ProductCardProps {
  product: Product; // Menggunakan tipe Product yang sudah didefinisikan
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm">
      <div className="p-4">
        <div className="flex items-start gap-4">
          <div className="w-24 h-24 flex-shrink-0 rounded-2xl overflow-hidden">
            <img
              src={product.imageUrl || "https://i.pravatar.cc/300"} // Menampilkan image produk yang benar
              alt={product.name}
              width={96}
              height={96}
              className="object-contain w-full h-full"
            />
          </div>
          <div>
            <Link to={`/products/${product.id}`} className="text-lg font-medium hover:text-emerald-600">
              {product.name}
            </Link>
            <div className="text-gray-600">{product.category.join(", ")}</div> {/* Jika kategori berupa array */}
            <div className="font-bold mt-1">₹{product.price.toFixed(2)}</div>
          </div>
        </div>

        <div className="mt-4">
          <h3 className="font-medium">Description</h3>
          <p className="text-sm text-gray-600 mt-1">{product.description}</p> 
        </div>

        <div className="mt-4 border rounded-md">
          <div className="grid grid-cols-2 border-b p-2">
            <div className="text-gray-600">Sales</div>
            <div className="text-right">{product.stock}</div> {/*TODO: UBAH INI*/}
          </div>
          <div className="grid grid-cols-2 border-b p-2">
            <div className="text-gray-600">Rating</div>
            <div className="text-right">{product.productRating}</div>
          </div>
          <div className="grid grid-cols-2 p-2">
            <div className="text-gray-600">Stocks</div>
            <div className="text-right">{product.stock}</div>
          </div>
        </div>

        <Link to={`/products/${product.id}`}>
          <button className="w-full mt-4 bg-emerald-600 text-white py-2 rounded-md flex items-center justify-center gap-2">
            <CirclePlus className="h-5 w-5" />
            Manage
          </button>
        </Link>
      </div>
    </div>
  );
}
