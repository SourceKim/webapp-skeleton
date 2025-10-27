import api from './api'
import { type ProductMaterialRef } from './product'

export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'completed' | 'canceled'

export interface OrderItemProductRef {
  id: string
  name: string
  price: number
  materials?: ProductMaterialRef[]
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string | null
  quantity: number
  unit_price: number
  product?: OrderItemProductRef | null
}

export interface Order {
  id: string
  user_id: string
  status: OrderStatus
  total_price: number
  address?: string
  shipping_no?: string
  remark?: string
  items?: OrderItem[]
  paid_at?: string | null
  shipped_at?: string | null
  completed_at?: string | null
  created_at?: string
  updated_at?: string
}

export interface PaginatedMeta {
  total: number
  page: number
  limit: number
  pages: number
  sort_by?: string
  sort_order?: 'ASC' | 'DESC'
}

export interface PaginatedOrdersResponse {
  items: Order[]
  meta: PaginatedMeta
}

export interface CreateOrderParams {
  address?: string
  remark?: string
}

const orderService = {
  // 用户侧：订单列表（分页）
  getMyOrders: (params?: { page?: number; limit?: number; filters?: Record<string, any>; sort_by?: string; sort_order?: 'ASC'|'DESC' }) => {
    return api.get<PaginatedOrdersResponse>('/user/orders', params)
  },

  // 用户侧：订单详情
  getMyOrder: (id: string) => {
    return api.get<Order>(`/user/orders/${id}`)
  },

  // 用户侧：从购物车创建订单
  createOrderFromCart: (params?: CreateOrderParams) => {
    return api.post<Order>('/user/orders', params)
  },

  // 用户侧：确认/支付
  confirmOrder: (id: string) => {
    return api.post<Order>(`/user/orders/${id}/confirm`)
  },

  // 用户侧：取消
  cancelOrder: (id: string) => {
    return api.post<Order>(`/user/orders/${id}/cancel`)
  },

  // 用户侧：完成（确认收货）
  completeOrder: (id: string) => {
    return api.post<Order>(`/user/orders/${id}/complete`)
  }
}

export default orderService 