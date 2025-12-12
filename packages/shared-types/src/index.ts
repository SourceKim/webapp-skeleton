/**
 * @skeleton/shared-types
 * Skeleton 项目共享 TypeScript 类型定义
 */

// API 响应类型
export interface ApiResponse<T = any> {
  code?: number
  data: T
  message?: string
  error?: string
}

// 分页请求参数
export interface PaginationParams {
  page?: number
  pageSize?: number
  limit?: number
  offset?: number
}

// 分页响应数据
export interface PaginationResponse<T = any> {
  list: T[]
  total: number
  page: number
  pageSize: number
  totalPages?: number
}

// 通用 ID 类型
export type ID = string | number

// 时间戳类型
export type Timestamp = number | string | Date

// 通用实体基础字段
export interface BaseEntity {
  id: ID
  createdAt?: Timestamp
  updatedAt?: Timestamp
  deletedAt?: Timestamp | null
}

// 用户相关类型
export interface User extends BaseEntity {
  username: string
  email?: string
  phone?: string
  avatar?: string
  nickname?: string
  status?: 'active' | 'inactive' | 'banned'
}

// 角色相关类型
export interface Role extends BaseEntity {
  name: string
  code: string
  description?: string
  permissions?: string[]
}

// 权限相关类型
export interface Permission extends BaseEntity {
  name: string
  code: string
  resource: string
  action: string
  description?: string
}
