/**
 * 权限相关 DTO 类型定义
 */
import type { Permission } from './index'

/**
 * 创建权限请求参数
 */
export interface CreatePermissionDto {
  name: string
  resource: string
  action: string
  description?: string
}

/**
 * 更新权限请求参数
 */
export interface UpdatePermissionDto {
  name?: string
  resource?: string
  action?: string
  description?: string
}

/**
 * 权限查询参数
 */
export interface PermissionQueryDto {
  page?: number
  limit?: number
  sort_by?: string
  sort_order?: 'ASC' | 'DESC'
  name?: string
  resource?: string
  action?: string
}
