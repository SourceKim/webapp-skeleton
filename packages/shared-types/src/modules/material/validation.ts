/**
 * 素材相关验证规则定义
 * 使用 Zod 进行前后端统一的验证
 */

import { z } from 'zod'
import { MaterialType } from '../../enums'

/**
 * 创建素材验证 Schema
 */
export const createMaterialSchema = z.object({
  categoryId: z.string()
    .max(36, '分类ID长度不能超过36个字符')
    .optional(),
  filename: z.string()
    .max(255, '文件名长度不能超过255个字符')
    .optional(),
  description: z.string().optional(),
  is_public: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
  metadata: z.record(z.any()).optional(),
  parent_id: z.string()
    .max(36, '父素材ID长度不能超过36个字符')
    .optional()
})

/**
 * 更新素材验证 Schema
 */
export const updateMaterialSchema = createMaterialSchema

/**
 * 素材查询参数验证 Schema
 */
export const materialQuerySchema = z.object({
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().optional(),
  sort_by: z.string().optional(),
  sort_order: z.enum(['ASC', 'DESC']).optional(),
  type: z.nativeEnum(MaterialType).optional(),
  categoryId: z.string().optional(),
  keyword: z.string().optional(),
  is_public: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
  userId: z.string().optional()
})
