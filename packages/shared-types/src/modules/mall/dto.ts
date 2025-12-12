/**
 * 商城相关 DTO 类型定义
 */
import type { Cart, MallOrder, MallOrderItem, UserAddress } from './index'
import type { PaymentMethod, PaymentStatus, DeliveryStatus, OrderStatus } from './enums'

/**
 * 创建购物车项请求参数
 */
export interface CreateCartDto {
  sku_id: string
  quantity: number
}

/**
 * 更新购物车项请求参数
 */
export interface UpdateCartDto {
  quantity?: number
}

/**
 * 更新选中状态请求参数
 */
export interface UpdateSelectedDto {
  selected: boolean
  cart_item_ids: string[]
}

/**
 * 购物车项响应数据
 */
export interface CartItemDto {
  id: string
  quantity: number
  selected: boolean
  sku?: any // 商品SKU信息
}

/**
 * 订单预览请求参数
 */
export interface OrderPreviewDto {
  cart_item_ids: string[]
}

/**
 * 创建订单请求参数
 */
export interface CreateOrderDto {
  cart_item_ids: string[]
  address_id: string
  payment_method?: PaymentMethod
  remark?: string
}

/**
 * 订单查询参数
 */
export interface OrderQueryDto {
  page?: number
  limit?: number
  sort_by?: string
  sort_order?: 'ASC' | 'DESC'
  order_status?: OrderStatus
  payment_status?: PaymentStatus
  delivery_status?: DeliveryStatus
  user_id?: string
}

/**
 * 订单响应数据
 */
export interface OrderResponseDto extends MallOrder {
  items?: MallOrderItem[]
}

/**
 * 创建用户地址请求参数
 */
export interface CreateUserAddressDto {
  name: string
  phone: string
  province: string
  city: string
  country: string
  town?: string
  detail: string
  postal_code?: string
  is_default?: boolean
  tag?: string
}

/**
 * 更新用户地址请求参数
 */
export interface UpdateUserAddressDto {
  name?: string
  phone?: string
  province?: string
  city?: string
  country?: string
  town?: string
  detail?: string
  postal_code?: string
  is_default?: boolean
  tag?: string
  status?: string
}

/**
 * 用户地址查询参数
 */
export interface UserAddressQueryDto {
  page?: number
  limit?: number
  user_id?: string
  is_default?: boolean
  status?: string
}
