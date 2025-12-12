/**
 * Zod 验证工具函数（前端）
 * 用于在 Vue 组件中使用 Zod Schema 进行表单验证
 */

import { validate, formatValidationErrors, ValidationResult } from '@skeleton/shared-types'

/**
 * 验证表单数据
 * @param schema Zod Schema
 * @param formData 表单数据
 * @returns 验证结果
 */
export function validateForm<T>(
  schema: any,
  formData: unknown
): ValidationResult<T> {
  return validate<T>(schema, formData)
}

/**
 * 验证表单并返回错误对象（适用于 Element Plus 表单验证）
 * @param schema Zod Schema
 * @param formData 表单数据
 * @returns 错误对象，格式：{ fieldName: 'error message' }
 */
export function validateFormErrors<T>(
  schema: any,
  formData: unknown
): Record<string, string> | null {
  const result = validate<T>(schema, formData)
  
  if (result.success) {
    return null
  }
  
  if (result.errors) {
    return formatValidationErrors(result.errors)
  }
  
  return null
}

/**
 * 验证表单字段
 * @param schema Zod Schema
 * @param fieldName 字段名
 * @param value 字段值
 * @returns 错误消息，如果没有错误返回 null
 */
export function validateField(
  schema: any,
  fieldName: string,
  value: unknown
): string | null {
  try {
    // 创建一个只包含当前字段的临时 schema
    const fieldSchema = schema.shape?.[fieldName]
    if (!fieldSchema) {
      return null
    }
    
    const result = fieldSchema.safeParse(value)
    if (!result.success) {
      return result.error.issues[0]?.message || '验证失败'
    }
    
    return null
  } catch (error) {
    return '验证失败'
  }
}

/**
 * 为 Element Plus 表单生成验证规则
 * @param schema Zod Schema
 * @returns Element Plus 表单验证规则对象
 */
export function generateFormRules(schema: any): Record<string, any[]> {
  const rules: Record<string, any[]> = {}
  
  // 这里需要根据 Zod Schema 的结构生成对应的 Element Plus 验证规则
  // 由于 Zod Schema 的结构比较复杂，建议直接使用 validateFormErrors 函数
  
  return rules
}
