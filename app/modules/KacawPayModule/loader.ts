import { LoaderFunction } from "@remix-run/node";
import { getTokenFromRequest } from "~/lib/cookie";
import fetchServer from "~/lib/fetch";

export const loader: LoaderFunction = async ({ request }) => {
  const token = await getTokenFromRequest(request);
  
  // Fetch wallet data
  const wallet = await fetchServer('/api/wallet', {}, token);
  
  // Fetch available vouchers
  const vouchers = await fetchServer('/api/vouchers', {}, token);
  
  // Fetch owned vouchers
  const ownedVouchers = await fetchServer('/api/vouchers/owned', {}, token);

  return {
    wallet,
    vouchers,
    ownedVouchers
  };
};