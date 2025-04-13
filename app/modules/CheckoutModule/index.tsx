import { useState, useEffect } from "react"
import { CreditCard, ShieldCheck, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardFooter } from "~/components/ui/card"
import { Badge } from "~/components/ui/badge"
import { Separator } from "~/components/ui/separator"
import { Alert, AlertDescription } from "~/components/ui/alert"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { toast } from "sonner"
import { Link } from "@remix-run/react"

interface Product {
  id: string
  name: string
  price: number
  imageUrl: string
  stock: number
}

interface CartProduct {
  id: string
  amount: number
  price: number
  productId: string
  product: Product
}

interface CheckoutData {
  products: CartProduct[]
  subtotal: number
  adminFee: number
  shippingFee: number
  total: number
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

export default function CheckoutModule() {
  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)
  const [discountCode, setDiscountCode] = useState("")

  useEffect(() => {
    fetchCheckoutData()
  }, [])

  const fetchCheckoutData = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/cart/checkout")

      if (!response.ok) {
        throw new Error("Failed to fetch checkout data")
      }

      const data: CheckoutData = await response.json()
      setCheckoutData(data)
    } catch (err) {
      setError("Failed to load checkout data. Please try again later.")
      console.error("Error fetching checkout data:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleApplyDiscount = () => {
    if (!discountCode.trim()) {
      toast.error("Please enter a discount code")
      return
    }

    toast.success("Your discount code will be applied when you place your order.")
  }

  const handleSubmitOrder = async () => {
    try {
      setIsProcessing(true)

      const response = await fetch("/api/cart/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          discountCode: discountCode.trim() || undefined,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to process order")
      }

      await response.json()

      // Show success state
      setOrderComplete(true)

      toast.success("Order placed successfully")
    } catch (err) {
      toast.error("Failed to process your order. Please try again.")
      console.error("Error processing order:", err)
    } finally {
      setIsProcessing(false)
    }
  }

  // Check if cart is empty
  const isCartEmpty = checkoutData?.products.length === 0 && !loading

  if (orderComplete) {
    return (
      <main className="w-full font-sans">
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 md:px-6 max-w-3xl">
            <Card className="overflow-hidden">
              <CardContent className="p-8 text-center">
                <CheckCircle className="h-16 w-16 mx-auto text-emerald-600 mb-4" />
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
                <p className="text-lg text-gray-600 mb-6">
                  Thank you for your purchase. Your order has been received and is being processed.
                </p>
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <p className="text-sm text-gray-500">
                    A confirmation email has been sent to your email address with the order details.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/transaction">
                    <Button variant="outline" className="border-emerald-600 text-emerald-600 hover:bg-emerald-50">
                      View Order
                    </Button>
                  </Link>
                  <Link to="/explore">
                    <Button className="bg-emerald-600 hover:bg-emerald-700">Continue Shopping</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="w-full font-sans">
      {/* Header Section */}
      <section className="relative bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 pt-16 pb-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="space-y-6 max-w-4xl mx-auto text-center animate-fadeIn">
            <Badge className="px-3 py-1 bg-emerald-100 text-emerald-800 hover:bg-emerald-200 transition-colors">
              Checkout
            </Badge>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 font-serif">
              Complete Your <span className="text-emerald-600">Purchase</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Review your order and enter your details to complete your purchase.
            </p>
          </div>
        </div>
      </section>

      {/* Checkout Content Section */}
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
              <p className="ml-4 text-lg text-gray-600">Loading checkout information...</p>
            </div>
          ) : isCartEmpty ? (
            <div className="text-center py-16 bg-white rounded-lg shadow-sm">
              <AlertCircle className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
              <p className="text-gray-500 mb-6">You need to add products to your cart before checkout.</p>
              <Link to="/cart">
                <Button className="bg-emerald-600 hover:bg-emerald-700">Return to Cart</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Checkout Form */}
              <div className="lg:col-span-2 space-y-6">
                {/* Payment Information */}
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                      <CreditCard className="h-5 w-5 mr-2 text-emerald-600" />
                      Payment Information
                    </h2>
                    <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-100 flex items-center">
                      <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center mr-4">
                        <CreditCard className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">E-Wallet Payment</h3>
                        <p className="text-sm text-gray-500">You'll pay using your e-wallet</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Order Items */}
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">
                      Order Items ({checkoutData?.products.length})
                    </h2>
                    <div className="space-y-4">
                      {checkoutData?.products.map((item) => (
                        <div key={item.id} className="flex items-center space-x-4">
                          <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                            <img
                              src={item.product.imageUrl || "/placeholder.svg?height=64&width=64"}
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-medium text-gray-900 truncate">{item.product.name}</h3>
                            <p className="text-sm text-gray-500">Qty: {item.amount}</p>
                          </div>
                          <div className="text-sm font-medium text-gray-900">
                            {formatPrice(item.product.price * item.amount)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="sticky top-6">
                  <Card>
                    <CardContent className="p-6">
                      <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Subtotal</span>
                          <span className="font-medium">{formatPrice(checkoutData?.subtotal || 0)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Shipping Fee</span>
                          <span className="font-medium">{formatPrice(checkoutData?.shippingFee || 0)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Admin Fee</span>
                          <span className="font-medium">{formatPrice(checkoutData?.adminFee || 0)}</span>
                        </div>

                        {/* Discount Code */}
                        <div className="pt-2">
                          <Label htmlFor="discountCode" className="text-sm">
                            Discount Code
                          </Label>
                          <div className="flex mt-1">
                            <Input
                              id="discountCode"
                              value={discountCode}
                              onChange={(e) => setDiscountCode(e.target.value)}
                              className="rounded-r-none"
                            />
                            <Button
                              onClick={handleApplyDiscount}
                              className="rounded-l-none bg-emerald-600 hover:bg-emerald-700"
                            >
                              Apply
                            </Button>
                          </div>
                        </div>

                        <Separator />
                        <div className="flex justify-between text-lg font-bold">
                          <span>Total</span>
                          <span className="text-emerald-600">{formatPrice(checkoutData?.total || 0)}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="p-6 pt-0 flex flex-col space-y-4">
                      <Button
                        className="w-full bg-emerald-600 hover:bg-emerald-700"
                        onClick={handleSubmitOrder}
                        disabled={isProcessing}
                      >
                        {isProcessing ? "Processing..." : "Place Order"}
                      </Button>
                      <Link to="/cart" className="w-full">
                        <Button
                          variant="outline"
                          className="w-full border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                        >
                          Return to Cart
                        </Button>
                      </Link>
                      <div className="flex items-center justify-center text-sm text-gray-500 mt-4">
                        <ShieldCheck className="h-4 w-4 mr-2 text-emerald-600" />
                        Secure checkout
                      </div>
                    </CardFooter>
                  </Card>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
