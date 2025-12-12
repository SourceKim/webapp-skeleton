/**
 * 权限相关验证规则定义
 * 使用 Zod 进行前后端统一的验证
 */

import { z } from 'zod'

/**
 * 创建权限验证 Schema
 */
export const createPermissionSchema = z.object({
  name: z.string()
    .min(1, '权限名称不能为空')
    .max(100, '权限名称长度不能超过100个字符'),
  resource: z.string()
    .min(1, '资源名称不能为空')
    .max(100, '资源名称长度不能超过100个字符'),
  action: z.string()
    .min(1, '操作名称不能为空')
    .max(50, '操作名称长度不能超过50个字符'),
  description: z.string()
    .max(200, '描述长度不能超过200个字符')
    .optional()
})

/**
 * 更新权限验证 Schema
 */
export const updatePermissionSchema = createPermissionSchema.partial()

/**
 * 权限查询参数验证 Schema
 */
export const permissionQuerySchema = z.object({
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().optional(),
  sort_by: z.string().optional(),
  sort_order: z.enum(['ASC', 'DESC']).optional(),
  name: z.string().optional(),
  resource: z.string().optional(),
  action: z.string().optional()
})
