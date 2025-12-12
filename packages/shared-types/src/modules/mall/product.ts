/**
 * 商品相关类型定义
 * 从 product 模块重新导出，保持向后兼容
 */
export type {
  ProductSpu,
  ProductSku,
  ProductCategory,
  ProductBrand,
  ProductAttributeKey,
  ProductAttributeValue,
  ProductSkuAttribute,
  SkuAttributeKV
} from '../product'

export {
  ProductSpuStatus,
  ProductSkuStatus,
  ProductCategoryStatus,
  ProductBrandStatus
} from '../product'
