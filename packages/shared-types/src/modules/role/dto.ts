/**
 * 角色相关 DTO 类型定义
 */
import type { Role } from './index'
import type { Permission } from '../permission'

/**
 * 创建角色请求参数
 */
export interface CreateRoleDto {
  name: string
  description?: string
}

/**
 * 更新角色请求参数
 */
export interface UpdateRoleDto {
  name?: string
  description?: string
}

/**
 * 角色查询参数
 */
export interface RoleQueryDto {
  page?: number
  limit?: number
  sort_by?: string
  sort_order?: 'ASC' | 'DESC'
  name?: string
}

/**
 * 角色响应数据（包含权限信息）
 */
export interface RoleResponseDto extends Role {
  permissions?: Permission[]
}

/**
 * 分配权限请求参数
 */
export interface AssignPermissionsDto {
  permissionIds: string[] // 权限ID数组
}
