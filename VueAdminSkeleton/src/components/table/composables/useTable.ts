import { computed, useAttrs } from 'vue'
import { useLayoutStore } from '@/stores/layout'
import { useTableData } from './useTableData'
import { useTableSelection } from './useTableSelection'
import { useTableColumns } from './useTableColumns'
import type { MTableProps } from '@/components/interface/table'

/**
 * 表格主要逻辑组合
 */
export function useTable<T extends object, F extends object>(
  props: MTableProps<T, F>,
  emit: any
) {
  const layoutStore = useLayoutStore()
  const attrs = useAttrs()

  // 数据管理
  const {
    loadingRef,
    data,
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
    tableColumnsParams,
    sortColumnsParams,
    initTableColumnParamFun
  } = useTableColumns(props as any, {
    pagination,
    selectionRows,
    selectable
  })

  // 样式类名
  const wrapperClass1 = computed(() => `layout-${props.layout ?? 'default'}`)
  const wrapperClass2 = computed(() => `m-table ${props.height ? 'custom-height' : ''}`)

  // table 的参数
  const tableParam = computed(() => {
    const param: any = {
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
    const selectedRows = selectionChange(rows)
    emit('selection-change', selectedRows as T[])
  }

  // 处理行点击事件
  function handleRowClick(row: T, column: any, event: Event) {
    const selectedRows = rowClick(row, column, event)
    emit('selection-change', selectedRows as T[])
    emit('row-click', row, column, event)
  }

  // 更新数据时的处理
  function handleDataUpdate(newData: T[]) {
    if (props.data) {
      emit('update:data', newData)
    } else {
      data.value = newData
    }
  }

  return {
    // 状态
    loadingRef,
    layoutStore,
    data,
    pageQuery,
    pagination,
    pageData,
    selectionRows,
    tableColumnsParams,
    sortColumnsParams,
    wrapperClass1,
    wrapperClass2,
    tableParam,
    
    // 方法
    fetchQuery,
    handleSelectionChange,
    handleRowClick,
    handleDataUpdate,
    initTableColumnParamFun
  }
} 