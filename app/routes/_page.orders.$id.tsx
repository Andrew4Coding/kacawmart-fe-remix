"use client"

import { LoaderFunctionArgs, ActionFunctionArgs, json } from "@remix-run/node"
import { useLoaderData, useParams } from "@remix-run/react"
import fetchServer from "~/lib/fetch"
import OrderDetailModule from "~/modules/OrderModule/detail"

export async function loader(args: LoaderFunctionArgs) {
  const orderId = args.params.id

  if (!orderId) {
    throw new Error("Product ID is required")
  }

  // Fetch product details
  const orderData = await fetchServer(args.request, `/api/seller/order/${orderId}`)

  return {
    order: orderData.order,
  }
}

export async function action(args: ActionFunctionArgs) {
  const orderId = args.params.id
  
  if (!orderId) {
    return json({ error: "Order ID is required" }, { status: 400 })
  }

  try {
    console.log("Updating delivery status for order:", orderId);
    
    // Call your backend API to update the delivery status
    const result = await fetchServer(args.request, `/api/seller/orders/${orderId}/confirm`, {
      method: "PATCH",
    })
    
    console.log("Update result:", result);
    return json({ success: true, updated: result?.updated })
  } catch (error: any) {
    console.error("Error updating delivery status:", error)
    return json({ error: error.message || "Failed to update delivery status" }, { status: 400 })
  }
}

export default function ProductPage() {
  const data = useLoaderData<typeof loader>()

  return (
    <OrderDetailModule
      order={data.order}
    />
  )
}