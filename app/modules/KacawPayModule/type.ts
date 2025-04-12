export type Wallet = {
  id?: string;
  balance: number;
  userId?: string;
  lastTopUpDate?: string;
};

export type Voucher = {
  id: string;
  price: number;
  createdAt: string;
  discount: {
    id: string;
    code: string;
    value: number;
    expiredAt: string;
  };
};

export type LoaderData = {
  wallet: Wallet;
  vouchers: Voucher[];
};