export interface Product {
    id: string;
    name: string;
    category: string;
    price: number;
    summary: string;
    stats: {
      sales: number;
      rating: number;
      remaining: number;
    };
  }