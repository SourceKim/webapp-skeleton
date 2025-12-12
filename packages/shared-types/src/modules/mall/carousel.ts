/**
 * 轮播图相关类型定义
 */
import { BaseEntity } from '../../base'
import type { Material } from '../material'
import type { ProductSpu } from '../product'

/**
 * 轮播图实体接口
 */
export interface Carousel extends BaseEntity {
  title?: string
  material_id: string
  material?: Material // 关联素材
  spu_id?: string
  spu?: ProductSpu // 关联商品SPU
  sort_order: number
  is_active: boolean
}
