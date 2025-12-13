/**
 * 用户相关 DTO 类型定义
 */
import type { User } from './index'
import type { Role } from '../role'
import { UserStatus, UserGender } from '../../enums'

/**
 * 创建用户请求参数
 */
export interface CreateUserDto {
  username: string
  password: string
  email?: string
  nickname?: string
  phone?: string
  avatar?: string
  bio?: string
  gender?: UserGender
  birthdate?: string // YYYY-MM-DD
  roles?: string[] // 角色ID数组
}

/**
 * 更新用户请求参数
 */
export interface UpdateUserDto {
  username?: string
  password?: string
  email?: string
  nickname?: string
  phone?: string
  avatar?: string
  bio?: string
  gender?: UserGender
  birthdate?: string // YYYY-MM-DD
  status?: UserStatus
  roles?: string[] // 角色ID数组
}

/**
 * 修改密码请求参数
 */
export interface ChangePasswordDto {
  oldPassword: string
  newPassword: string
}

/**
 * 修改手机号请求参数
 */
export interface ChangePhoneDto {
  phone: string
  password: string
}

/**
 * 用户查询参数
 */
export interface UserQueryDto {
  page?: number
  limit?: number
  sort_by?: string
  sort_order?: 'ASC' | 'DESC'
  username?: string
  email?: string
  phone?: string
  status?: UserStatus
  gender?: UserGender
}

/**
 * 用户响应数据（包含角色信息，使用驼峰命名）
 */
export interface UserResponseDto {
  id: string
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date | null
  username: string
  email?: string
  phone?: string
  avatar?: string
  status: string
  roles?: Role[]
}

/**
 * 登录请求参数
 */
export interface LoginDto {
  username: string
  password: string
}

/**
 * 登录响应数据
 */
export interface LoginResponseDto {
  access_token: string
  user: UserResponseDto
}

/**
 * 注册请求参数
 */
export interface RegisterDto {
  username: string
  password: string
  email?: string
  phone?: string
  nickname?: string
  avatar?: string
  bio?: string
}

/**
 * 注册响应数据（使用驼峰命名，符合前端习惯）
 */
export interface RegisterResponseDto {
  id: string
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date | null
  username: string
  email?: string
  phone?: string
  avatar?: string
  status: string
}

/**
 * 用户资料响应数据
 */
export interface ProfileResponseDto extends UserResponseDto {}

/**
 * 更新用户资料请求参数
 */
export interface UpdateProfileDto {
  email?: string
  phone?: string
  nickname?: string
  avatar?: string
  bio?: string
  gender?: UserGender
  birthdate?: string
}

/**
 * 分配角色请求参数
 */
export interface AssignRolesDto {
  roles: string[] // 角色ID数组
}
