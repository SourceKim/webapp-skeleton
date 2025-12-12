/**
 * 商品分类相关类型定义
 */
import { BaseEntity } from '../../base'
import { ProductCategoryStatus } from './enums'
import type { Material } from '../material'
import type { ProductBrand } from './brand'

/**
 * 商品分类实体接口
 */
export interface ProductCategory extends BaseEntity {
  name: string
  description?: string
  parent_id?: string | null
  parent?: ProductCategory | null // 关联父分类
  level: number
  material_id?: string | null
  material?: Material | null // 关联素材
  brand_id?: string | null
  brand?: ProductBrand | null // 关联品牌
  status: ProductCategoryStatus
}
