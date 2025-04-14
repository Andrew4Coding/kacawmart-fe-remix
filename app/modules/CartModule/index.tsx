import { Link, useLoaderData } from "@remix-run/react"
import { AlertCircle, MinusCircle, PlusCircle, ShoppingCart, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Alert, AlertDescription } from "~/components/ui/alert"
import { Badge } from "~/components/ui/badge"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardFooter } from "~/components/ui/card"
import Image from "~/components/ui/image"
import { Separator } from "~/components/ui/separator"
import { CartProduct } from "./types"

// Format price to IDR
const formatPrice = (price: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

export default function CartModule() {
  const [cartItems, setCartItems] = useState<CartProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)

  const loaderData: CartProduct[] = useLoaderData();

  useEffect(() => {
    if (loaderData) {
      setCartItems(loaderData)
    } else {
      setError("Failed to load cart items.")
    }
    setLoading(false)
  }, [loaderData])

  const updateQuantity = async (productQuantityId: string, quantity: number) => {
    if (quantity < 1) return

    try {
      setIsUpdating(true)
      const response = await fetch(`/api/cart/item/${productQuantityId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quantity }),
      })

      if (!response.ok) {
        throw new Error("Failed to update quantity")
      }

      const updatedItem = await response.json()

      // Update the cart items with the updated item
      setCartItems((prevItems) => prevItems.map((item) => (item.id === updatedItem.id ? updatedItem : item)))

      toast.success("Your cart has been updated successfully.")
    } catch (err) {
      toast.error("Failed to update quantity. Please try again.")
      console.error("Error updating quantity:", err)
    } finally {
      setIsUpdating(false)
    }
  }

  const removeItem = async (productQuantityId: string) => {
    try {
      setIsUpdating(true)
      const response = await fetch(`/api/cart/item/${productQuantityId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to remove item")
      }

      await response.json()

      // Remove the item from the cart
      setCartItems((prevItems) => prevItems.filter((item) => item.id !== productQuantityId))

      toast.success("The item has been removed from your cart.")
    } catch (err) {
      toast.error("Failed to remove item. Please try again.")
      console.error("Error removing item:", err)
    } finally {
      setIsUpdating(false)
    }
  }

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + item.product.price * item.amount, 0)
  }

  // Check if cart is empty
  const isCartEmpty = cartItems.length === 0 && !loading

  return (
    <main className="w-full font-sans">
      {/* Header Section */}
      <section className="relative bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 pt-16 pb-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="space-y-6 max-w-4xl mx-auto text-center animate-fadeIn">
            <Badge className="px-3 py-1 bg-emerald-100 text-emerald-800 hover:bg-emerald-200 transition-colors">
              Shopping Cart
            </Badge>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 font-serif">
              Your <span className="text-emerald-600">Shopping Cart</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Review and manage the items in your cart before proceeding to checkout.
            </p>
          </div>
        </div>
      </section>

      {/* Cart Content Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
              <p className="ml-4 text-lg text-gray-600">Loading your cart...</p>
            </div>
          ) : isCartEmpty ? (
            <div className="text-center py-16 bg-white rounded-lg shadow-sm">
              <ShoppingCart className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
              <p className="text-gray-500 mb-6">Looks like you haven't added any products to your cart yet.</p>
              <Link to="/explore">
                <Button className="bg-emerald-600 hover:bg-emerald-700">Continue Shopping</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Cart Items ({cartItems.length})</h2>

                {cartItems.map((item) => (
                  <Card key={item.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex flex-col sm:flex-row">
                        <div className="w-full sm:w-32 h-full bg-gray-100">
                          <Image
                            src={item.product.imageUrl || "/placeholder.svg?height=128&width=128"}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 p-4 flex flex-col">
                          <div className="flex justify-between">
                            <h3 className="font-medium text-gray-900 line-clamp-2">{item.product.name}</h3>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                              onClick={() => removeItem(item.id)}
                              disabled={isUpdating}
                            >
                              <Trash2 className="h-5 w-5" />
                              <span className="sr-only">Remove item</span>
                            </Button>
                          </div>
                          <div className="text-sm text-gray-500 mt-1">Stock: {item.product.stock} available</div>
                          <div className="mt-auto pt-4 flex justify-between items-center">
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => updateQuantity(item.id, item.amount - 1)}
                                disabled={item.amount <= 1 || isUpdating}
                              >
                                <MinusCircle className="h-4 w-4" />
                                <span className="sr-only">Decrease quantity</span>
                              </Button>
                              <span className="w-8 text-center">{item.amount}</span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => updateQuantity(item.id, item.amount + 1)}
                                disabled={item.amount >= item.product.stock || isUpdating}
                              >
                                <PlusCircle className="h-4 w-4" />
                                <span className="sr-only">Increase quantity</span>
                              </Button>
                            </div>
                            <div className="text-lg font-bold text-emerald-600">{formatPrice(item.product.price)}</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-medium">{formatPrice(calculateSubtotal())}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Shipping</span>
                        <span className="font-medium">Calculated at checkout</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tax</span>
                        <span className="font-medium">Calculated at checkout</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between text-lg font-bold">
                        <span>Estimated Total</span>
                        <span className="text-emerald-600">{formatPrice(calculateSubtotal())}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-6 flex gap-4 items-center">
                    <Link to="/checkout" className="w-full">
                      <Button className="w-full bg-emerald-600 hover:bg-emerald-700">Proceed to Checkout</Button>
                    </Link>
                    <Link to="/explore" className="w-full">
                      <Button
                        variant="outline"
                        className="w-full border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                      >
                        Continue Shopping
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
