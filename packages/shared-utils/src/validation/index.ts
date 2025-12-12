/**
 * 验证工具函数
 * 从 VueAdminSkeleton 中抽取的通用验证逻辑
 */

export interface FieldRule<T = any> {
  prop: keyof T
  rules: ValidRule[]
}

export interface ValidRule {
  required?: boolean
  type?: 'string' | 'number' | 'boolean' | 'array' | 'object'
  pattern?: RegExp | string
  dateFormat?: string
  maxLength?: number
  minLength?: number
  min?: number
  max?: number
  itemList?: Array<{ label: string; value: any }>
  message?: string
  validator?: (value: any, formData?: any) => boolean | string | Promise<boolean | string>
}

export interface ValidResult<T = any> {
  error: boolean
  success: boolean
  errFields: Array<{
    prop: keyof T
    message: string
  }>
}

/**
 * 常用数据类型验证正则表达式
 */
export const datatype = {
  // 手机号（中国大陆）
  mobile: /^1[3-9]\d{9}$/,
  // 邮箱
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  // URL
  url: /^https?:\/\/.+/,
  // 身份证号（18位）
  idCard: /^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]$/,
  // 中文
  chinese: /^[\u4e00-\u9fa5]+$/,
  // 数字
  number: /^\d+$/,
  // 正整数
  positiveInteger: /^[1-9]\d*$/,
  // 非负整数（包括0）
  nonNegativeInteger: /^\d+$/
} as const

/**
 * 验证必填项
 */
export function validateRequired(value: any, message?: string): string | true {
  if (value === null || value === undefined || value === '') {
    return message || '此字段为必填项'
  }
  if (Array.isArray(value) && value.length === 0) {
    return message || '此字段至少需要选择一个选项'
  }
  return true
}

/**
 * 验证数据类型
 */
export function validateType(
  value: any,
  type: ValidRule['type'],
  message?: string
): string | true {
  if (value === null || value === undefined || value === '') {
    return true // 空值由 required 验证
  }

  switch (type) {
    case 'string':
      return typeof value === 'string' ? true : (message || '此字段必须是字符串类型')
    case 'number':
      return typeof value === 'number' && !isNaN(value)
        ? true
        : (message || '此字段必须是数字类型')
    case 'boolean':
      return typeof value === 'boolean' ? true : (message || '此字段必须是布尔类型')
    case 'array':
      return Array.isArray(value) ? true : (message || '此字段必须是数组类型')
    case 'object':
      return typeof value === 'object' && !Array.isArray(value) && value !== null
        ? true
        : (message || '此字段必须是对象类型')
    default:
      return true
  }
}

/**
 * 验证正则表达式
 */
export function validatePattern(
  value: any,
  pattern: RegExp | string,
  message?: string
): string | true {
  if (value === null || value === undefined || value === '') {
    return true // 空值由 required 验证
  }

  const regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern
  return regex.test(String(value)) ? true : (message || '格式不正确')
}

/**
 * 验证最大长度
 */
export function validateMaxLength(
  value: any,
  maxLength: number,
  message?: string
): string | true {
  if (value === null || value === undefined || value === '') {
    return true
  }

  const length = Array.isArray(value) ? value.length : String(value).length
  return length <= maxLength
    ? true
    : (message || `长度不能超过 ${maxLength} 个字符`)
}

/**
 * 验证最小长度
 */
export function validateMinLength(
  value: any,
  minLength: number,
  message?: string
): string | true {
  if (value === null || value === undefined || value === '') {
    return true
  }

  const length = Array.isArray(value) ? value.length : String(value).length
  return length >= minLength
    ? true
    : (message || `长度不能少于 ${minLength} 个字符`)
}

/**
 * 验证最小值
 */
export function validateMin(value: any, min: number, message?: string): string | true {
  if (value === null || value === undefined || value === '') {
    return true
  }

  const num = Number(value)
  if (isNaN(num)) {
    return message || '必须是数字'
  }
  return num >= min ? true : (message || `值不能小于 ${min}`)
}

/**
 * 验证最大值
 */
export function validateMax(value: any, max: number, message?: string): string | true {
  if (value === null || value === undefined || value === '') {
    return true
  }

  const num = Number(value)
  if (isNaN(num)) {
    return message || '必须是数字'
  }
  return num <= max ? true : (message || `值不能大于 ${max}`)
}

/**
 * 验证选项列表
 */
export function validateItemList(
  value: any,
  itemList: Array<{ label: string; value: any }>,
  message?: string
): string | true {
  if (value === null || value === undefined || value === '') {
    return true
  }

  const validValues = itemList.map(item => item.value)
  const isArray = Array.isArray(value)
  const valuesToCheck = isArray ? value : [value]

  for (const val of valuesToCheck) {
    if (!validValues.includes(val)) {
      return message || '选择的选项不在允许的范围内'
    }
  }

  return true
}

/**
 * 单个规则验证
 */
export async function ruleValid(
  rule: ValidRule,
  value: any,
  formData?: any
): Promise<string | true> {
  // 自定义验证器优先级最高
  if (rule.validator) {
    const result = await rule.validator(value, formData)
    if (result === true) {
      return true
    }
    return typeof result === 'string' ? result : rule.message || '验证失败'
  }

  // 必填验证
  if (rule.required) {
    const requiredResult = validateRequired(value, rule.message)
    if (requiredResult !== true) {
      return requiredResult
    }
  }

  // 如果值为空且不是必填，跳过其他验证
  if (value === null || value === undefined || value === '') {
    return true
  }

  // 类型验证
  if (rule.type) {
    const typeResult = validateType(value, rule.type, rule.message)
    if (typeResult !== true) {
      return typeResult
    }
  }

  // 正则验证
  if (rule.pattern) {
    const patternResult = validatePattern(value, rule.pattern, rule.message)
    if (patternResult !== true) {
      return patternResult
    }
  }

  // 长度验证
  if (rule.maxLength !== undefined) {
    const maxLengthResult = validateMaxLength(value, rule.maxLength, rule.message)
    if (maxLengthResult !== true) {
      return maxLengthResult
    }
  }

  if (rule.minLength !== undefined) {
    const minLengthResult = validateMinLength(value, rule.minLength, rule.message)
    if (minLengthResult !== true) {
      return minLengthResult
    }
  }

  // 数值范围验证
  if (rule.min !== undefined) {
    const minResult = validateMin(value, rule.min, rule.message)
    if (minResult !== true) {
      return minResult
    }
  }

  if (rule.max !== undefined) {
    const maxResult = validateMax(value, rule.max, rule.message)
    if (maxResult !== true) {
      return maxResult
    }
  }

  // 选项列表验证
  if (rule.itemList) {
    const itemListResult = validateItemList(value, rule.itemList, rule.message)
    if (itemListResult !== true) {
      return itemListResult
    }
  }

  return true
}

/**
 * 单个字段验证
 */
export async function fieldValid<T>(
  fieldRule: FieldRule<T>,
  value: any,
  formData?: T
): Promise<{ prop: keyof T; result: boolean; message: string }> {
  const { prop, rules } = fieldRule

  for (const rule of rules) {
    const result = await ruleValid(rule, value, formData)
    if (result !== true) {
      return {
        prop,
        result: false,
        message: result
      }
    }
  }

  return {
    prop,
    result: true,
    message: ''
  }
}

/**
 * 表单验证主函数
 */
export async function validate<T extends Record<string, any>>(
  formData: T,
  fieldRules: FieldRule<T>[]
): Promise<ValidResult<T>> {
  const formPromiseArr = fieldRules.map(fieldRule =>
    fieldValid(fieldRule, formData[fieldRule.prop], formData)
  )

  const results = await Promise.all(formPromiseArr)
  const errFields = results.filter(i => !i.result)

  return {
    error: !!errFields.length,
    success: !errFields.length,
    errFields: errFields.map(i => ({
      prop: i.prop,
      message: i.message
    }))
  }
}
