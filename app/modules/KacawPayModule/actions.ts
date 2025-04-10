import { ActionFunction } from "@remix-run/node";
import { getTokenFromRequest } from "~/lib/cookie";
import fetchServer from "~/lib/fetch";

export const topUpAction: ActionFunction = async ({ request }) => {
  const token = await getTokenFromRequest(request);
  const formData = await request.formData();
  
  const amount = Number(formData.get('amount'));
  const proofUrl = formData.get('proofUrl') as string;

  if (!amount || !proofUrl) {
    return { error: "Amount and proof URL are required" };
  }

  try {
    const response = await fetchServer('/api/wallet/topup', {
      method: 'POST',
      body: JSON.stringify({ amount, proofUrl })
    }, token);

    return response;
  } catch (error) {
    return { error: "Failed to process top up" };
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
    const response = await fetchServer('/api/vouchers/purchase', {
      method: 'POST',
      body: JSON.stringify({ voucherId })
    }, token);

    return response;
  } catch (error) {
    return { error: "Failed to purchase voucher" };
  }
};