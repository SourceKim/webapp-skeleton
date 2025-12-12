/**
 * 商品SKU相关类型定义
 */
import { BaseEntity } from '../../base'
import { ProductSkuStatus } from './enums'
import type { ProductSpu } from './spu'
import type { ProductSkuAttribute } from './attribute'

/**
 * 商品SKU属性键值对接口（用于前端展示）
 */
export interface SkuAttributeKV {
  key_id: string
  value_id: string
  key_name?: string
  value?: string
}

/**
 * 商品SKU实体接口
 */
export interface ProductSku extends BaseEntity {
  spu_id: string
  spu?: ProductSpu // 关联商品SPU
  sku_code: string
  sku_name?: string
  price: string
  original_price?: string | null
  cost_price?: string | null
  stock: number
  status: ProductSkuStatus
  is_default: boolean
  sku_attributes?: ProductSkuAttribute[] // SKU属性关联
}
