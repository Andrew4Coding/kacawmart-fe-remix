import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "~/components/ui/select"
import { Plus } from "lucide-react"
import { Link } from "@remix-run/react"
import { Button } from "~/components/ui/button"
import { Product } from "~/lib/types"
import ProductCard from "./components/card"
import Pagination from "./components/pagination"

export default function ProductModule({ products }: { products: Product[] }) {
  if (!products || products.length === 0) {
    return <p>No products found</p>
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
      
      <div className="mt-10 grid grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
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
  )
}