import { type ActionFunctionArgs, json, redirect, type LoaderFunctionArgs } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import ProductCreateModule from "~/modules/ProductModule/create"
import { parse } from "cookie"
import fetchServer from "~/lib/fetch"

// Fix the import path to point to the correct location
import { productSchema } from "~/modules/ProductModule/type"

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    // Fetch the categories data
    const response = await fetchServer(request, "/api/product/categories")

    // Log the response for debugging
    console.log("Categories API Response:", response)

    // Return the categories data
    return json({
      categories: response?.categories || [],
      // Include the raw response for debugging
      _debug: {
        rawResponse: response,
      },
    })
  } catch (error) {
    console.error("Error fetching categories:", error)
    return json({
      categories: [],
      error: String(error),
    })
  }
}

export const action = async ({ request }: ActionFunctionArgs) => {
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

  // Send the validated data to the API
  const response = await fetchServer(request, `/api/product/add`, {
    method: "POST",
    body: JSON.stringify(result.data),
    headers: {
      "Content-Type": "application/json",
    },
  })

  return redirect("/products")
}

export default function ProductDetailPage() {
  // Get the categories data from the loader
  const data = useLoaderData<typeof loader>()

  // Pass the categories to the ProductCreateModule
  return <ProductCreateModule categories={data.categories} />
}
