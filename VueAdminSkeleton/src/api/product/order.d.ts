import type { MallOrder as IMallOrder, MallOrderItem as IMallOrderItem } from '@skeleton/shared-types'

/**
 * 订单项类型定义
 * 使用 @skeleton/shared-types 中的统一类型定义
 */
export type { MallOrderItem as OrderItem } from '@skeleton/shared-types'

// 类型别名，保持向后兼容
export type OrderItem = IMallOrderItem

/**
 * 订单类型定义
 * 使用 @skeleton/shared-types 中的统一类型定义
 */
export type { MallOrder as Order } from '@skeleton/shared-types'

// 扩展 Order 接口，添加前端特定字段
export interface Order extends Omit<IMallOrder, 'user' | 'order_status' | 'payment_status' | 'delivery_status'> {
  user: { id: string; username: string; phone?: string; email?: string; avatar?: string }
  order_status: 'PENDING' | 'CONFIRMED' | 'CANCELED' | 'COMPLETED' | IMallOrder['order_status']
  payment_status: IMallOrder['payment_status']
  delivery_status: IMallOrder['delivery_status']
  created_at: string
  items?: OrderItem[]
}

export interface OrderQuery {
  page?: number
  limit?: number
  sort_by?: string
  sort_order?: 'ASC' | 'DESC'
  filters?: {
    id?: string
    user_id?: string
    order_status?: string
    payment_status?: string
    delivery_status?: string
  }
}


