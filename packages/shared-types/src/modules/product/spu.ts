/**
 * 商品SPU相关类型定义
 */
import { BaseEntity } from '../../base'
import { ProductSpuStatus } from './enums'
import type { Material } from '../material'
import type { ProductCategory } from './category'
import type { ProductBrand } from './brand'

/**
 * 商品SPU实体接口
 */
export interface ProductSpu extends BaseEntity {
  name: string
  sub_title?: string
  description?: string
  category_id?: string | null
  category?: ProductCategory | null // 关联分类
  brand_id?: string | null
  brand?: ProductBrand | null // 关联品牌
  status: ProductSpuStatus
  main_material_id?: string | null
  main_material?: Material | null // 关联主素材
  sub_materials?: Material[] | null // 关联子素材
  detail_content?: string | null
}
