export type Wallet = {
    id: string;
    balance: number;
    userId: string;
  };
  
  export type Voucher = {
    id: string;
    price: number;
    discount: {
      value: number;
      code: string;
      expiredAt: string;
    };
  };
  
  export type OwnedVoucher = {
    id: string;
    voucher: Voucher;
    createdAt: string;
  };