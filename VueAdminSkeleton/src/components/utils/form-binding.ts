import type { CommonModelParam } from '@/components/interface'
import type { CommonFormColumn } from '@/components/interface/form'

/**
 * 生成双向绑定属性值
 * @param param 表单列参数
 * @param form 表单数据
 * @returns 双向绑定参数
 */
export function vModelValue<T extends object = Record<string, any>>(
  param: CommonFormColumn<T> & { prop: keyof T; prop2?: keyof T },
  form: T | undefined
) {
  const returnParam: CommonModelParam = {}
  
  if (!form || !param.prop) return returnParam
  
  // 日期区间需要单独处理
  if (['daterange', 'datetimerange', 'monthrange'].includes(param.type ?? '')) {
    if (!param.prop2) throw Error('prop2属性缺失')
    
    if (param.single) {
      // 日期区间拆分独立选择
      returnParam.start = (form as Record<string, any>)[param.prop as string]
      returnParam.end = (form as Record<string, any>)[param.prop2 as string]
      returnParam['onUpdate:start'] = (val) => {
        (form as Record<string, any>)[param.prop as string] = val
      }
      returnParam['onUpdate:end'] = (val) => {
        (form as Record<string, any>)[param.prop2 as string] = val
      }
    } else {
      const propValue = (form as Record<string, any>)[param.prop as string]
      const prop2Value = (form as Record<string, any>)[param.prop2 as string]
      
      if (propValue && prop2Value) {
        returnParam.modelValue = [propValue, prop2Value]
      } else {
        returnParam.modelValue = null
      }
      
      returnParam['onUpdate:modelValue'] = (val) => {
        if (val) {
          const [value, value2] = val
          ;(form as Record<string, any>)[param.prop as string] = value
          ;(form as Record<string, any>)[param.prop2 as string] = value2
        } else {
          ;(form as Record<string, any>)[param.prop as string] = null
          ;(form as Record<string, any>)[param.prop2 as string] = null
        }
      }
    }
  } else {
    returnParam.modelValue = (form as Record<string, any>)[param.prop as string]
    returnParam['onUpdate:modelValue'] = (val) => {
      (form as Record<string, any>)[param.prop as string] = val
    }
  }
  
  return returnParam
} 