import { ActionFunctionArgs, json, redirect, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import ProductCreateModule from "~/modules/ProductModule/create";
import { productSchema } from "~/modules/ProductModule/type";
import { parse } from "cookie";
import fetchServer from "~/lib/fetch";
import { ArrowRightSquare } from "lucide-react";


export const action = async ({ request }: ActionFunctionArgs) => {
const cookieHeader = request.headers.get("Cookie");
  const cookies = parse(cookieHeader || "");
  const token = cookies["x-user-token"];

  console.log(request.headers.get("x-user-token"));
  //console.log("parsed" + cookies);
  const formData = await request.formData();

  // Convert formData to a plain object
  const data = Object.fromEntries(formData);

  // Make sure number fields are actually numbers
  const parsedData = {
    ...data,
    price: parseFloat(data.price as string),
    stock: parseInt(data.stock as string),
  };

  // Validate using zod schema
  const result = productSchema.safeParse(parsedData);

  if (!result.success) {
    return json({ errors: result.error.flatten() }, { status: 400 });
  }

  // Send validated data to your backend
  await fetchServer(request, `/api/product/add`, {
    method: 'POST',
    body: JSON.stringify(result.data)
  })

  return redirect("/products");
};

export default function ProductDetailPage() {
  return <ProductCreateModule />;
}
