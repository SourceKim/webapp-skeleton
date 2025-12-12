/**
 * 商品相关类型定义
 */
import { BaseEntity } from '../../base'
import { ProductSpuStatus, ProductSkuStatus } from './enums'
import type { Material } from '../material'

/**
 * 商品SKU属性键值对接口
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
  sku_attributes?: SkuAttributeKV[] // SKU属性
}

/**
 * 商品SPU实体接口
 */
export interface ProductSpu extends BaseEntity {
  name: string
  sub_title?: string
  description?: string
  category_id?: string
  category?: any // 关联分类（避免循环引用）
  brand_id?: string
  brand?: any // 关联品牌（避免循环引用）
  status: ProductSpuStatus
  main_material_id?: string
  main_material?: Material | null // 关联主素材
  sub_materials?: Material[] | null // 关联子素材
  detail_content?: string | null
}
