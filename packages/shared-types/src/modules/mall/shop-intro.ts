/**
 * 店铺介绍相关类型定义
 */
import { BaseEntity } from '../../base'
import type { Material } from '../material'

/**
 * 店铺介绍横幅实体接口
 */
export interface ShopIntroBanner extends BaseEntity {
  shop_intro_id: string
  shop_intro?: ShopIntro // 关联店铺介绍
  material_id: string
  material?: Material // 关联素材
  sort_order: number
}

/**
 * 店铺介绍实体接口
 */
export interface ShopIntro extends BaseEntity {
  name: string
  introduction?: string
  detail?: string
  contact_phone?: string
  longitude?: number
  latitude?: number
  address?: string
  banners?: ShopIntroBanner[] // 关联横幅
}
