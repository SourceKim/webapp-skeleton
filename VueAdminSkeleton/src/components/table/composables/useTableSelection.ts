import { ref, type Ref } from 'vue'
import { isUndefined } from 'lodash-es'
import type { TableSelectionMode } from '../types'
import type { CommonTableColumn } from '@/components/interface/table'

/**
 * 表格选择逻辑
 */
export function useTableSelection<T extends object>(props: {
  selection?: TableSelectionMode
  selectionLimit?: number
}) {
  // 选中行的数据
  const selectionRows: Ref<T[]> = ref([])

  // 处理选中事件
  function selectionChange(rows: T[]) {
    selectionRows.value = rows
    return selectionRows.value
  }

  // 处理行点击事件
  function rowClick(row: T, _column: CommonTableColumn<T>, _event: Event) {
    if (props.selection === 'single') {
      selectionRows.value = [row]
      return selectionRows.value
    } else if (props.selection === 'multiple') {
      // 多选逻辑可以在这里扩展
    }
    return selectionRows.value
  }

  // 判断行是否可选择
  function selectable(row: T): boolean {
    if (isUndefined(props.selectionLimit)) return true
    if (selectionRows.value.length >= props.selectionLimit) {
      return selectionRows.value.some((i) => i === row)
    }
    return true
  }

  return {
    selectionRows,
    selectionChange,
    rowClick,
    selectable
  }
} 