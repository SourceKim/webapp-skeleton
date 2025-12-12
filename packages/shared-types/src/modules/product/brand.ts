/**
 * 商品品牌相关类型定义
 */
import { BaseEntity } from '../../base'
import { ProductBrandStatus } from './enums'
import type { Material } from '../material'

/**
 * 商品品牌实体接口
 */
export interface ProductBrand extends BaseEntity {
  name: string
  description?: string
  material_id?: string | null
  material?: Material | null // 关联素材
  website?: string
  status: ProductBrandStatus
}
