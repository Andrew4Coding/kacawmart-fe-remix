import {
  type ActionFunctionArgs,
  json,
  redirect,
  type LoaderFunctionArgs,
} from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import ProductEditModule from "~/modules/ProductModule/edit";
import { parse } from "cookie";
import fetchServer from "~/lib/fetch";
import { UpdateProductSchema } from "~/modules/ProductModule/type";

export async function loader({ request, params }: LoaderFunctionArgs) {
  console.log("Product edit page loader called for product ID:", params.id);
  try {
    // Fetch the product data
    const productResponse = await fetchServer(
      request,
      `/api/product/details/${params.id}`,
    );

    // Fetch the categories data
    const categoriesResponse = await fetchServer(
      request,
      "/api/product/categories",
    );

    // Return both product and categories data
    return json({
      product: productResponse?.product || null,
      categories: categoriesResponse?.categories || [],
    });
  } catch (error) {
    console.error("Error fetching product data:", error);
    return json({
      product: null,
      categories: [],
      error: String(error),
    });
  }
}

export const action = async ({ request, params }: ActionFunctionArgs) => {
  console.log("Product edit action called for product ID:", params.id);

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
    const result = UpdateProductSchema.safeParse(data);

    if (!result.success) {
      console.error("Validation failed:", result.error.flatten());
      return json({ errors: result.error.flatten() }, { status: 400 });
    }

    console.log("Validation passed, sending to API:", result.data);

    // Send the validated data to the API
    const response = await fetchServer(
      request,
      `/api/product/edit/${params.id}`,
      {
        method: "PUT",
        body: JSON.stringify(result.data),
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    console.log("API response:", response);
    return redirect("/products");
  } catch (error) {
    console.error("Error in action:", error);
    return json({ error: String(error) }, { status: 500 });
  }
};

export default function ProductEditPage() {
  // Get the product and categories data from the loader
  const data = useLoaderData<typeof loader>();
  console.log("ProductEditPage rendering with data:", data);

  // If product is not found, show an error
  if (!data.product) {
    return (
      <div className="p-10">
        <h1 className="text-2xl font-bold text-red-600">Product not found</h1>
        <p className="mt-4">
          The product you're trying to edit could not be found.
        </p>
      </div>
    );
  }

  // Pass the product and categories to the ProductEditModule
  return (
    <ProductEditModule product={data.product} categories={data.categories} />
  );
}
