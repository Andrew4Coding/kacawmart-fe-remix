import Image from "next/image"
import { Eye, Settings } from "lucide-react"
import { Button } from "~/components/ui/button"
import { Card, CardContent } from "~/components/ui/card"
import { formatPrice } from "~/lib/utils"
import { Product } from "~/lib/types"
import { useEffect, useState } from "react"


interface ProductCardProps {
  product: Product
}

const ProductDetailsPage = () => {
  const [product, setProduct] = useState<Product | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Mengambil data produk dari API
    fetch("/api/product/filter")  // Sesuaikan dengan URL endpoint yang sesuai
      .then((res) => {
        if (res.status !== 200) {
          throw new Error("Failed to fetch product data")
        }
        return res.json()
      })
      .then((data) => {
        setProduct(data)
      })
      .catch((err) => {
        setError(err.message)
        console.error(err)
      })
  }, [])

  if (error) {
    return <p>Error: {error}</p>
  }

  if (!product) {
    return <p>Loading...</p>
  }

  return (
    <div className="product-details-page">
      <ProductCard product={product} />
    </div>
  )
}

export default ProductDetailsPage

// ekspor fungsi yang memungkinkan ProductCard digunakan di tempat lain
export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="p-4 flex gap-4">
        <div className="w-24 h-24 relative shrink-0">
          <Image src={product.imageUrl || "/placeholder.svg"} alt={product.name} fill className="object-contain" />
        </div>
        <div>
          <h3 className="font-medium line-clamp-2">{product.name}</h3>
          <p className="text-sm text-muted-foreground">{product.category[0]?.name || "Uncategorized"}</p>
          <p className="font-semibold mt-1">{formatPrice(product.price)}</p>
        </div>
      </div>

      <CardContent className="p-4 pt-0">
        <div className="text-sm font-medium mb-2">Summary</div>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{product.description.split("|")[0]}</p>

        <div className="grid grid-cols-3 gap-2 mb-4">
          <div>
            <div className="text-xs text-muted-foreground">Sales</div>
            <div className="font-medium">{product.Seller[0]?.selledProduct || 0}</div> // TODO: UBAH INI
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Rating</div>
            <div className="font-medium flex items-center">{product.productRating.toFixed(1)}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Remaining Products</div>
            <div className="font-medium">{product.stock}</div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" className="flex-1 h-9">
            <Eye className="h-4 w-4 mr-2" /> View Reviews
          </Button>
          <Button
            variant="outline"
            className="flex-1 h-9 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 hover:text-emerald-700 border-emerald-200"
          >
            <Settings className="h-4 w-4 mr-2" /> Manage
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
