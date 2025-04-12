import { useState, useEffect } from "react"
import { useParams, useNavigate } from "@remix-run/react"
import { ArrowLeft, ShoppingBag, Heart, Star, Truck, Shield, Minus, Plus, Check, AlertCircle } from "lucide-react"
import { Button } from "~/components/ui/button"
import { Badge } from "~/components/ui/badge"
import { Separator } from "~/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert"
import { Link } from "@remix-run/react"

// Types based on the API response
interface Category {
  id: string
  name: string
  productCount: number
}

interface Seller {
  id: string
  bankName: string
  bankNumber: string
  shopRating: number
  selledProduct: number
  userId: string
  createdAt: string
  updatedAt: string
}

interface Review {
  id: string
  rating: number
  comment: string
  // Add other review fields as needed
}

interface Product {
  id: string
  name: string
  description: string
  price: number
  imageUrl: string
  ratingCount: number
  productRating: number
  stock: number
  category: Category[]
  Seller: Seller[]
  Review?: Review[]
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

export default function ProductDetailPage() {
  const params = useParams()
  const navigate = useNavigate()
  const productId = params.id as string

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false)
  const [showCartDialog, setShowCartDialog] = useState(false)
  const [showQuantityDialog, setShowQuantityDialog] = useState(false)
  const [notification, setNotification] = useState<{
    type: "success" | "error"
    message: string
  } | null>(null)

  useEffect(() => {
    if (productId) {
      fetchProductDetails()
    }
  }, [productId])

  const fetchProductDetails = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/explore/product/${productId}`)

      if (!response.ok) {
        throw new Error("Failed to fetch product details")
      }

      const data: Product = await response.json()
      setProduct(data)
      setError(null)
    } catch (err) {
      setError("Failed to load product details. Please try again later.")
      console.error("Error fetching product details:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleQuantityChange = (value: number) => {
    // Ensure quantity is always a positive integer
    const newQuantity = Math.max(1, value)
    setQuantity(newQuantity)
  }

  const addToWishlist = async () => {
    try {
      setIsAddingToWishlist(true)
      const response = await fetch("/api/explore/wishlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: productId,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to add to wishlist")
      }

      setNotification({
        type: "success",
        message: "Product added to wishlist successfully!",
      })

      // Clear notification after 3 seconds
      setTimeout(() => {
        setNotification(null)
      }, 3000)
    } catch (err: any) {
      setNotification({
        type: "error",
        message: err.message || "Failed to add to wishlist. Please try again.",
      })

      // Clear notification after 3 seconds
      setTimeout(() => {
        setNotification(null)
      }, 3000)
    } finally {
      setIsAddingToWishlist(false)
    }
  }

  const addToCart = async () => {
    try {
      setIsAddingToCart(true)
      const response = await fetch("/api/explore/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: productId,
          quantity: quantity,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to add to cart")
      }

      setShowCartDialog(true)
    } catch (err: any) {
      setNotification({
        type: "error",
        message: err.message || "Failed to add to cart. Please try again.",
      })

      // Clear notification after 3 seconds
      setTimeout(() => {
        setNotification(null)
      }, 3000)
    } finally {
      setIsAddingToCart(false)
      setShowQuantityDialog(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        <p className="ml-4 text-lg text-gray-600">Loading product details...</p>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-sm">
          <div className="text-center py-12">
            <div className="text-red-500 mb-4 text-lg">{error || "Product not found"}</div>
            <Button onClick={() => navigate(`/api/explore/product/${productId}/explore`)} className="bg-emerald-600 hover:bg-emerald-700">
              Back to Explore
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Format description by splitting on pipe character
  const descriptionPoints = product.description.split("|").filter(Boolean)

  return (
    <main className="w-full font-sans bg-gray-50 pb-16">
      {/* Notification */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 max-w-md">
          <Alert variant={notification.type === "success" ? "default" : "destructive"}>
            {notification.type === "success" ? <Check className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
            <AlertTitle>{notification.type === "success" ? "Success" : "Error"}</AlertTitle>
            <AlertDescription>{notification.message}</AlertDescription>
          </Alert>
        </div>
      )}

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center text-sm text-gray-500">
            <Link to="/explore" className="hover:text-emerald-600 flex items-center">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Explore
            </Link>
            <span className="mx-2">/</span>
            {product.category.length > 0 && (
              <>
                <Link to={`/explore?category=${product.category[0].id}`} className="hover:text-emerald-600">
                  {product.category[0].name}
                </Link>
                <span className="mx-2">/</span>
              </>
            )}
            <span className="text-gray-700 truncate max-w-[200px]">{product.name.replace(/!!/g, "")}</span>
          </div>
        </div>
      </div>

      {/* Product Details */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-8">
            {/* Product Image */}
            <div className="relative">
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={product.imageUrl || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-contain"
                />
              </div>
              {product.stock < 100 && (
                <Badge className="absolute top-4 left-4 bg-amber-500 text-white hover:bg-amber-600">
                  Low Stock: Only {product.stock} left
                </Badge>
              )}
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              <div className="mb-4">
                {product.category.length > 0 && (
                  <Badge variant="outline" className="mb-2 text-xs border-gray-200 text-gray-600">
                    {product.category[0].name}
                  </Badge>
                )}
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{product.name.replace(/!!/g, "")}</h1>
                <div className="flex items-center mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(product.productRating)
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300 fill-gray-300"
                        }`}
                      />
                    ))}
                    <span className="text-sm font-medium ml-2">{product.productRating}</span>
                  </div>
                  <span className="text-sm text-gray-500 ml-2">({product.ratingCount} reviews)</span>
                </div>
                <div className="text-3xl font-bold text-emerald-600 mb-4">{formatPrice(product.price)}</div>
                <Separator className="my-4" />
                <div className="space-y-4 mb-6">
                  <div className="flex items-center">
                    <Truck className="h-5 w-5 text-emerald-600 mr-2" />
                    <span className="text-sm text-gray-700">Free shipping on orders over {formatPrice(500000)}</span>
                  </div>
                  <div className="flex items-center">
                    <Shield className="h-5 w-5 text-emerald-600 mr-2" />
                    <span className="text-sm text-gray-700">1 year warranty</span>
                  </div>
                  <div className="flex items-center">
                    <ShoppingBag className="h-5 w-5 text-emerald-600 mr-2" />
                    <span className="text-sm text-gray-700">In stock: {product.stock} units</span>
                  </div>
                </div>
                <Separator className="my-4" />
              </div>

              {/* Action Buttons */}
              <div className="mt-auto space-y-4">
                <Button
                  onClick={() => setShowQuantityDialog(true)}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 py-6 text-lg"
                  disabled={isAddingToCart}
                >
                  {isAddingToCart ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Adding to Cart...
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="mr-2 h-5 w-5" /> Add to Cart
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={addToWishlist}
                  className="w-full border-emerald-600 text-emerald-600 hover:bg-emerald-50 py-6 text-lg"
                  disabled={isAddingToWishlist}
                >
                  {isAddingToWishlist ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-emerald-600 mr-2"></div>
                      Adding to Wishlist...
                    </>
                  ) : (
                    <>
                      <Heart className="mr-2 h-5 w-5" /> Add to Wishlist
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Product Details Tabs */}
          <div className="border-t">
            <Tabs defaultValue="description" className="p-6 md:p-8">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="specifications">Specifications</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>
              <TabsContent value="description" className="space-y-4">
                <h3 className="text-lg font-semibold mb-2">Product Description</h3>
                <div className="text-gray-700 space-y-2">
                  {descriptionPoints.map((point, index) => (
                    <p key={index} className="flex items-start">
                      <span className="text-emerald-600 mr-2">•</span>
                      {point.trim()}
                    </p>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="specifications" className="space-y-4">
                <h3 className="text-lg font-semibold mb-2">Product Specifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm font-medium text-gray-500">Brand</p>
                    <p className="text-gray-900">{product.name.split("!!")[0] || "Generic"}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm font-medium text-gray-500">Category</p>
                    <p className="text-gray-900">{product.category[0]?.name || "Uncategorized"}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm font-medium text-gray-500">Stock</p>
                    <p className="text-gray-900">{product.stock} units</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm font-medium text-gray-500">Rating</p>
                    <p className="text-gray-900">{product.productRating} out of 5</p>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="reviews" className="space-y-4">
                <h3 className="text-lg font-semibold mb-2">Customer Reviews</h3>
                {product.Review && product.Review.length > 0 ? (
                  <div className="space-y-4">
                    {product.Review.map((review) => (
                      <div key={review.id} className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center mb-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="ml-2 text-sm text-gray-500">Verified Purchase</span>
                        </div>
                        <p className="text-gray-700">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No reviews yet. Be the first to review this product!</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Quantity Dialog */}
      <Dialog open={showQuantityDialog} onOpenChange={setShowQuantityDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Select Quantity</DialogTitle>
            <DialogDescription>How many units of this product would you like to add to your cart?</DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center my-6">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={quantity <= 1}
              className="h-10 w-10"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <div className="mx-6 text-center">
              <span className="text-3xl font-bold">{quantity}</span>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleQuantityChange(quantity + 1)}
              disabled={quantity >= product.stock}
              className="h-10 w-10"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-center text-sm text-gray-500">{product.stock} units available</p>
          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setShowQuantityDialog(false)} className="sm:mr-2">
              Cancel
            </Button>
            <Button onClick={addToCart} className="bg-emerald-600 hover:bg-emerald-700">
              Add to Cart
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={showCartDialog} onOpenChange={setShowCartDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Added to Cart!</DialogTitle>
            <DialogDescription>
              {quantity} {quantity > 1 ? "units" : "unit"} of this product has been added to your cart.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center my-6">
            <div className="bg-emerald-100 rounded-full p-3">
              <Check className="h-8 w-8 text-emerald-600" />
            </div>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setShowCartDialog(false)} className="sm:mr-2">
              Continue Shopping
            </Button>
            <Button onClick={() => navigate(`/api/explore/product/${productId}/cart`)} className="bg-emerald-600 hover:bg-emerald-700">
              View Cart
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  )
}
