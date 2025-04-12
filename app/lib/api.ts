// lib/api.ts
import fetchServer from './fetch'

// Base types and interfaces remain the same as in the previous example

export async function getProducts(
  req: Request, 
  params: PaginationParams & { 
    status?: string 
    category?: string 
  }
) {
  const queryParams = new URLSearchParams()
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      queryParams.append(key, String(value))
    }
  })

  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : ''
  
  return fetchServer(req, `/api/products${queryString}`)
}

export async function getProductById(req: Request, id: string) {
  return fetchServer(req, `/api/products/${id}`)
}

// Other methods would follow a similar pattern
export async function login(req: Request, credentials: { email: string; password: string }) {
  return fetchServer(req, '/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  })
}