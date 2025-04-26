export type Transaction = {
  id: string;
  status: "PENDING" | "FAILED" | "SUCCESS"; // Assuming possible statuses
  userId: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  OrderTransaction: OrderTransaction[];
  VoucherTransaction: VoucherTransaction[];
  WalletTransaction: WalletTransaction[];
};

export type OrderTransaction = {
  id: string;
  deliveryStatus: "DELIVERED" | "ON_DELIVERY" | "PENDING"; // Assuming possible statuses
  totalPrice: number;
  totalProduct: number;
  transactionId: string;
  discountId: string | null;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
};

export type VoucherTransaction = {
  // Define fields if needed
};

export type WalletTransaction = {
  // Define fields if needed
};
