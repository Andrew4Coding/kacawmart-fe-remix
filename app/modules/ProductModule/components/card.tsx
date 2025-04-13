import { CirclePlus } from "lucide-react";
import { Link } from "@remix-run/react";
import { Product } from "~/lib/types";

interface ProductCardProps {
  product: Product; // Menggunakan tipe Product yang sudah didefinisikan
}

export default function ProductCard({ product }: ProductCardProps) {
  // Fungsi untuk memotong teks
  const truncateText = (text: string, maxLength: number) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm h-full flex flex-col">
      <div className="p-4 flex-grow flex flex-col">
        <div className="flex items-start gap-4">
          <div className="w-24 h-24 flex-shrink-0 rounded-2xl overflow-hidden">
            <img
              src={product.imageUrl || "https://i.pravatar.cc/300"}
              alt={product.name}
              width={96}
              height={96}
              className="object-contain w-full h-full"
            />
          </div>
          <div>
            <Link 
              to={`/products/${product.id}`} 
              className="text-lg font-medium hover:text-emerald-600 line-clamp-1"
            >
              {truncateText(product.name, 35)}
            </Link>
            <div className="text-gray-600 line-clamp-1">
              {truncateText(product.category[0]?.name || "Uncategorized", 12)}
            </div>
            <div className="font-bold mt-1">${product.price.toFixed(2)}</div>
          </div>
        </div>

        <div className="mt-4 flex-grow">
          <h3 className="font-medium">Description</h3>
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
            {truncateText(product.description, 100)}
          </p> 
        </div>

        <div className="mt-4 border rounded-md">
          <div className="grid grid-cols-2 border-b p-2">
            <div className="text-gray-600">Sales</div>
            <div className="text-right">{product.soldQuantity}</div>
          </div>
          <div className="grid grid-cols-2 border-b p-2">
            <div className="text-gray-600">Rating</div>
            <div className="text-right">{product.productRating?.toFixed(1) || 'N/A'}</div>
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