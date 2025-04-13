import { formatDatee, formatPrice } from "~/lib/utils"
import { Badge } from "~/components/ui/badge"
import { Link } from "@remix-run/react"

interface OrderCardProps {
  order: {
    id: string
    deliveryStatus: string
    totalPrice: number
    totalProduct: number
    createdAt: string
    product: Array<{
      amount: number
      product: {
        name: string
      } | null
    }> | null
  }
}

export default function OrderCard({ order }: OrderCardProps) {
  // Get status color based on delivery status
  const getStatusColor = (status: string) => {
    switch (status) {
      case "DELIVERED":
        return "bg-emerald-100 text-emerald-800"
      case "PENDING":
        return "bg-amber-100 text-amber-800"
      case "SHIPPED":
        return "bg-blue-100 text-blue-800"
      case "CANCELLED":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // // Format price to currency
  // const formatPrice = (price: number) => {
  //   return new Intl.NumberFormat("en-IN", {
  //     style: "currency",
  //     currency: "INR",
  //     minimumFractionDigits: 0,
  //   }).format(price / 100)
  // }

  return (
    <Link to={`/orders/${order.id}`} className="block">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:border-emerald-200 transition-all hover:shadow-md">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-semibold text-gray-800 mb-1">Order #{order.id.substring(0, 8)}...</h3>
            <p className="text-sm text-gray-500">{formatDatee(new Date(order.createdAt))}</p>
          </div>
          <Badge className={`${getStatusColor(order.deliveryStatus)}`}>{order.deliveryStatus}</Badge>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Products:</span>
            <span className="font-medium">{order.totalProduct}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Total Amount:</span>
            <span className="font-medium">{formatPrice(order.totalPrice)}</span>
          </div>

          {order.product && order.product.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500 mb-2">Items:</p>
              <ul className="text-sm text-gray-700 space-y-1">
                {order.product.slice(0, 2).map((item, index) => (
                  <li key={index} className="truncate">
                    {item.amount}x{" "}
                    {item.product?.name ? item.product.name.substring(0, 30) + "..." : "Product name unavailable"}
                  </li>
                ))}
                {order.product.length > 2 && (
                  <li className="text-emerald-600 text-xs">+{order.product.length - 2} more items</li>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
