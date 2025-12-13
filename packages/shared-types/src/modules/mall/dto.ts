/**
 * 商城相关 DTO 类型定义
 */
import type { Cart, MallOrder, MallOrderItem, UserAddress, Carousel, ShopIntroBanner } from './index'
import type { PaymentMethod, PaymentStatus, DeliveryStatus, OrderStatus, UserAddressTag, UserAddressStatus } from './enums'
import type { Material } from '../material'
import type { ProductSpu } from '../product'

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
 * 购物车项响应数据（使用驼峰命名，符合前端习惯）
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
 * 订单响应数据（使用驼峰命名，符合前端习惯）
 */
export interface OrderResponseDto {
  id: string
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date | null
  orderNo: string
  userId: string
  totalAmount: string
  orderStatus: OrderStatus
  paymentStatus: PaymentStatus
  deliveryStatus: DeliveryStatus
  paymentMethod?: PaymentMethod
  remark?: string
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
  tag?: UserAddressTag
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
  tag?: UserAddressTag
  status?: UserAddressStatus
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

/**
 * 用户地址响应数据（使用驼峰命名，符合前端习惯）
 */
export interface UserAddressResponseDto {
  id: string
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date | null
  userId: string
  name: string
  phone: string
  province: string
  city: string
  country: string
  town?: string
  detail: string
  postalCode?: string
  isDefault: boolean
  tag?: UserAddressTag
  status: UserAddressStatus
}

/**
 * 创建轮播图请求参数
 */
export interface CreateCarouselDto {
  title?: string
  material_id: string
  spu_id?: string
  sort_order?: number
  is_active?: boolean
}

/**
 * 更新轮播图请求参数
 */
export interface UpdateCarouselDto {
  title?: string
  material_id?: string
  spu_id?: string
  sort_order?: number
  is_active?: boolean
}

/**
 * 轮播图响应数据（使用驼峰命名，符合前端习惯）
 */
export interface CarouselResponseDto {
  id: string
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date | null
  title?: string
  materialId: string
  material?: Material
  spuId?: string
  spu?: ProductSpu
  sortOrder: number
  isActive: boolean
}

/**
 * 创建店铺介绍请求参数
 */
export interface CreateShopIntroDto {
  name: string
  introduction?: string
  detail?: string
  contact_phone?: string
  longitude?: number
  latitude?: number
  address?: string
  banner_ids?: string[]
}

/**
 * 更新店铺介绍请求参数
 */
export interface UpdateShopIntroDto {
  name?: string
  introduction?: string
  detail?: string
  contact_phone?: string
  longitude?: number
  latitude?: number
  address?: string
  banner_ids?: string[]
}

/**
 * 店铺介绍响应数据（使用驼峰命名，符合前端习惯）
 */
export interface ShopIntroResponseDto {
  id: string
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date | null
  name: string
  introduction?: string
  detail?: string
  contactPhone?: string
  longitude?: number
  latitude?: number
  address?: string
  banners?: ShopIntroBanner[]
}

/**
 * 店铺介绍Banner响应数据（使用驼峰命名，符合前端习惯）
 */
export interface ShopIntroBannerResponseDto {
  id: string
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date | null
  materialId: string
  material?: Material
  sortOrder: number
}
