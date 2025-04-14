import { LoaderFunctionArgs } from "@remix-run/node";
import fetchServer from "~/lib/fetch";
import { Product } from "./types";

export default async function cartLoader(args: LoaderFunctionArgs) {
    const response: {
        products: Product[]
    } = await fetchServer(args.request, "/api/cart");
    return response.products;
}