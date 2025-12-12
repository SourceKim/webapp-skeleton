/**
 * 订单相关类型定义
 */
import { BaseEntity } from '../../base'
import { PaymentStatus, DeliveryStatus, OrderStatus, PaymentMethod } from './enums'
import type { User } from '../user'

/**
 * 订单项实体接口
 */
export interface MallOrderItem extends BaseEntity {
  order_id: string
  order?: MallOrder // 关联订单
  sku_id: string
  sku_snapshot: Record<string, any>
  quantity: number
  unit_price: string
  total_price: string
}

/**
 * 订单实体接口
 */
export interface MallOrder extends BaseEntity {
  user_id: string
  user?: User // 关联用户
  total_amount: string
  discount_amount: string
  shipping_amount: string
  payable_amount: string
  payment_method?: PaymentMethod | null
  payment_status: PaymentStatus
  payment_time?: Date | null
  delivery_status: DeliveryStatus
  delivery_time?: Date | null
  received_time?: Date | null
  order_status: OrderStatus
  address_id: string
  address_snapshot: Record<string, any>
  remark?: string | null
  items?: MallOrderItem[] // 关联订单项
}
