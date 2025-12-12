/**
 * 用户相关类型定义
 */
import { BaseEntity } from '../../base'
import { UserStatus, UserGender } from '../../enums'
import type { Role } from '../role'

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
