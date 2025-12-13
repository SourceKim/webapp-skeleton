/**
 * 素材相关 DTO 类型定义
 */
import type { Material, MaterialCategory, MaterialTag } from './index'
import type { User } from '../user'
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
 * 素材响应数据（使用驼峰命名，符合前端习惯）
 */
export interface MaterialResponseDto {
  id: string
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date | null
  filename?: string
  originalName?: string
  filePath?: string
  mimeType?: string
  fileSize?: number
  type: MaterialType
  description?: string
  materialCategory?: MaterialCategory
  materialTags?: MaterialTag[]
  user?: User
  isPublic: boolean
  uploadDir?: string
  metadata?: Record<string, any>
  parentId?: string
  accessCount: number
  fileHash?: string
  url?: string // 访问URL（前端计算）
}

/**
 * 创建素材标签请求参数
 */
export interface CreateMaterialTagDto {
  name: string
  description?: string
}

/**
 * 更新素材标签请求参数
 */
export interface UpdateMaterialTagDto {
  name?: string
  description?: string
}

/**
 * 创建素材分类请求参数
 */
export interface CreateMaterialCategoryDto {
  name: string
  description?: string
}

/**
 * 更新素材分类请求参数
 */
export interface UpdateMaterialCategoryDto {
  name?: string
  description?: string
}

/**
 * 素材分类响应数据（使用驼峰命名，符合前端习惯）
 */
export interface MaterialCategoryResponseDto {
  id: string
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date | null
  name: string
  description?: string
}

/**
 * 素材标签响应数据（使用驼峰命名，符合前端习惯）
 */
export interface MaterialTagResponseDto {
  id: string
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date | null
  name: string
  description?: string
}
