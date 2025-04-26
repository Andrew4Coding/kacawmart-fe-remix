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
    const response = await fetchServer(request, "/api/wallet/topup", {
      method: "POST",
      body: JSON.stringify({ amount: Number(amount), proofUrl }),
    });

    return response;
  } catch (error) {
    console.error("Top-up error:", error);
    return json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to process top up",
      },
      500,
    );
  }
};

export const buyVoucherAction: ActionFunction = async ({ request }) => {
  try {
    const token = await getTokenFromRequest(request);
    const formData = await request.formData();
    const voucherId = formData.get("voucherId");

    if (!voucherId || typeof voucherId !== "string") {
      return json({ success: false, error: "Voucher ID is required" }, 400);
    }

    const body = JSON.stringify({ voucherId });

    const response = await fetchServer(request, "/api/vouchers/purchase", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body,
    });

    return response;
  } catch (error) {
    console.error("Voucher purchase error:", error);
    return json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to purchase voucher",
      },
      500,
    );
  }
};
