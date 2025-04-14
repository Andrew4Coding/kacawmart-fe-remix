// modules/KacawPayModule/loader.ts
import { LoaderFunctionArgs } from "@remix-run/node";
import { getTokenFromRequest } from "~/lib/cookie";
import fetchServer from "~/lib/fetch";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const token = await getTokenFromRequest(request);
  
  try {
    // Use the original request directly with fetchServer
    const [walletResponse, vouchersResponse] = await Promise.all([
      fetchServer(request, '/api/wallet', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }).catch(() => null), // Return null if request fails
      
      // Using the correct endpoint
      fetchServer(request, '/api/voucher/owned', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }).catch(() => null) // Return null if request fails
    ]);

    console.log('Wallet response:', walletResponse);
    console.log('Vouchers response:', vouchersResponse);

    // Extract vouchers data from the response structure
    // Based on your backend, it's likely returning { success: true, data: [...] }
    const vouchers = vouchersResponse?.success === true 
      ? vouchersResponse.data 
      : vouchersResponse?.data || vouchersResponse || [];

    // Similarly handle wallet data
    const wallet = walletResponse?.success === true
      ? walletResponse.data
      : walletResponse || { balance: 0 };

    return { 
      wallet: wallet || { balance: 0 }, 
      vouchers: vouchers || []
    };
  } catch (error) {
    console.error("Loader error:", error);
    return { 
      wallet: { balance: 0 }, 
      vouchers: [] 
    };
  }
};