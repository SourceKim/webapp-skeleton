import { computed, useAttrs } from 'vue'
import { useLayoutStore } from '@/stores/layout'
import { useTableData } from './useTableData'
import { useTableSelection } from './useTableSelection'
import { useTableColumns } from './useTableColumns'
import type { MTableProps, CommonTableColumn } from '@/components/interface/table'
import type { TableProps } from 'element-plus'

/**
 * 表格主要逻辑组合
 */
export function useTable<T extends object, F extends object>(
  props: MTableProps<T, F>,
  emit: {
    (e: 'selection-change', rows: T[]): void
    (e: 'row-click', row: T, column: CommonTableColumn<T>, event: Event): void
  }
) {
  const layoutStore = useLayoutStore()
  const attrs = useAttrs()

  // 数据管理
  const {
    loadingRef,
    pageQuery,
    pagination,
    pageData,
    fetchQuery
  } = useTableData(props)

  // 选择逻辑
  const {
    selectionRows,
    selectionChange,
    rowClick,
    selectable
  } = useTableSelection(props)

  // 列配置
  const {
    sortColumnsParams
  } = useTableColumns<T, F>({
    columns: props.columns,
    selection: props.selection,
    isPage: props.isPage,
    fetchData: props.fetchData
  }, {
    pagination,
    selectionRows,
    selectable
  })

  // 样式类名
  const wrapperClass1 = computed(() => `layout-${props.layout ?? 'default'}`)
  const wrapperClass2 = computed(() => `m-table ${props.height ? 'custom-height' : ''}`)

  // table 的参数
  const tableParam = computed(() => {
    const param: Partial<TableProps<T>> & Record<string, unknown> = {
      ...attrs,
      ...props,
      data: pageData.value,
      onRowClick: handleRowClick,
      onSelectionChange: handleSelectionChange
    }

    // 删除无效属性
    const invalidProps = [
      'handleType',
      'isFilterTable',
      'selection',
      'filterColumns',
      'filterParam',
      'columns',
      'fetchData',
      'defaultQuery',
      'pagination',
      'style',
      'class',
      'data'
    ]
    
    invalidProps.forEach((property) => {
      delete param[property]
    })
    
    return param
  })

  // 处理选中事件
  function handleSelectionChange(rows: T[]) {
    selectionChange(rows)
    emit('selection-change', selectionRows.value)
  }

  // 处理行点击事件
  function handleRowClick(row: T, column: CommonTableColumn<T>, event: Event) {
    rowClick(row)
    emit('selection-change', selectionRows.value)
    emit('row-click', row, column, event)
  }

  return {
    // 状态
    loadingRef,
    layoutStore,
    pageQuery,
    pagination,
    pageData,
    selectionRows,
    sortColumnsParams,
    wrapperClass1,
    wrapperClass2,
    tableParam,
    
    // 方法
    fetchQuery
  }
} 