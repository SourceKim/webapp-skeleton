import type { Material } from '../material/material.d'
import type { ProductSpu as IProductSpu } from '@skeleton/shared-types'

/**
 * 商品SPU类型定义
 * 使用 @skeleton/shared-types 中的统一类型定义
 */
export type { ProductSpu } from '@skeleton/shared-types'

// 扩展 ProductSpu 接口，添加前端特定字段
export interface ProductSpu extends IProductSpu {
  category?: { name: string }
  brand?: { name: string }
  status: string | IProductSpu['status'] // 后端可能返回中文或枚举值
  createdAt?: string | Date
  updatedAt?: string | Date
}

export interface CreateProductSpuDto {
  name: string
  sub_title?: string
  description?: string
  category_id?: string
  brand_id?: string
  status?: 'DRAFT' | 'ON_SHELF' | 'OFF_SHELF'
  main_material_id?: string
  sub_material_ids?: string[]
  detail_content?: string
}

export interface UpdateProductSpuDto {
  name?: string
  sub_title?: string
  description?: string
  category_id?: string | null
  brand_id?: string | null
  status?: 'DRAFT' | 'ON_SHELF' | 'OFF_SHELF'
  main_material_id?: string | null
  sub_material_ids?: string[] | null
  detail_content?: string | null
}


