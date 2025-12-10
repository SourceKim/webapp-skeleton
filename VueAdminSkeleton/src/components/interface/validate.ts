import type { CommonItemList } from '@/components/interface'

/**
 * 验证类型定义，定义好可以直接用type引用验证
 * 可以用正则对象，或者一个函数
 */
export const datatype = {
  phone: /^1\d{10}$/,
  email: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
  username: /^[\u4E00-\u9FA5A-Za-z]+$/,
  double: /^\d+(\.\d{1,2})?$/,
  vin: /^[A-Z0-9]{17}$/,
  int: /^(-?\d+)$/,
  number: /^(-?\d+)(\.\d+)?$/,
  idCard: /^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
  carNum:
    /^(([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z](([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z][A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳使领]))$/,
  required: (val: string) => !val?.length
}

/**
 * rule type 枚举类型
 */
export type DataType = keyof typeof datatype

/**
 * 验证规则
 */
export interface ValidRule<T extends object, K extends keyof T> {
  // 预先定制一些规则，方便使用
  type?: DataType
  // 是否必填
  required?: boolean
  // 正则验证
  pattern?: RegExp
  // 最小值
  min?: number | string
  // 最大值
  max?: number | string
  // 最大字符长度
  maxlength?: number
  // 最小字符长度
  minlength?: number
  // 枚举值验证
  itemList?: CommonItemList
  // 枚举验证时的 labelKey
  labelKey?: string
  // 枚举验证时的 valueKey
  valueKey?: string
  // 自定义校验函数
  validator?: RuleValidator<T, K>
  // 验证时机，仅表单验证有效
  trigger?: string | 'blur' | 'change'
  // 定制验证错误的消息
  message?: string
  // 日期格式验证，dayjs 格式
  dateFormat?: string
}

/**
 * 自定义验证函数
 */
export type RuleValidator<T extends object, K extends keyof T> = (
  rule: ValidRule<T, K>,
  val: T[K],
  callback: (errMsg?: Error) => void,
  formData?: T
) => void

/**
 * 单字段的验证规则
 */
export interface FieldRule<T extends object, K extends keyof T> {
  prop: K
  label?: string
  rules: ValidRule<T, K> | ValidRule<T, K>[]
}

/**
 * 单字段的验证规则（未知）
 */
export interface UnknownFieldRule<T extends object, K extends keyof T> {
  prop?: K
  label?: string
  rules?: ValidRule<T, K> | ValidRule<T, K>[]
}


/**
 * 验证规则对象
 */
export interface RuleObject<T extends object> {
  [prop: string]: UnknownFieldRule<T, keyof T>
}

/**
 * 验证结果
 */
export interface ValidResult<T extends object> {
  // 是否验证错误
  error: boolean
  // 是否验证成功
  success: boolean
  // 错误信息
  errFields: FieldValidResult<T, keyof T>[]
}

/**
 * 单字段验证结果
 */
export interface FieldValidResult<T, K extends keyof T> {
  // 字段property
  prop: K
  // 字段值
  value: T[K]
  // 验证结果
  result: boolean
  // 错误信息
  errMsg: string
}
