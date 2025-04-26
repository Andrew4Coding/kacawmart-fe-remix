interface Category {
  id: string;
  name: string;
  productCount: number;
}

interface Seller {
  id: string;
  bankName: string;
  bankNumber: string;
  shopRating: number;
  selledProduct: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  ratingCount: number;
  productRating: number;
  stock: number;
  category: Category[];
  Seller: Seller[];
}

interface ExploreResponse {
  products: Product[];
  categories?: Category[];
}

export type { Category, Seller, Product, ExploreResponse };
