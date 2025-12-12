/**
 * 权限相关类型定义
 */
import { BaseEntity } from '../../base'

/**
 * 权限实体接口
 */
export interface Permission extends BaseEntity {
  name: string
  resource: string
  action: string
  description?: string
}

// 导出 DTO 类型
export * from './dto'
