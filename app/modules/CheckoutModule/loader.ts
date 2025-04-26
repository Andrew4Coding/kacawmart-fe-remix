import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import fetchServer from "~/lib/fetch";

export default async function checkoutLoader(args: LoaderFunctionArgs) {
  const response: {
    message: string;
  } = await fetchServer(args.request, "/api/cart/checkout");

  if (response.message === "Cart is empty") {
    return redirect("/cart");
  }

  return response;
}
