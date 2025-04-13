// ~/modules/KacawPayModule/actions.ts
import { ActionFunction, json } from "@remix-run/node";
import { getTokenFromRequest } from "~/lib/cookie";
import fetchServer from "~/lib/fetch";

export const topUpAction: ActionFunction = async ({ request }) => {
  try {
    // For application/json content type
    const body = await request.json();
    const { amount, proofUrl } = body;

    if (!amount || !proofUrl) {
      return json({ error: "Amount and proof URL are required" }, 400);
    }

    // Create a new request for fetchServer with the correct URL and method
    const response = await fetchServer(
      request, 
      "/api/wallet/topup", 
      {
        method: 'POST',
        body: JSON.stringify({ amount: Number(amount), proofUrl })
      }
    );
    
    return response;
  } catch (error) {
    console.error("Top-up error:", error);
    return json({ 
      success: false,
      error: error instanceof Error 
        ? error.message 
        : "Failed to process top up" 
    }, 500);
  }
};

export const buyVoucherAction: ActionFunction = async ({ request }) => {
  const token = await getTokenFromRequest(request);
  const formData = await request.formData();
  const voucherId = formData.get('voucherId') as string;

  if (!voucherId) {
    return { error: "Voucher ID is required" };
  }

  try {
    // Create a new request object for the API call
    const apiRequest = new Request(request);
    
    // Modify the request for the API call
    apiRequest.headers.set('Content-Type', 'application/json');
    if (token) {
      apiRequest.headers.set('Authorization', `Bearer ${token}`);
    }

    return await fetchServer(apiRequest, '/api/vouchers/purchase', {
      method: 'POST',
      body: JSON.stringify({ voucherId })
    });
  } catch (error) {
    return { 
      error: error instanceof Error 
        ? error.message 
        : "Failed to purchase voucher" 
    };
  }
};