export interface ProductInfo {
    id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    ratingCount: number;
    productRating: number;
    stock: number;
}

export interface Product {
    id: string;
    amount: number;
    price: number;
    productId: string;
    product: ProductInfo;
}

export interface OrderTransaction {
    id: string;
    deliveryStatus: string;
    totalPrice: number;
    totalProduct: number;
    transactionId: string;
    discountId: string;
    createdAt: string;
    updatedAt: string;
    product: Product[];
}

export interface TransactionData {
    id: string;
    status: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
    OrderTransaction: OrderTransaction[];
    VoucherTransaction: any[];      // Define properly if schema is known
    WalletTransaction: any[];      // Define properly if schema is known
}
