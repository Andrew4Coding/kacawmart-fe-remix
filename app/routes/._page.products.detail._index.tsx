import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import fetchServer from "~/lib/fetch";
import ProductDetailModule from "~/modules/ProductModule/detail";

export async function loader(args: LoaderFunctionArgs) {
  const data = await fetchServer(args.request, "/api/product/filter");

  console.log(data);

  return data;
}

export default function ProductDetailPage() {
  const data = useLoaderData();
  return <ProductDetailModule products={data.products} />;
}
