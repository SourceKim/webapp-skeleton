/**
 * 商品属性相关类型定义
 */
import { BaseEntity } from '../../base'
import type { ProductSpu } from './spu'
import type { Material } from '../material'

/**
 * 商品属性值实体接口
 */
export interface ProductAttributeValue extends BaseEntity {
  attribute_key_id: string
  attribute_key?: ProductAttributeKey // 关联属性键
  value: string
  value_id: string
  image_id?: string | null
  image?: Material | null // 关联图片素材
}

/**
 * 商品属性键实体接口
 */
export interface ProductAttributeKey extends BaseEntity {
  spu_id: string
  spu?: ProductSpu // 关联商品SPU
  name: string
  key: string
  required: boolean
  values?: ProductAttributeValue[] // 关联属性值
}

/**
 * 商品SKU属性关联实体接口
 */
export interface ProductSkuAttribute extends BaseEntity {
  sku_id: string
  sku?: any // 关联商品SKU（避免循环引用）
  attribute_key_id: string
  attribute_key?: ProductAttributeKey // 关联属性键
  attribute_value_id: string
  attribute_value?: ProductAttributeValue // 关联属性值
}
