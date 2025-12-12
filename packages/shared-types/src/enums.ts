/**
 * 枚举类型定义
 * 从后端模型中提取，供前后端统一使用
 */

/**
 * 用户状态枚举
 */
export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  BANNED = 'banned'
}

/**
 * 用户性别枚举
 */
export enum UserGender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other'
}

/**
 * 素材类型枚举
 */
export enum MaterialType {
  IMAGE = 'image',
  AUDIO = 'audio',
  VIDEO = 'video',
  DOCUMENT = 'document',
  TEXT = 'text',
  AVATAR = 'avatar',
  OTHER = 'other'
}

// 重新导出商城相关枚举（保持向后兼容）
export {
  PaymentStatus,
  DeliveryStatus,
  OrderStatus,
  PaymentMethod,
  UserAddressTag,
  UserAddressStatus
} from './modules/mall/enums'

// 重新导出商品相关枚举（保持向后兼容）
export {
  ProductSpuStatus,
  ProductSkuStatus,
  ProductCategoryStatus,
  ProductBrandStatus
} from './modules/product/enums'
