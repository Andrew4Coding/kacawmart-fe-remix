interface Product {
  id: string
  name: string
  price: number
  imageUrl: string
  stock: number
}

interface CartProduct {
  id: string
  amount: number
  price: number
  productId: string
  product: Product
}

interface CartResponse {
  success: boolean
  message?: string
  products: CartProduct[]
}

export type {
    Product,
    CartProduct,
    CartResponse,
}