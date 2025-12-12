/**
 * 商城相关验证规则定义
 * 使用 Zod 进行前后端统一的验证
 */

import { z } from 'zod'
import { PaymentMethod, PaymentStatus, DeliveryStatus, OrderStatus, UserAddressTag, UserAddressStatus } from './enums'

/**
 * 创建购物车项验证 Schema
 */
export const createCartSchema = z.object({
  sku_id: z.string()
    .min(1, '商品SKU ID不能为空')
    .max(36, '商品SKU ID长度不能超过36个字符'),
  quantity: z.number()
    .int('数量必须是整数')
    .positive('数量必须大于0')
})

/**
 * 更新购物车项验证 Schema
 */
export const updateCartSchema = z.object({
  quantity: z.number()
    .int('数量必须是整数')
    .positive('数量必须大于0')
    .optional()
})

/**
 * 更新选中状态验证 Schema
 */
export const updateSelectedSchema = z.object({
  selected: z.boolean(),
  cart_item_ids: z.array(z.string())
    .min(1, '至少需要选择一个购物车项')
})

/**
 * 订单预览验证 Schema
 */
export const orderPreviewSchema = z.object({
  cart_item_ids: z.array(z.string())
    .min(1, '至少需要选择一个购物车项')
})

/**
 * 创建订单验证 Schema
 */
export const createOrderSchema = z.object({
  cart_item_ids: z.array(z.string())
    .min(1, '至少需要选择一个购物车项'),
  address_id: z.string()
    .min(1, '收货地址ID不能为空')
    .max(36, '收货地址ID长度不能超过36个字符'),
  payment_method: z.nativeEnum(PaymentMethod).optional(),
  remark: z.string()
    .max(500, '备注长度不能超过500个字符')
    .optional()
})

/**
 * 订单查询参数验证 Schema
 */
export const orderQuerySchema = z.object({
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().optional(),
  sort_by: z.string().optional(),
  sort_order: z.enum(['ASC', 'DESC']).optional(),
  order_status: z.nativeEnum(OrderStatus).optional(),
  payment_status: z.nativeEnum(PaymentStatus).optional(),
  delivery_status: z.nativeEnum(DeliveryStatus).optional(),
  user_id: z.string().optional()
})

/**
 * 创建用户地址验证 Schema
 */
export const createUserAddressSchema = z.object({
  name: z.string()
    .min(1, '收货人姓名不能为空')
    .max(50, '收货人姓名长度不能超过50个字符'),
  phone: z.string()
    .regex(/^1[3-9]\d{9}$/, '手机号格式不正确')
    .max(20, '手机号长度不能超过20个字符'),
  province: z.string()
    .min(1, '省份不能为空')
    .max(50, '省份长度不能超过50个字符'),
  city: z.string()
    .min(1, '城市不能为空')
    .max(50, '城市长度不能超过50个字符'),
  country: z.string()
    .min(1, '区县不能为空')
    .max(50, '区县长度不能超过50个字符'),
  town: z.string()
    .max(50, '街道长度不能超过50个字符')
    .optional(),
  detail: z.string()
    .min(1, '详细地址不能为空')
    .max(200, '详细地址长度不能超过200个字符'),
  postal_code: z.string()
    .max(10, '邮编长度不能超过10个字符')
    .optional(),
  is_default: z.boolean().optional(),
  tag: z.nativeEnum(UserAddressTag).optional()
})

/**
 * 更新用户地址验证 Schema
 */
export const updateUserAddressSchema = createUserAddressSchema.partial().extend({
  status: z.nativeEnum(UserAddressStatus).optional()
})

/**
 * 用户地址查询参数验证 Schema
 */
export const userAddressQuerySchema = z.object({
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().optional(),
  user_id: z.string().optional(),
  is_default: z.boolean().optional(),
  status: z.string().optional()
})

/**
 * 创建轮播图验证 Schema
 */
export const createCarouselSchema = z.object({
  title: z.string()
    .max(255, '标题长度不能超过255个字符')
    .optional(),
  material_id: z.string()
    .min(1, '素材ID不能为空')
    .max(36, '素材ID长度不能超过36个字符'),
  spu_id: z.string()
    .max(36, '商品SPU ID长度不能超过36个字符')
    .optional(),
  sort_order: z.number()
    .int('排序值必须是整数')
    .optional(),
  is_active: z.boolean().optional()
})

/**
 * 更新轮播图验证 Schema
 */
export const updateCarouselSchema = createCarouselSchema.partial()

/**
 * 创建店铺介绍验证 Schema
 */
export const createShopIntroSchema = z.object({
  name: z.string()
    .min(1, '店铺名称不能为空')
    .max(100, '店铺名称长度不能超过100个字符'),
  introduction: z.string()
    .max(500, '简介长度不能超过500个字符')
    .optional(),
  detail: z.string().optional(),
  contact_phone: z.string()
    .max(20, '联系电话长度不能超过20个字符')
    .optional(),
  longitude: z.number().optional(),
  latitude: z.number().optional(),
  address: z.string()
    .max(200, '地址长度不能超过200个字符')
    .optional(),
  banner_ids: z.array(z.string()).optional()
})

/**
 * 更新店铺介绍验证 Schema
 */
export const updateShopIntroSchema = createShopIntroSchema.partial()
