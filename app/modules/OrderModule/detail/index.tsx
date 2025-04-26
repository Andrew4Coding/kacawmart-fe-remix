import { Link, useFetcher } from "@remix-run/react";
import { ArrowLeft, Truck, Package, Calendar, CreditCard } from "lucide-react";
import { useState, useEffect } from "react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { toast } from "~/components/ui/use-toast";
import { formatCurrency, formatDatee, formatPrice } from "~/lib/utils";

interface OrderProduct {
  id: string;
  amount: number;
  price: number;
  productId: string;
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    ratingCount: number;
    productRating: number;
    stock: number;
  } | null;
}

interface Order {
  id: string;
  deliveryStatus: string;
  totalPrice: number;
  totalProduct: number;
  transactionId: string;
  discountId: string | null;
  createdAt: string;
  updatedAt: string;
  product: OrderProduct[] | null;
}

interface OrderDetailProps {
  order: Order;
}

export default function OrderDetailModule({ order }: OrderDetailProps) {
  const fetcher = useFetcher();
  const [isUpdating, setIsUpdating] = useState(false);

  // Get status color based on delivery status
  const getStatusColor = (status: string) => {
    switch (status) {
      case "DELIVERED":
        return "bg-emerald-100 text-emerald-800";
      case "PENDING":
        return "bg-amber-100 text-amber-800";
      case "SHIPPED":
        return "bg-blue-100 text-blue-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      case "ON_DELIVERY":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Handle update delivery status
  const handleUpdateDeliveryStatus = () => {
    console.log("Updating delivery status for order:", order.id);
    setIsUpdating(true);

    fetcher.submit(
      {},
      { method: "patch", action: `/api/seller/orders/${order.id}/confirm` },
    );
  };

  // Get button text based on current status
  const getButtonText = () => {
    if (isUpdating) return "Updating...";

    switch (order.deliveryStatus) {
      case "PENDING":
        return "Mark as On Delivery";
      case "ON_DELIVERY":
        return "Mark as Delivered";
      case "DELIVERED":
        return "Already Delivered";
      default:
        return "Update Status";
    }
  };

  // Define TypeScript interface for fetcher data
  interface FetcherData {
    error?: string;
    success?: boolean;
    updated?: any;
  }

  // Listen for completion of the fetch request
  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      setIsUpdating(false);

      // Type cast the data to our interface
      const responseData = fetcher.data as FetcherData;

      if (responseData.error) {
        toast({
          title: "Error",
          description: responseData.error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Order status updated successfully",
        });

        // Reload the page to show updated data
        window.location.reload();
      }
    }
  }, [fetcher.state, fetcher.data]);

  return (
    <div className="min-h-screen bg-[#f0faf5] p-20 pt-40">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Order Details</h1>
          <div className="text-gray-600">
            <Link to="/" className="hover:underline">
              Home
            </Link>{" "}
            {" > "}
            <Link to="/orders" className="hover:underline">
              All Orders
            </Link>{" "}
            {" > "}
            <span>Order #{order.id}</span>
          </div>
        </div>

        <div className="bg-white p-8 rounded-lg shadow mb-8">
          <div className="flex flex-col md:flex-row justify-between mb-6 pb-6 border-b">
            <div>
              <h2 className="text-xl font-semibold mb-2">Order #{order.id}</h2>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>Placed on {formatDatee(new Date(order.createdAt))}</span>
              </div>
            </div>
            <div className="mt-4 md:mt-0 flex items-center">
              <Badge
                className={`${getStatusColor(order.deliveryStatus)} text-sm px-3 py-1`}
              >
                {order.deliveryStatus}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h3 className="text-lg font-semibold mb-4">Order Items</h3>
              <div className="space-y-6">
                {order.product &&
                  order.product.map((item) => (
                    <div key={item.id} className="flex gap-4 border-b pb-4">
                      <div className="w-20 h-20 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                        <img
                          src={
                            item.product?.imageUrl ||
                            "/placeholder.svg?height=80&width=80"
                          }
                          alt={item.product?.name || "Product image"}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-grow">
                        <h4 className="font-medium">
                          {item.product?.name || "Product name unavailable"}
                        </h4>
                        <div className="flex justify-between mt-2">
                          <div className="text-sm text-gray-600">
                            Quantity: {item.amount}
                          </div>
                          <div className="font-medium">
                            {formatPrice(item.product.price)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                {(!order.product || order.product.length === 0) && (
                  <div className="text-center py-8 text-gray-500">
                    No items found in this order
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Order Summary</h3>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Transaction ID</span>
                    <span className="font-medium">
                      {order.transactionId.substring(0, 8)}...
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Items</span>
                    <span className="font-medium">{order.totalProduct}</span>
                  </div>

                  {order.discountId && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Discount Applied</span>
                      <span className="font-medium text-emerald-600">Yes</span>
                    </div>
                  )}

                  <div className="pt-3 mt-3 border-t border-gray-200">
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span>{formatCurrency(order.totalPrice)}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Truck className="h-4 w-4" />
                    <span>
                      Delivery Status:{" "}
                      <span className="font-medium">
                        {order.deliveryStatus}
                      </span>
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Package className="h-4 w-4" />
                    <span>
                      Total Products:{" "}
                      <span className="font-medium">{order.totalProduct}</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CreditCard className="h-4 w-4" />
                    <span>
                      Payment: <span className="font-medium">Completed</span>
                    </span>
                  </div>
                </div>

                {/* Remove the Update Delivery Status Button we added before */}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <Button
            variant="outline"
            className="border-emerald-500 text-emerald-500 hover:bg-emerald-50"
            onClick={handleUpdateDeliveryStatus}
            disabled={isUpdating || order.deliveryStatus === "DELIVERED"}
          >
            {isUpdating
              ? "Updating..."
              : order.deliveryStatus === "DELIVERED"
                ? "Order Delivered"
                : order.deliveryStatus === "PENDING"
                  ? "Mark as On Delivery"
                  : "Mark as Delivered"}
          </Button>
          <Link to="/orders">
            <Button className="bg-emerald-500 hover:bg-emerald-600">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Orders
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
