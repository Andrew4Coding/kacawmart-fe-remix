import type { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import fetchServer from "~/lib/fetch";
import ProductDetailModule from "~/modules/ProductModule/detail";

export async function loader(args: LoaderFunctionArgs) {
  const productId = args.params.id;

  if (!productId) {
    throw new Error("Product ID is required");
  }

  // Fetch product details
  const productData = await fetchServer(
    args.request,
    `/api/product/details/${productId}`,
  );

  // Fetch reviews data
  const reviewsData = await fetchServer(
    args.request,
    `/api/product/reviews/${productId}`,
  );

  return {
    product: productData.product,
    reviews: reviewsData.reviews || [],
    ratingCount: reviewsData.ratingCount || 0,
    productRating: reviewsData.productRating || 0,
  };
}

export default function ProductPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <ProductDetailModule
      product={data.product}
      reviews={data.reviews}
      ratingCount={data.ratingCount}
      productRating={data.productRating}
    />
  );
}
