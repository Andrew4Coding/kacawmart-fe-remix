import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import fetchServer from "~/lib/fetch";
import ProductModule from "~/modules/ProductModule";

export async function loader(args: LoaderFunctionArgs) {
    const data = await fetchServer(args.request, '/api/product/filter')

    console.log("products", data);

    return data;
}

export default function ProductPage() { 
    const data = useLoaderData()
    return <ProductModule products={data.products}/>
}