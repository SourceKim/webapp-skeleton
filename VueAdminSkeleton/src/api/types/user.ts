/**
 * 用户相关类型定义
 * 使用 @skeleton/shared-types 中的统一类型定义
 */
import type { PaginationQuery } from './common';
import type {
  User,
  Role,
  Permission,
  UserStatus,
  UserGender
} from '@skeleton/shared-types';

// 重新导出 shared-types 中的类型和枚举（供外部使用）
export type { UserStatus, UserGender, User, Role, Permission };

/**
 * 登录请求参数
 */
export interface LoginDto {
  username: string;
  password: string;
}

/**
 * 登录响应数据
 */
export interface LoginResponseDto {
  access_token: string;
  user: User;
}

/**
 * 注册请求参数
 */
export interface RegisterDto {
  username: string;
  password: string;
  email?: string;
  phone?: string;
  nickname?: string;
  avatar?: string;
  bio?: string;
}

/**
 * 注册响应数据
 */
export interface RegisterResponseDto extends User {}

/**
 * 用户资料响应数据
 */
export interface ProfileResponseDto extends User {}

/**
 * 更新用户资料请求参数
 */
export interface UpdateProfileDto {
  email?: string;
  phone?: string;
  nickname?: string;
  avatar?: string;
  bio?: string;
}

/**
 * 创建用户请求参数
 */
export interface CreateUserDto {
  username: string;
  password: string;
  email?: string;
  nickname?: string;
  phone?: string;
  avatar?: string;
  bio?: string;
  roles?: string[];
}

/**
 * 管理员更新用户请求参数
 */
export interface AdminUpdateUserDto {
  email?: string;
  nickname?: string;
  phone?: string;
  avatar?: string;
  bio?: string;
  status?: UserStatus;
  roles?: string[];
}

/**
 * 用户查询参数
 */
export interface UserQueryDto extends PaginationQuery {
  username?: string;
  email?: string;
  status?: UserStatus;
}

/**
 * 角色响应数据
 */
export interface RoleResponseDto {
  id: string;
  name: string;
  description?: string;
  permissions: Permission[];
  created_at: string;
  updated_at: string;
}

/**
 * 创建角色请求参数
 */
export interface CreateRoleDto {
  name: string;
  description?: string;
}

/**
 * 更新角色请求参数
 */
export interface UpdateRoleDto {
  name?: string;
  description?: string;
}

/**
 * 分配权限请求参数
 */
export interface AssignPermissionsDto {
  permissions: string[];
}

/**
 * 分配角色请求参数
 */
export interface AssignRolesDto {
  roles: string[];
}

/**
 * 用户角色响应数据
 */
export interface UserRolesResponseDto {
  id: string;
  username: string;
  roles: Role[];
  updated_at: string;
} 