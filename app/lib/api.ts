// lib/api.ts
import { c } from "node_modules/vite/dist/node/moduleRunnerTransport.d-CXw_Ws6P";
import fetchServer from "./fetch";

// Base types and interfaces remain the same as in the previous example

export async function getProducts(
  req: Request,
  params: PaginationParams & {
    status?: string;
    category?: string;
  },
) {
  const queryParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      queryParams.append(key, String(value));
    }
  });

  const queryString = queryParams.toString()
    ? `?${queryParams.toString()}`
    : "";

  return fetchServer(req, `/api/products${queryString}`);
}

export async function getProductById(req: Request, id: string) {
  return fetchServer(req, `/api/products/${id}`);
}

// Other methods would follow a similar pattern
export async function login(
  req: Request,
  credentials: { email: string; password: string },
) {
  return fetchServer(req, "/api/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}

export async function getAllCategories(request: Request) {
  console.log("Fetching categories...");
  try {
    const res = await fetchServer(request, "/api/product/categories");
    console.log("Fetch categories response:", res);

    if (!res.ok) {
      console.error("Failed to fetch categories. Status:", res.status);
      throw new Error("Failed to fetch categories");
    }

    const categories = await res.json();
    console.log("Parsed categories:", categories);
    return categories;
  } catch (error) {
    console.error("Error in getAllCategories:", error);
    throw error;
  }
}
