export interface Category {
    id: string
    name: string
    productCount: number
  }
  
  export interface Seller {
    id: string
    bankName: string
    bankNumber: string
    shopRating: number
    selledProduct: number
    userId: string
    createdAt: string
    updatedAt: string
  }
  
  export interface Product {
    id: string
    name: string
    description: string
    price: number
    imageUrl: string
    ratingCount: number
    productRating: number
    stock: number
    category: Category[]
    Seller: Seller[]
  }
  