import { CirclePlus } from "lucide-react"
import { Link } from "@remix-run/react"

interface ProductCardProps {
  product: {
    id: string
    name: string
    image?: string
    category: string
    price: number
    summary: string
    stats: {
      sales: number
      rating: number
      remaining: number
    }
  }
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm">
      <div className="p-4">
        <div className="flex items-start gap-4">
          <div className="w-24 h-24 flex-shrink-0 rounded-2xl overflow-hidden">
            <img
              src={"https://i.pravatar.cc/300"}
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
            <div className="text-gray-600">{product.category}</div>
            <div className="font-bold mt-1">₹{product.price.toFixed(2)}</div>
          </div>
        </div>

        <div className="mt-4">
          <h3 className="font-medium">Summary</h3>
          <p className="text-sm text-gray-600 mt-1">{product.summary}</p>
        </div>

        <div className="mt-4 border rounded-md">
          <div className="grid grid-cols-2 border-b p-2">
            <div className="text-gray-600">Sales</div>
            <div className="text-right">{product.stats.sales}</div>
          </div>
          <div className="grid grid-cols-2 border-b p-2">
            <div className="text-gray-600">Rating</div>
            <div className="text-right">{product.stats.rating}</div>
          </div>
          <div className="grid grid-cols-2 p-2">
            <div className="text-gray-600">Remaining Products</div>
            <div className="text-right">{product.stats.remaining}</div>
          </div>
        </div>

        <Link
          to={`/products/${product.id}`}
        >
          <button className="w-full mt-4 bg-emerald-600 text-white py-2 rounded-md flex items-center justify-center gap-2">
            <CirclePlus className="h-5 w-5" />
            Manage
          </button>
        </Link>
      </div>
    </div>
  )
}

