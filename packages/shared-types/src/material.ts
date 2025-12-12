/**
 * 素材相关类型定义
 */
import { BaseEntity } from './base'
import { MaterialType } from './enums'
import type { User } from './user'

/**
 * 素材实体接口
 */
export interface Material extends BaseEntity {
  filename?: string
  original_name?: string
  file_path?: string
  mime_type?: string
  file_size?: number
  type: MaterialType
  description?: string
  is_public: boolean
  upload_dir?: string
  user_id?: string
  user?: User // 关联用户
  material_category_id?: string
  material_category?: MaterialCategory // 关联分类
  material_tags?: MaterialTag[] // 关联标签
  metadata?: Record<string, any>
  parent_id?: string
  access_count: number
  file_hash?: string
}

/**
 * 素材分类实体接口
 */
export interface MaterialCategory extends BaseEntity {
  name: string
  description?: string
  materials?: Material[] // 关联素材
}

/**
 * 素材标签实体接口
 */
export interface MaterialTag extends BaseEntity {
  name: string
  description?: string
  materials?: Material[] // 关联素材
}
