import { type LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import fetchServer from "~/lib/fetch";
import ProductModule from "~/modules/ProductModule";
import type { Product } from "~/lib/types";

// Define the loader data type for better type safety
interface LoaderData {
  products: Product[];
  categories: { id: string; name: string }[];
  selectedCategoryId: string | null;
}

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    // Get the URL from the request
    const url = new URL(request.url);

    // Extract categoryId from URL search params
    const categoryId = url.searchParams.get("categoryId");

    // Get status from URL search params (optional)
    const status = url.searchParams.get("status") || "all";

    // Log what we're trying to fetch
    console.log(`Fetching products with categoryId: ${categoryId || "none"}`);

    // Use the new endpoints based on our updated API design
    const productsUrl = categoryId
      ? `/api/product/products/category/${categoryId}` // Products by category
      : `/api/product/products`; // All products

    console.log(`API URL: ${productsUrl}`);

    // Fetch products and categories in parallel for better performance
    const [productsResponse, categoriesResponse] = await Promise.all([
      fetchServer(request, productsUrl),
      fetchServer(request, "/api/product/categories"),
    ]);

    // Log the response to help debug
    console.log("Products response:", productsResponse);
    console.log("Categories response:", categoriesResponse);

    // Return both datasets and the selected category ID
    return json<LoaderData>({
      products: productsResponse.products || [],
      categories: categoriesResponse.categories || [],
      selectedCategoryId: categoryId,
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    // Return empty arrays if there's an error
    return json<LoaderData>({
      products: [],
      categories: [],
      selectedCategoryId: null,
    });
  }
}

export default function ProductPage() {
  const data = useLoaderData<typeof loader>() as LoaderData;

  return (
    <ProductModule
      products={data.products}
      categories={data.categories}
      selectedCategoryId={data.selectedCategoryId}
    />
  );
}
