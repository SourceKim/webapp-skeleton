import type { Material } from '../material/material.d'
import type { ProductCategory as IProductCategory } from '@skeleton/shared-types'

/**
 * 商品分类类型定义
 * 使用 @skeleton/shared-types 中的统一类型定义
 */
export type { ProductCategory } from '@skeleton/shared-types'

// 扩展 ProductCategory 接口，添加前端特定字段
export interface ProductCategory extends IProductCategory {
  brand_name?: string
  status: string | IProductCategory['status'] // 后端可能返回中文或枚举值
  createdAt?: string | Date
  updatedAt?: string | Date
}

export interface CreateProductCategoryDto {
  name: string
  description?: string
  parent_id?: string
  material_id?: string
  brand_id?: string
  status?: 'ENABLED' | 'DISABLED'
}

export interface UpdateProductCategoryDto {
  name?: string
  description?: string
  parent_id?: string | null
  material_id?: string | null
  brand_id?: string | null
  status?: 'ENABLED' | 'DISABLED'
}
