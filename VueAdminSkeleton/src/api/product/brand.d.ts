import type { ProductBrand as IProductBrand } from '@skeleton/shared-types'

/**
 * 商品品牌类型定义
 * 使用 @skeleton/shared-types 中的统一类型定义
 */
export type { ProductBrand } from '@skeleton/shared-types'

// 扩展 ProductBrand 接口，添加前端特定字段
export interface ProductBrand extends IProductBrand {
  status: string | IProductBrand['status'] // 后端可能返回中文或枚举值
  createdAt?: string | Date
  updatedAt?: string | Date
}

export interface CreateProductBrandDto {
  name: string
  description?: string
  material_id?: string
  website?: string
  status?: 'ENABLED' | 'DISABLED'
}

export interface UpdateProductBrandDto {
  name?: string
  description?: string
  material_id?: string
  website?: string
  status?: 'ENABLED' | 'DISABLED'
}


