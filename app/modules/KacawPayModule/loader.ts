// modules/KacawPayModule/loader.ts
import { LoaderFunctionArgs } from "@remix-run/node";
import { getTokenFromRequest } from "~/lib/cookie";
import fetchServer from "~/lib/fetch";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const token = await getTokenFromRequest(request);
  
  try {
    // Use the original request directly with fetchServer
    const [wallet, vouchers] = await Promise.all([
      fetchServer(request, '/api/wallet', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }).catch(() => null), // Return null if request fails
      fetchServer(request, '/api/vouchers', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }).catch(() => []) // Return empty array if request fails
    ]);

    return { 
      wallet: wallet || { balance: 0 }, // Default wallet object if null
      vouchers: vouchers || []
    };
  } catch (error) {
    console.error("Loader error:", error);
    return { 
      wallet: { balance: 0 }, // Return default wallet object
      vouchers: [] 
    };
  }
};