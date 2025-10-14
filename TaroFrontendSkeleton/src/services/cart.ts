import api from './api'
import { Product } from './product'

// 购物车项接口
export interface CartItem {
  id: string
  userId: string
  productId: string
  quantity: number
  product: Product
  created_at: string
  updated_at: string
}

// 添加到购物车请求参数
export interface AddToCartParams {
  productId: string
  quantity: number
}

// 更新购物车请求参数
export interface UpdateCartParams {
  quantity: number
}

// 购物车服务
const cartService = {
  // 获取购物车
  getCart: () => {
    return api.get<CartItem[]>('/cart')
  },

  // 添加商品到购物车
  addToCart: (params: AddToCartParams) => {
    return api.post<CartItem>('/cart', params)
  },

  // 更新购物车商品数量
  updateCartItem: (id: string, params: UpdateCartParams) => {
    return api.put<CartItem>(`/cart/${id}`, params)
  },

  // 从购物车移除商品
  removeFromCart: (id: string) => {
    return api.delete(`/cart/${id}`)
  },

  // 清空购物车
  clearCart: () => {
    return api.delete('/cart')
  }
}

export default cartService 