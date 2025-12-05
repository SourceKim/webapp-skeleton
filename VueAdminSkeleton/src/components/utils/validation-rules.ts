import { isEmpty } from 'lodash-es'
import { getItemListRef } from './form-component'
import { datatype } from './validation-types'
import type { Ref } from 'vue'
import type { FieldRule, ValidRule } from '@/components/interface/validate'
import type { CommonItemData } from '@/components/interface'
import i18n from '@/i18n'
import dayjs from 'dayjs'

const { t } = (i18n as any).global

/**
 * 验证必填项
 */
export function validateRequired<T extends object>(
  fieldRule: FieldRule<T, keyof T>,
  rule: ValidRule<T, keyof T>,
  formValue: any
): string | null {
  if (!rule.required) return null
  
  if ((formValue instanceof Array && formValue?.length === 0) || isEmpty(formValue + '')) {
    return rule.message ?? t('comp.form.rules.beEmpty', { label: fieldRule.label ?? '' })
  }
  
  return null
}

/**
 * 验证数据类型
 */
export function validateType<T extends object>(
  fieldRule: FieldRule<T, keyof T>,
  rule: ValidRule<T, keyof T>,
  formValue: any
): string | null {
  if (!rule.type) return null
  
  const typeFilter = datatype[rule.type]
  if (!typeFilter) {
    return rule.type + ' not defined!'
  }
  
  if (typeFilter instanceof RegExp) {
    if (!typeFilter.test(formValue)) {
      return rule.message ?? t('comp.form.rules.wrongFormat', { label: fieldRule.label ?? '' })
    }
  } else {
    const result = typeFilter(formValue)
    if (!result) {
      return rule.message ?? t('comp.form.rules.wrongFormat', { label: fieldRule.label ?? '' })
    }
  }
  
  return null
}

/**
 * 验证正则表达式
 */
export function validatePattern<T extends object>(
  fieldRule: FieldRule<T, keyof T>,
  rule: ValidRule<T, keyof T>,
  formValue: any
): string | null {
  if (!rule.pattern) return null
  
  if (!rule.pattern.test(formValue)) {
    return rule.message ?? t('comp.form.rules.wrongFormat', { label: fieldRule.label ?? '' })
  }
  
  return null
}

/**
 * 验证日期格式
 */
export function validateDateFormat<T extends object>(
  fieldRule: FieldRule<T, keyof T>,
  rule: ValidRule<T, keyof T>,
  formValue: any
): string | null {
  if (!rule.dateFormat) return null
  
  const day = dayjs(formValue)
  if (!day.isValid() || day.format(rule.dateFormat) !== formValue) {
    return rule.message ?? t('comp.form.rules.wrongFormat', { label: fieldRule.label ?? '' })
  }
  
  return null
}

/**
 * 验证最大长度
 */
export function validateMaxLength<T extends object>(
  fieldRule: FieldRule<T, keyof T>,
  rule: ValidRule<T, keyof T>,
  formValue: any
): string | null {
  if (!rule.maxlength) return null
  
  if (formValue.length > rule.maxlength) {
    return rule.message ?? t('comp.form.rules.maxlength', {
      label: fieldRule.label ?? '',
      maxlength: rule.maxlength
    })
  }
  
  return null
}

/**
 * 验证最小长度
 */
export function validateMinLength<T extends object>(
  fieldRule: FieldRule<T, keyof T>,
  rule: ValidRule<T, keyof T>,
  formValue: any
): string | null {
  if (!rule.minlength) return null
  
  if (formValue.length < rule.minlength) {
    return rule.message ?? t('comp.form.rules.minlength', {
      label: fieldRule.label ?? '',
      minlength: rule.minlength
    })
  }
  
  return null
}

/**
 * 验证最小值
 */
export function validateMin<T extends object>(
  fieldRule: FieldRule<T, keyof T>,
  rule: ValidRule<T, keyof T>,
  formValue: any
): string | null {
  if (rule.min === undefined && rule.min !== 0) return null
  
  const numValue = typeof rule.min === 'number' ? Number(formValue) : formValue
  const minValue = rule.min as any
  
  if (numValue < minValue) {
    return rule.message ?? t('comp.form.rules.min', { 
      label: fieldRule.label ?? '', 
      min: rule.min 
    })
  }
  
  return null
}

/**
 * 验证最大值
 */
export function validateMax<T extends object>(
  fieldRule: FieldRule<T, keyof T>,
  rule: ValidRule<T, keyof T>,
  formValue: any
): string | null {
  if (rule.max === undefined && rule.max !== 0) return null
  
  const numValue = typeof rule.max === 'number' ? Number(formValue) : formValue
  const maxValue = rule.max as any
  
  if (numValue > maxValue) {
    return rule.message ?? t('comp.form.rules.max', { 
      label: fieldRule.label ?? '', 
      max: rule.max 
    })
  }
  
  return null
}

/**
 * 验证下拉选项
 */
export function validateItemList<T extends object>(
  fieldRule: FieldRule<T, keyof T>,
  rule: ValidRule<T, keyof T>,
  formValue: any,
  formData?: T
): string | null {
  if (!rule.itemList) return null
  
  const itemList: Ref<CommonItemData[]> = getItemListRef({
    itemList: rule.itemList,
    labelKey: rule.labelKey,
    valueKey: rule.valueKey
  })
  
  const item = itemList.value.find((i) => i.label === formValue)
  
  if (item) {
    // 如果找到对应项，更新表单数据为对应的值
    if (formData?.[fieldRule.prop]) {
      formData[fieldRule.prop] = item.value as T[keyof T]
    }
    return null
  } else {
    return rule.message ?? t('comp.form.rules.valRestriction', {
      label: fieldRule.label ?? '',
      enums: itemList.value.map((i) => i.label)
    })
  }
} 