import { ruleValid } from './validation-core'
import type { CommonFormColumn } from '@/components/interface/form'
import type { ValidRule } from '@/components/interface/validate'

/**
 * 增强el-form表单验证
 * @param column 表单列配置
 * @param formData 表单数据
 * @returns 验证规则数组
 */
export function generateFormRules<T extends object>(
  column: CommonFormColumn<T>,
  formData: T
): ValidRule<T, keyof T>[] | undefined {
  const rules = getRules(column)
  if (!rules) return
  
  return rules.map((i) => {
    return {
      required: i.required,
      validator: async (rule, value, callback) => {
        const errMsg = await ruleValid(
          {
            label: column.label,
            prop: column.prop! as keyof T,
            rules
          },
          i,
          value,
          formData
        )
        if (errMsg) callback(Error(errMsg?.toString()))
        else callback()
      },
      trigger: i.trigger ?? 'blur'
    }
  })
}

/**
 * 设置验证规则
 * @param column 包含rules的列配置
 * @returns 处理后的规则数组
 */
export function getRules<T extends object>(column: Pick<CommonFormColumn<T>, 'rules'>) {
  if (!column.rules) return
  
  let rules = column.rules
  if (!(rules instanceof Array)) {
    rules = [rules]
  }
  
  return rules
} 