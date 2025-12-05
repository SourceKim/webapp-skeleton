import { isRef } from 'vue'
import type { CommonItemData } from '@/components/interface'
import type { TableColumn } from '@/components/interface/table'

/**
 * 生成默认的formatter函数
 * @param tableColumParams 表格列参数
 */
export function generateFormatter<T extends object>(tableColumParams: TableColumn<T>) {
  // itemList需要转化一下显示
  if (tableColumParams.itemList) {
    tableColumParams.formatter ??= (_row, _column, cellValue) => {
      const itemList = (
        isRef(tableColumParams.itemList) ? tableColumParams.itemList.value : tableColumParams.itemList
      ) as CommonItemData[]
      return itemList.find((i) => i.value === cellValue)?.label ?? cellValue
    }
  }
} 