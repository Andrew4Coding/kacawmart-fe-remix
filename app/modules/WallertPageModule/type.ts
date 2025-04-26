// modules/KacawPayModule/types.ts
export type Wallet = {
  id?: string;
  balance: number;
  userId?: string;
  lastTopUpDate?: string;
};

export interface Discount {
  id: string;
  code: string;
  value: number;
  expiredAt: string;
  maxUsage?: number; // Make optional if not always present
  usageCount?: number; // Make optional if not always present
}

export interface Voucher {
  id: string;
  price: number;
  discountId: string;
  discount: Discount;
  createdAt?: string; // Make optional if not always present
}

export type LoaderData = {
  wallet: Wallet;
  vouchers: Voucher[];
};
