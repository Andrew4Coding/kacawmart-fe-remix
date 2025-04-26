import {
  type ActionFunctionArgs,
  json,
  redirect,
  type LoaderFunctionArgs,
} from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import ProductCreateModule from "~/modules/ProductModule/create";
import { parse } from "cookie";
import fetchServer from "~/lib/fetch";

// Fix the import path to point to the correct location
import { productSchema } from "~/modules/ProductModule/type";

export async function loader({ request }: LoaderFunctionArgs) {
  console.log("Product create page loader called");
  try {
    // Fetch the categories data
    const response = await fetchServer(request, "/api/product/categories");

    // Return the categories data
    return json({
      categories: response?.categories || [],
      // Include the raw response for debugging
      _debug: {
        rawResponse: response,
      },
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return json({
      categories: [],
      error: String(error),
    });
  }
}

export const action = async ({ request }: ActionFunctionArgs) => {
  console.log("Product create action called");

  const cookieHeader = request.headers.get("Cookie");
  const cookies = parse(cookieHeader || "");
  const token = cookies["x-user-token"];

  console.log(
    "Request headers:",
    Object.fromEntries(request.headers.entries()),
  );
  console.log("Content-Type:", request.headers.get("Content-Type"));

  try {
    // Parse the JSON data from the request
    const data = await request.json();
    console.log("Received data in action:", data);

    // Validate the data against our schema
    const result = productSchema.safeParse(data);

    if (!result.success) {
      console.error("Validation failed:", result.error.flatten());
      return json({ errors: result.error.flatten() }, { status: 400 });
    }

    console.log("Validation passed, sending to API:", result.data);

    // Send the validated data to the API
    const response = await fetchServer(request, `/api/product/add`, {
      method: "POST",
      body: JSON.stringify(result.data),
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("API response:", response);
    return redirect("/products");
  } catch (error) {
    console.error("Error in action:", error);
    return json({ error: String(error) }, { status: 500 });
  }
};

export default function ProductDetailPage() {
  // Get the categories data from the loader
  const data = useLoaderData<typeof loader>();

  console.log("ProductDetailPage rendering with data:", data);

  // Add a simple wrapper to help debug rendering issues
  return (
    <>
      <div
        style={{ padding: "20px", background: "#f0f0f0", marginBottom: "20px" }}
      >
        <h2>Debug: Product Create Page</h2>
        <p>Categories loaded: {data.categories.length}</p>
      </div>
      <ProductCreateModule categories={data.categories} />
    </>
  );
}
