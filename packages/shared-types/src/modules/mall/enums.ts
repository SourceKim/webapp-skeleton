/**
 * 商城相关枚举类型定义
 */

/**
 * 支付状态枚举
 */
export enum PaymentStatus {
  UNPAID = 'UNPAID',
  PAID = 'PAID',
  REFUNDED = 'REFUNDED'
}

/**
 * 配送状态枚举
 */
export enum DeliveryStatus {
  PENDING = 'PENDING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED'
}

/**
 * 订单状态枚举
 */
export enum OrderStatus {
  UNPAID = 'UNPAID',
  TO_BE_SHIPPED = 'TO_BE_SHIPPED',
  SHIPPED = 'SHIPPED',
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED'
}

/**
 * 支付方式枚举
 */
export enum PaymentMethod {
  ALIPAY = 'ALIPAY',
  WECHAT = 'WECHAT',
  CASH = 'CASH'
}

/**
 * 商品SPU状态枚举
 */
export enum ProductSpuStatus {
  DRAFT = 'DRAFT',
  ON_SHELF = 'ON_SHELF',
  OFF_SHELF = 'OFF_SHELF'
}

/**
 * 商品SKU状态枚举
 */
export enum ProductSkuStatus {
  ON_SHELF = 'ON_SHELF',
  OFF_SHELF = 'OFF_SHELF'
}

/**
 * 用户地址标签枚举
 */
export enum UserAddressTag {
  HOME = 'HOME',
  COMPANY = 'COMPANY',
  SCHOOL = 'SCHOOL',
  OTHER = 'OTHER'
}

/**
 * 用户地址状态枚举
 */
export enum UserAddressStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}
