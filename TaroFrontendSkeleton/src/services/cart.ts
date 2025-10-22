import api from './api'

export interface CartProduct {
  id: string
  name: string
  price: number
  stock?: number
}

export interface CartItem {
  id: string
  cart_id: string
  product_id: string
  quantity: number
  product?: CartProduct
  created_at: string
  updated_at: string
}

export interface Cart {
  id: string
  user_id: string
  total_price: number
  items?: CartItem[]
}

export interface AddToCartParams {
  product_id: string
  quantity: number
}

export interface UpdateCartParams {
  quantity: number
}

const cartService = {
  getCart: () => api.get<Cart>('/user/cart'),
  addToCart: (params: AddToCartParams) => api.post<Cart>('/user/cart/items', params),
  updateCartItem: (id: string, params: UpdateCartParams) => api.put<Cart>(`/user/cart/items/${id}`, params),
  removeFromCart: (id: string) => api.delete<Cart>(`/user/cart/items/${id}`),
  clearCart: () => api.post<Cart>('/user/cart/clear')
}

export default cartService