/**
 * 通用验证工具函数
 * 封装 Zod Schema 的常用验证逻辑
 */

import { z } from 'zod'

/**
 * 验证结果接口
 */
export interface ValidationResult<T = any> {
  success: boolean
  data?: T
  errors?: Array<{
    path: (string | number | symbol)[]
    message: string
  }>
}

/**
 * 使用 Zod Schema 验证数据
 * @param schema Zod Schema
 * @param data 要验证的数据
 * @returns 验证结果
 */
export function validate<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): ValidationResult<T> {
  const result = schema.safeParse(data)
  
  if (result.success) {
    return {
      success: true,
      data: result.data
    }
  }
  
  return {
    success: false,
    errors: result.error.issues.map((err: z.ZodIssue) => ({
      path: err.path as (string | number)[],
      message: err.message
    }))
  }
}

/**
 * 验证并抛出错误（如果验证失败）
 * @param schema Zod Schema
 * @param data 要验证的数据
 * @returns 验证后的数据
 * @throws 如果验证失败，抛出包含错误信息的异常
 */
export function validateOrThrow<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): T {
  return schema.parse(data)
}

/**
 * 异步验证数据（支持异步 Schema）
 * @param schema Zod Schema
 * @param data 要验证的数据
 * @returns Promise<验证结果>
 */
export async function validateAsync<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): Promise<ValidationResult<T>> {
  const result = await schema.safeParseAsync(data)
  
  if (result.success) {
    return {
      success: true,
      data: result.data
    }
  }
  
  return {
    success: false,
    errors: result.error.issues.map((err: z.ZodIssue) => ({
      path: err.path as (string | number)[],
      message: err.message
    }))
  }
}

/**
 * 格式化验证错误为对象（按字段名分组）
 * @param errors Zod 错误数组
 * @returns 按字段名分组的错误对象
 */
export function formatValidationErrors(
  errors: Array<{ path: (string | number)[]; message: string }>
): Record<string, string> {
  const formatted: Record<string, string> = {}
  
  for (const error of errors) {
    const field = error.path.join('.')
    formatted[field] = error.message
  }
  
  return formatted
}

/**
 * 获取第一个验证错误消息
 * @param errors Zod 错误数组
 * @returns 第一个错误消息
 */
export function getFirstError(
  errors: Array<{ path: (string | number)[]; message: string }>
): string | undefined {
  return errors[0]?.message
}

/**
 * 分页查询参数基础 Schema
 */
export const paginationQuerySchema = z.object({
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().optional(),
  sort_by: z.string().optional(),
  sort_order: z.enum(['ASC', 'DESC']).optional()
})

/**
 * ID 参数验证 Schema
 */
export const idParamSchema = z.object({
  id: z.string()
    .min(1, 'ID不能为空')
    .max(36, 'ID长度不能超过36个字符')
})
