import type { ProductSku as IProductSku } from '@skeleton/shared-types'

/**
 * 商品SKU类型定义
 * 使用 @skeleton/shared-types 中的统一类型定义
 */
export type { ProductSku } from '@skeleton/shared-types'

// 扩展 ProductSku 接口，添加前端特定字段
export interface ProductSku extends IProductSku {
  status: string | IProductSku['status'] // 后端可能返回中文或枚举值
  created_at?: string | Date
  updated_at?: string | Date
}

export interface CreateProductSkuDto {
  spu_id: string
  sku_code: string
  sku_name?: string
  price: string
  original_price?: string
  cost_price?: string
  stock: number
  status?: 'ON_SHELF' | 'OFF_SHELF'
  is_default?: boolean
}

export interface UpdateProductSkuDto {
  sku_code?: string
  sku_name?: string
  price?: string
  original_price?: string | null
  cost_price?: string | null
  stock?: number
  status?: 'ON_SHELF' | 'OFF_SHELF'
  is_default?: boolean
}


