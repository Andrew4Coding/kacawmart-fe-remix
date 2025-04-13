import { type ActionFunctionArgs, json, redirect, type LoaderFunctionArgs } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import ProductEditModule from "~/modules/ProductModule/edit"
import { parse } from "cookie"
import fetchServer from "~/lib/fetch"
import { productSchema } from "~/modules/ProductModule/type"

export async function loader({ request, params }: LoaderFunctionArgs) {
  try {
    const productId = params.id

    if (!productId) {
      throw new Error("Product ID is required")
    }

    // Fetch the product data
    const productResponse = await fetchServer(request, `/api/product/details/${productId}`)

    // Fetch the categories data
    const categoriesResponse = await fetchServer(request, "/api/product/categories")

    return json({
      product: productResponse.product,
      categories: categoriesResponse?.categories || [],
    })
  } catch (error) {
    console.error("Error fetching data:", error)
    return json({
      product: null,
      categories: [],
      error: String(error),
    })
  }
}

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const productId = params.id

  if (!productId) {
    throw new Error("Product ID is required")
  }

  const cookieHeader = request.headers.get("Cookie")
  const cookies = parse(cookieHeader || "")
  const token = cookies["x-user-token"]

  // Parse the JSON data from the request
  const data = await request.json()

  // Validate the data against our schema
  const result = productSchema.safeParse(data)

  if (!result.success) {
    return json({ errors: result.error.flatten() }, { status: 400 })
  }

  // Update the product
  const response = await fetchServer(request, `/api/product/update/${productId}`, {
    method: "PUT",
    body: JSON.stringify(result.data),
    headers: {
      "Content-Type": "application/json",
    },
  })

  return redirect("/products")
}

export default function ProductEditPage() {
  const data = useLoaderData<typeof loader>()

  if (!data.product) {
    return <div className="p-20 pt-40 text-center">Product not found</div>
  }

  return <ProductEditModule product={data.product} categories={data.categories} />
}
