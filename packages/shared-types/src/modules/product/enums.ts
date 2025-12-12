/**
 * 商品相关枚举类型定义
 */

/**
 * 商品分类状态枚举
 */
export enum ProductCategoryStatus {
  ENABLED = 'ENABLED',
  DISABLED = 'DISABLED'
}

/**
 * 商品品牌状态枚举
 */
export enum ProductBrandStatus {
  ENABLED = 'ENABLED',
  DISABLED = 'DISABLED'
}

// 重新导出商品SPU和SKU状态枚举（从mall模块）
export { ProductSpuStatus, ProductSkuStatus } from '../mall/enums'
