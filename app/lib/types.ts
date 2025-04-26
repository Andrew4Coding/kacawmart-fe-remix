export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  ratingCount: number;
  productRating: number;
  stock: number;
  category?: {
    id: string;
    name: string;
  };
}

export interface OrderProduct {
  id: string;
  amount: number;
  price: number;
  productId: string;
  product: Product;
}

export interface Order {
  id: string;
  deliveryStatus: string;
  totalPrice: number;
  totalProduct: number;
  transactionId: string;
  discountId: string | null;
  createdAt: string;
  updatedAt: string;
  product: OrderProduct[];
}

export interface Review {
  title: string;
  content: string;
  rating: number;
  customerId: string;
  customerName: string;
  createdAt?: string;
}

export interface ProductReviews {
  productId: string;
  ratingCount: number;
  productRating: number;
  reviews: Review[];
}
