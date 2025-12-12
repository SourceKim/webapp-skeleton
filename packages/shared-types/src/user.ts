/**
 * 用户相关类型定义
 */
import { BaseEntity } from './base'
import { UserStatus, UserGender } from './enums'

/**
 * 权限实体接口（前向声明，避免循环引用）
 */
export interface Permission extends BaseEntity {
  name: string
  resource: string
  action: string
  description?: string
}

/**
 * 角色实体接口
 */
export interface Role extends BaseEntity {
  name: string
  description?: string
  permissions?: Permission[] // 关联权限
}

/**
 * 用户实体接口
 */
export interface User extends BaseEntity {
  username: string
  password?: string // 前端通常不需要密码字段
  email?: string
  nickname?: string
  phone?: string
  avatar?: string
  status: UserStatus
  bio?: string
  gender: UserGender
  birthdate?: string // YYYY-MM-DD
  roles?: Role[] // 关联角色
}
