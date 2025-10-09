import i18n from '@/i18n'
import { useLocaleStore } from '@/stores/locale'
import type { CommonFormColumn } from '@/components/interface/form'
import type { CommonTableColumn } from '@/components/interface/table'

const { t } = i18n.global

/**
 * 生成默认的placeholder
 * @param column 表单列配置
 * @returns 处理后的列配置
 */
export function generatePlaceholder<T extends object>(column: CommonFormColumn<T>) {
  if (!column?.prop) return
  
  const type = column.type ?? 'input'
  
  if (!Object.prototype.hasOwnProperty.call(column, 'placeholder')) {
    const label = column.label ?? ''
    
    if (['select', 'cascader', 'year', 'month', 'date', 'dates', 'datetime', 'week', 'icon'].includes(type)) {
      column.placeholder = t('comp.form.pleaseSelect', { label })
    } else if (['datetimerange', 'daterange', 'monthrange'].includes(type)) {
      column.startPlaceholder = column.startPlaceholder ?? label + '起'
      column.endPlaceholder = column.endPlaceholder ?? label + '止'
    } else if (['input', 'textarea'].includes(type)) {
      column.placeholder = t('comp.form.pleaseInput', { label })
    }
  }
  
  return column
}

/**
 * 自动计算labelWidth，以最长label字符宽度作为form的labelWidth
 * @param columns 表单或表格列配置
 * @returns 计算出的宽度
 */
export function generateLabelWidth<T extends object>(
  ...columns: (CommonFormColumn<T> | CommonTableColumn<T>)[]
): number {
  const charWidth = useLocaleStore().getCurrentLocale().getCharWidth()
  
  return (
    Math.max(
      ...columns
        .filter((i) => !i.hidden)
        .map((column) => {
          let width = column.label?.length ?? 0
          width *= charWidth
          
          // 有备注疑问的加上额外宽度
          if (column.comment) width += 18
          // 有必填*的加上额外宽度
          if (column.required) width += 12
          // 有排序的加上额外宽度
          if (column.sortable) width += 24
          
          return width
        })
    ) + 28
  )
} 