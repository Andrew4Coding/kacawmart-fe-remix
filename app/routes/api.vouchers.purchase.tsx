import { json } from "@remix-run/node";
import { getTokenFromRequest } from "~/lib/cookie";
import fetchServer from "~/lib/fetch";

export const action = async ({ request }: { request: Request }) => {
  const token = await getTokenFromRequest(request);

  try {
    const body = await request.json();
    const { voucherId } = body;

    if (!voucherId) {
      return json({ success: false, message: "Voucher ID is required" }, 400);
    }

    // Forward to backend route
    const response = await fetchServer(request, "/purchase", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify({ voucherId })
    });

    return response;
  } catch (error) {
    console.error("API voucher purchase error:", error);
    return json({ success: false, message: "Server error" }, 500);
  }
};
