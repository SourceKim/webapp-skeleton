import type {
  ProductAttributeValue as IProductAttributeValue,
  ProductAttributeKey as IProductAttributeKey
} from '@skeleton/shared-types'

/**
 * 商品属性值类型定义
 * 使用 @skeleton/shared-types 中的统一类型定义
 */
export type { ProductAttributeValue } from '@skeleton/shared-types'

// 类型别名，保持向后兼容
export type ProductAttributeValue = IProductAttributeValue

/**
 * 商品属性键类型定义
 * 使用 @skeleton/shared-types 中的统一类型定义
 */
export type { ProductAttributeKey } from '@skeleton/shared-types'

// 类型别名，保持向后兼容
export type ProductAttributeKey = IProductAttributeKey


