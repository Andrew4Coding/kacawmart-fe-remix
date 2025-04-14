import { useState, useEffect } from "react"
import { Trash2, ShoppingCart, AlertCircle, Heart, MoveRight } from "lucide-react"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardFooter } from "~/components/ui/card"
import { Badge } from "~/components/ui/badge"
import { Separator } from "~/components/ui/separator"
import { Alert, AlertDescription } from "~/components/ui/alert"
import { toast } from "sonner"
import { Link, useLoaderData } from "@remix-run/react"

interface Product {
  id: string
  name: string
  price: number
  imageUrl: string
  stock: number
}

interface WishlistResponse {
  id: string
  customerId: string
  productCount: number
  products: Product[]
}

// Format price to IDR
const formatPrice = (price: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

export default function WishlistModule() {
  const [wishlistItems, setWishlistItems] = useState<Product[]>([])
  const [error] = useState<string | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const [wishlistId, setWishlistId] = useState<string | null>(null)

  const loaderData: WishlistResponse = useLoaderData();

  useEffect(() => {
    if (loaderData) {
      setWishlistId(loaderData.id)
      setWishlistItems(loaderData.products)
    }
  }, [loaderData])

  const removeFromWishlist = async (productId: string) => {
    if (!wishlistId) return

    try {
      setIsUpdating(true)
      const response = await fetch(`/api/wishlist/${wishlistId}/remove`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId }),
      })

      if (!response.ok) {
        throw new Error("Failed to remove from wishlist")
      }

      await response.json()

      // Remove the item from the wishlist
      setWishlistItems((prevItems) => prevItems.filter((item) => item.id !== productId))

      toast.success("The item has been removed from your wishlist.")
    } catch (err) {
      toast.error("Failed to remove item. Please try again.")
      console.error("Error removing item:", err)
    } finally {
      setIsUpdating(false)
    }
  }

  const moveToCart = async (productId: string) => {
    if (!wishlistId) return

    try {
      setIsUpdating(true)

      // First, get cart ID
      const cartResponse = await fetch(`/api/wishlist/${wishlistId}/move-to-cart`, {
        method: "POST",
      })
      if (!cartResponse.ok) {
        throw new Error("Failed to fetch cart information")
      }

      const cartData = await cartResponse.json()
      const cartId = cartData.id

      if (!cartId) {
        throw new Error("Cart not found")
      }

      // Move item from wishlist to cart
      const response = await fetch(`/api/wishlist/${wishlistId}/move-to-cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId, cartId }),
      })

      if (!response.ok) {
        throw new Error("Failed to move item to cart")
      }

      await response.json()

      // Remove the item from the wishlist UI
      setWishlistItems((prevItems) => prevItems.filter((item) => item.id !== productId))

      toast.success("Item moved to your cart successfully!")
    } catch (err) {
      toast.error("Failed to move item to cart. Please try again.")
      console.error("Error moving item to cart:", err)
    } finally {
      setIsUpdating(false)
    }
  }

  const clearWishlist = async () => {
    if (!wishlistId || wishlistItems.length === 0) return

    try {
      setIsUpdating(true)
      const response = await fetch(`/api/wishlist/${wishlistId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to clear wishlist")
      }

      await response.json()

      // Clear all items from the wishlist
      setWishlistItems([])

      toast.success("Your wishlist has been cleared.")
    } catch (err) {
      toast.error("Failed to clear wishlist. Please try again.")
      console.error("Error clearing wishlist:", err)
    } finally {
      setIsUpdating(false)
    }
  }

  // Check if wishlist is empty
  const isWishlistEmpty = wishlistItems.length === 0

  return (
    <main className="w-full font-sans">
      {/* Header Section */}
      <section className="relative bg-gradient-to-r from-purple-50 via-pink-50 to-rose-50 pt-16 pb-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="space-y-6 max-w-4xl mx-auto text-center animate-fadeIn">
            <Badge className="px-3 py-1 bg-pink-100 text-pink-800 hover:bg-pink-200 transition-colors">
              Wishlist
            </Badge>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 font-serif">
              Your <span className="text-pink-600">Wishlist</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Items you've saved for later. Add them to your cart or remove them anytime.
            </p>
          </div>
        </div>
      </section>

      {/* Wishlist Content Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {isWishlistEmpty ? (
            <div className="text-center py-16 bg-white rounded-lg shadow-sm">
              <Heart className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
              <p className="text-gray-500 mb-6">Looks like you haven't added any products to your wishlist yet.</p>
              <Link to="/explore">
                <Button className="bg-pink-600 hover:bg-pink-700">Explore Products</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Saved Items ({wishlistItems.length})</h2>
                {wishlistItems.length > 0 && (
                  <Button
                    variant="outline"
                    className="text-red-500 border-red-200 hover:bg-red-50"
                    onClick={clearWishlist}
                    disabled={isUpdating}
                  >
                    Clear Wishlist
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlistItems.map((item) => (
                  <Card key={item.id} className="overflow-hidden"
                    onClick={() => {
                      window.location.href = `/explore/product/${item.id}`
                    }}
                  >
                    <div className="h-48 bg-gray-100">
                      <img
                        src={item.imageUrl || "/placeholder.svg?height=192&width=384"}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-medium text-gray-900 line-clamp-2 h-12">{item.name}</h3>
                      <div className="text-sm text-gray-500 mt-1">Stock: {item.stock} available</div>
                      <div className="mt-2 text-lg font-bold text-pink-600">{formatPrice(item.price)}</div>
                    </CardContent>
                    <CardFooter className="p-4 pt-0 flex flex-col space-y-2">
                      <Button
                        variant="outline"
                        className="w-full border-gray-300 text-gray-600 hover:bg-gray-50"
                        onClick={() => removeFromWishlist(item.id)}
                        disabled={isUpdating}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {!isWishlistEmpty && (
            <div className="mt-12 text-center">
              <Separator className="mb-8" />
              <Link to="/explore">
                <Button className="bg-gray-800 hover:bg-gray-900">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}