"use client"

import { LoaderFunctionArgs } from "@remix-run/node"
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

export default function ProductPage() {
  const data = useLoaderData<typeof loader>()

  return (
    <OrderDetailModule
      order={data.order}
    />
  )
}

