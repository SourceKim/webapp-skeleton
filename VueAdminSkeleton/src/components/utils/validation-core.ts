import {
  validateRequired,
  validateType,
  validatePattern,
  validateDateFormat,
  validateMaxLength,
  validateMinLength,
  validateMin,
  validateMax,
  validateItemList
} from './validation-rules'
import type {
  FieldRule,
  FieldValidResult,
  RuleObject,
  UnknownFieldRule,
  ValidResult,
  ValidRule
} from '@/components/interface/validate'

/**
 * 通过FieldRule规则数组或者规则对象来验证对象数据
 * @param formData 表单数据
 * @param fieldRules 验证规则
 * @returns 验证结果
 */
export default async function validate<T extends object>(
  formData: T,
  fieldRules: RuleObject<T> | UnknownFieldRule<T, keyof T>[]
): Promise<ValidResult<T>> {
  const formPromiseArr = Object.values(fieldRules)
    .filter((i) => i.prop && i.rules)
    .map((i) => i as FieldRule<T, keyof T>)
    .map((i) => fieldValid(i, formData[i.prop], formData))

  const results = await Promise.all(formPromiseArr)
  const errFields = results.filter((i) => !i.result)
  
  return {
    error: !!errFields.length,
    success: !errFields.length,
    errFields
  }
}

/**
 * 单个字段多个rules验证
 * @param fieldRule 字段规则
 * @param val 字段值
 * @param formData 表单数据
 * @returns 验证结果
 */
export async function fieldValid<T extends object>(
  fieldRule: FieldRule<T, keyof T>,
  val: T[keyof T],
  formData?: T
): Promise<FieldValidResult<T, keyof T>> {
  const rules = fieldRule.rules instanceof Array ? fieldRule.rules : [fieldRule.rules ?? {}]
  const rulePromiseArr = rules.map((rule) => ruleValid(fieldRule, rule, val, formData))
  
  const results = await Promise.all(rulePromiseArr)
  const errMsg = results.filter((i) => i).join(';')
  
  return {
    prop: fieldRule.prop,
    value: val,
    result: !errMsg,
    errMsg
  }
}

/**
 * 单个rule验证
 * @param fieldRule 字段规则
 * @param rule 验证规则
 * @param val 字段值
 * @param formData 表单数据
 * @returns 错误信息，无错误返回空字符串
 */
export async function ruleValid<T extends object>(
  fieldRule: FieldRule<T, keyof T>,
  rule: ValidRule<T, keyof T> = {},
  val: T[keyof T],
  formData?: T
): Promise<string> {
  const formValue: any = val ?? ''
  
  try {
    // 验证必填项
    const requiredError = validateRequired(fieldRule, rule, formValue)
    if (requiredError) return requiredError
    
    // 如果值为空且不是自定义验证器，则跳过后续验证
    if (!formValue && !rule.validator) return ''
    
    // 验证数据类型
    const typeError = validateType(fieldRule, rule, formValue)
    if (typeError) return typeError
    
    // 验证正则表达式
    const patternError = validatePattern(fieldRule, rule, formValue)
    if (patternError) return patternError
    
    // 验证日期格式
    const dateError = validateDateFormat(fieldRule, rule, formValue)
    if (dateError) return dateError
    
    // 验证最大长度
    const maxLengthError = validateMaxLength(fieldRule, rule, formValue)
    if (maxLengthError) return maxLengthError
    
    // 验证最小长度
    const minLengthError = validateMinLength(fieldRule, rule, formValue)
    if (minLengthError) return minLengthError
    
    // 验证最小值
    const minError = validateMin(fieldRule, rule, formValue)
    if (minError) return minError
    
    // 验证最大值
    const maxError = validateMax(fieldRule, rule, formValue)
    if (maxError) return maxError
    
    // 验证下拉选项
    const itemListError = validateItemList(fieldRule, rule, formValue, formData)
    if (itemListError) return itemListError
    
    // 自定义验证方法
    if (rule.validator) {
      return new Promise<string>((resolve) => {
        rule.validator!(rule, formValue, (e) => {
          resolve(e instanceof Error ? e.message : '')
        }, formData)
      })
    }
    
    return ''
  } catch (error) {
    return error as string
  }
} 