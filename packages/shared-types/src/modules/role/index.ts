/**
 * 角色相关类型定义
 */
import { BaseEntity } from '../../base'
import type { Permission } from '../permission'

/**
 * 角色实体接口
 */
export interface Role extends BaseEntity {
  name: string
  description?: string
  permissions?: Permission[] // 关联权限
}

// 导出 DTO 类型
export * from './dto'

// 导出验证规则
export * from './validation'
