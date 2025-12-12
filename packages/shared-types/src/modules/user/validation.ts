/**
 * 用户相关验证规则定义
 * 使用 Zod 进行前后端统一的验证
 */

import { z } from 'zod'
import { UserGender, UserStatus } from '../../enums'

/**
 * 创建用户验证 Schema
 */
export const createUserSchema = z.object({
  username: z.string()
    .min(3, '用户名长度必须在3-100个字符之间')
    .max(100, '用户名长度必须在3-100个字符之间'),
  password: z.string()
    .min(6, '密码长度不能少于6个字符'),
  email: z.string()
    .email('邮箱格式不正确')
    .optional(),
  phone: z.string()
    .regex(/^1[3-9]\d{9}$/, '手机号格式不正确')
    .optional(),
  nickname: z.string()
    .max(100, '昵称长度必须在1-100个字符之间')
    .optional(),
  avatar: z.string().optional(),
  bio: z.string()
    .max(500, '简介长度不能超过500个字符')
    .optional(),
  gender: z.nativeEnum(UserGender).optional(),
  birthdate: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, '出生日期格式不正确，应为 YYYY-MM-DD')
    .optional(),
  roles: z.array(z.string()).optional()
})

/**
 * 更新用户验证 Schema
 */
export const updateUserSchema = createUserSchema.partial().extend({
  password: z.string()
    .min(6, '密码长度不能少于6个字符')
    .optional(),
  status: z.nativeEnum(UserStatus).optional()
})

/**
 * 登录验证 Schema
 */
export const loginSchema = z.object({
  username: z.string().min(1, '用户名不能为空'),
  password: z.string().min(1, '密码不能为空')
})

/**
 * 注册验证 Schema
 */
export const registerSchema = z.object({
  username: z.string()
    .min(3, '用户名长度必须在3-100个字符之间')
    .max(100, '用户名长度必须在3-100个字符之间'),
  password: z.string()
    .min(6, '密码长度不能少于6个字符'),
  email: z.string()
    .email('邮箱格式不正确')
    .optional(),
  phone: z.string()
    .regex(/^1[3-9]\d{9}$/, '手机号格式不正确')
    .optional(),
  nickname: z.string()
    .max(100, '昵称长度必须在1-100个字符之间')
    .optional(),
  avatar: z.string().optional(),
  bio: z.string()
    .max(500, '简介长度不能超过500个字符')
    .optional()
})

/**
 * 修改密码验证 Schema
 */
export const changePasswordSchema = z.object({
  oldPassword: z.string().min(1, '旧密码不能为空'),
  newPassword: z.string()
    .min(6, '新密码长度不能少于6个字符')
})

/**
 * 修改手机号验证 Schema
 */
export const changePhoneSchema = z.object({
  phone: z.string()
    .regex(/^1[3-9]\d{9}$/, '手机号格式不正确'),
  password: z.string().min(1, '密码不能为空')
})

/**
 * 更新用户资料验证 Schema
 */
export const updateProfileSchema = z.object({
  email: z.string()
    .email('邮箱格式不正确')
    .optional(),
  phone: z.string()
    .regex(/^1[3-9]\d{9}$/, '手机号格式不正确')
    .optional(),
  nickname: z.string()
    .max(100, '昵称长度必须在1-100个字符之间')
    .optional(),
  avatar: z.string().optional(),
  bio: z.string()
    .max(500, '简介长度不能超过500个字符')
    .optional(),
  gender: z.nativeEnum(UserGender).optional(),
  birthdate: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, '出生日期格式不正确，应为 YYYY-MM-DD')
    .optional()
})

/**
 * 用户查询参数验证 Schema
 */
export const userQuerySchema = z.object({
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().optional(),
  sort_by: z.string().optional(),
  sort_order: z.enum(['ASC', 'DESC']).optional(),
  username: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  status: z.nativeEnum(UserStatus).optional(),
  gender: z.nativeEnum(UserGender).optional()
})
