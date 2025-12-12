/**
 * 角色相关验证规则定义
 * 使用 Zod 进行前后端统一的验证
 */

import { z } from 'zod'

/**
 * 创建角色验证 Schema
 */
export const createRoleSchema = z.object({
  name: z.string()
    .min(1, '角色名称不能为空')
    .max(50, '角色名称长度不能超过50个字符'),
  description: z.string()
    .max(200, '描述长度不能超过200个字符')
    .optional()
})

/**
 * 更新角色验证 Schema
 */
export const updateRoleSchema = createRoleSchema.partial()

/**
 * 角色查询参数验证 Schema
 */
export const roleQuerySchema = z.object({
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().optional(),
  sort_by: z.string().optional(),
  sort_order: z.enum(['ASC', 'DESC']).optional(),
  name: z.string().optional()
})

/**
 * 分配权限验证 Schema
 */
export const assignPermissionsSchema = z.object({
  permissionIds: z.array(z.string())
    .min(1, '至少需要分配一个权限')
})

/**
 * 分配角色验证 Schema
 */
export const assignRolesSchema = z.object({
  roles: z.array(z.string())
    .min(1, '至少需要分配一个角色')
})
