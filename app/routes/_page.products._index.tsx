import { LoaderFunctionArgs } from "@remix-run/node";
import fetchServer from "~/lib/fetch";
import ProductModule from "~/modules/ProductModule";

export async function loader(args: LoaderFunctionArgs) {
    const data = await fetchServer(args.request, '/api/product/products')

    console.log(data);
    

    return null;
}

export default function ProductPage() { 
    return <ProductModule />
}