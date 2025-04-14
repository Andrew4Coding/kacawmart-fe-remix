import { LoaderFunctionArgs } from "@remix-run/node";
import fetchServer from "~/lib/fetch";
import WishlistModule  from "~/modules/WishlistModule";

export async function loader(args: LoaderFunctionArgs) {
  const response = await fetchServer(args.request, '/api/wishlist');

  return response;
}

export default function WishlistRoute() {
  return (
    <WishlistModule />
  );
}