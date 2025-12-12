/**
 * 素材相关 DTO 类型定义
 */
import type { Material } from './index'
import { MaterialType } from '../../enums'

/**
 * 创建素材请求参数
 */
export interface CreateMaterialDto {
  categoryId?: string
  filename?: string
  description?: string
  is_public?: boolean
  tags?: string[] // 标签ID数组
  metadata?: Record<string, any>
  parent_id?: string
}

/**
 * 更新素材请求参数
 */
export interface UpdateMaterialDto {
  filename?: string
  description?: string
  is_public?: boolean
  categoryId?: string
  tags?: string[] // 标签ID数组
  metadata?: Record<string, any>
  parent_id?: string
}

/**
 * 素材查询参数
 */
export interface MaterialQueryDto {
  page?: number
  limit?: number
  sort_by?: string
  sort_order?: 'ASC' | 'DESC'
  type?: MaterialType
  categoryId?: string
  keyword?: string
  is_public?: boolean
  tags?: string[] // 标签ID数组
  userId?: string
}

/**
 * 素材响应数据（包含额外字段）
 */
export interface MaterialResponseDto extends Material {
  url?: string // 访问URL（前端计算）
}
