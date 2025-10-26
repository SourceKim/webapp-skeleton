import { ref, computed, watch, shallowRef, createVNode, h, type Ref } from 'vue'
import { getDownloadFileUrl } from '@/utils/file'
import { useI18n } from 'vue-i18n'
import { useLocaleStore } from '@/stores/locale'
import { generateLabelWidth, getItemListRef } from '@/components/utils'
import { DefaultMaxCount } from '@/components/constants'
import type { CommonTableColumn, TableColumn, CI } from '@/components/interface/table'
import type { TableSortColumn, TableSelectionMode } from '../types'
import MOperationButton from '../OperationButton.vue'

/**
 * 表格列配置逻辑
 */
export function useTableColumns<T extends object>(props: {
  columns?: CommonTableColumn<T>[]
  selection?: TableSelectionMode
  isPage?: boolean
  fetchData?: any
  isSortColumn?: boolean
}, context: {
  pagination: Ref<any>
  selectionRows: Ref<T[]>
  selectable: (row: T) => boolean
}) {
  const { t } = useI18n()

  // 表格列参数
  const tableColumnsParams: Ref<CommonTableColumn<T>[]> = shallowRef([])
  
  // 表格列参数_id寻址
  const tableColumnsParamsObj: Ref<{ [field: string]: CommonTableColumn<T> }> = shallowRef({})
  
  // 排序筛选列定义
  const sortColumns: Ref<TableSortColumn[]> = ref([])

  // 排序列参数
  const sortColumnsParams = computed(() => {
    return getSortColumnsParams(sortColumns.value)
  })

  // 监听 columns 变化，重新初始化表格列参数
  watch(() => props.columns, initTableColumnParamFun, { deep: true })

  /**
   * 初始化表格筛选排序列参数数组
   */
  function getSortColumnsParams(sortColumns?: TableSortColumn[]): CommonTableColumn<T>[] | undefined {
    return sortColumns
      ?.filter((i) => !i.hidden)
      .map((sortCol) => {
        const column = tableColumnsParamsObj.value[sortCol._id]!
        column.children = getSortColumnsParams(sortCol.children)
        return column
      })
  }

  /**
   * 初始化表格筛选排序数组
   */
  function initSortColumn(cols?: TableColumn<T>[]): TableSortColumn[] {
    if (!cols?.length) return []
    return cols.map((column) => {
      return {
        _id: column._id ?? '',
        label: column.label ?? '',
        hidden: column.hidden,
        children: initSortColumn(column.children)
      }
    })
  }

  /**
   * 调用初始化表格筛选排序列数组
   */
  function initSortColumnFun() {
    sortColumns.value = initSortColumn(tableColumnsParams.value)
  }

  /**
   * 调用初始化表格列的参数
   */
  function initTableColumnParamFun(): void {
    const columns: CommonTableColumn<T>[] = []
    
    if (props.selection) {
      columns.push({
        type: 'selection',
        selection: props.selection
      })
    }
    
    if (props.columns) {
      columns.push(...props.columns)
    }
    
    tableColumnsParamsObj.value = {}
    tableColumnsParams.value = initTableColumnParam(columns)
    initSortColumnFun()
  }

  /**
   * 初始化表格列的参数
   */
  function initTableColumnParam(cols: TableColumn<T>[], parentId = ''): CommonTableColumn<T>[] {
    const charWidth = useLocaleStore().getCurrentLocale().getCharWidth()
    
    return cols
      .map((column, i) => {
        const r = { ...column }
        r._id = parentId + i

        // 序号列处理
        if (r.type === 'index') {
          r.label ??= t('comp.table.index')
          r.width ??= 80
          r.showOverflowTooltip ??= false
        }

        // 排序处理
        if (r.prop) {
          r.sortable ??= props.fetchData ? 'custom' : true
        }

        // 自动宽度计算
        if (!(r.width ?? r.minWidth) && r.label) {
          r.minWidth = generateLabelWidth(r) + 24
        }

        // 操作列处理
        if (r.type === 'operation') {
          r.label ??= t('comp.table.operation')
          r.showOverflowTooltip ??= false
        }

        // itemList 处理
        if (r.itemList) {
          r.itemList = getItemListRef(r)
        }

        return r
      })
      .filter((column) => {
        // 操作列过滤
        if (column.type === 'operation') {
          column.buttons = column.buttons?.filter((j) => !j.hidden)
          if (!column.buttons?.length) return false

          // 自动计算操作框宽度
          const buttons = column.buttons.slice(0, column.maxCount ?? DefaultMaxCount)
          if (buttons.length < column.buttons?.length) {
            buttons[buttons.length - 1] = { icon: 'el|more', label: t('comp.operation.more') }
          }
          
          column.width ??= Math.max(
            buttons.reduce(
              (size, item) => size + (item.label?.length ?? 0) * charWidth + (item.icon ? 16 : 0),
              16 + (buttons.length - 1) * 1.5 * charWidth
            ) + 30,
            charWidth * column.label!.length + 32
          )
        }
        return true
      })
      .map((column) => {
        // 递归处理子列
        if (column.children?.length) {
          column.children = initTableColumnParam(column.children, column._id + '-')
        }

        // 生成最终的列参数
        const tableColumParams = createTableColumnParams(column)
        tableColumnsParamsObj.value[tableColumParams._id!] = tableColumParams
        return tableColumParams
      })
  }

     /**
    * 创建表格列参数
    */
   function createTableColumnParams(column: TableColumn<T>): CommonTableColumn<T> {
     const tableColumParams = {
       key: column._id,
       showOverflowTooltip: !(column.slotName || column.editable),
       ...column,
       slots: column.slots ? { ...column.slots } : {}
     }

    // 处理必填标记
    tableColumParams.required ??= (() => {
      const rules = column.rules ?? (column.editParam as any)?.rules
      if (rules) {
        if (rules instanceof Array) {
          return rules.some((i) => i.required)
        }
        return rules.required
      }
    })()

         // 生成头部插槽
     if ((tableColumParams.required || tableColumParams.comment) && !tableColumParams.slots?.header) {
       if (!tableColumParams.slots) tableColumParams.slots = {}
       tableColumParams.slots.header = createHeaderSlot(tableColumParams)
     }

    // 处理不同类型的列
    processColumnByType(tableColumParams)

    return tableColumParams
  }

  /**
   * 创建头部插槽
   */
  function createHeaderSlot(column: CommonTableColumn<T>) {
    return () => h('div', {
      style: {
        display: 'inline-flex',
        alignItems: 'center'
      }
    }, [
      column.required ? h('span', { style: { color: 'red' } }, '*') : null,
      column.label,
      column.comment ? h('m-comment', { label: column.label, comment: column.comment }) : null
    ])
  }

  /**
   * 根据类型处理列
   */
  function processColumnByType(tableColumParams: CommonTableColumn<T>) {
    // 序号列
    if (tableColumParams.type === 'index' && props.isPage) {
      tableColumParams.index ??= (i) => 
        context.pagination.value.pageSize! * (context.pagination.value.currentPage! - 1) + i + 1
    }

    // 选择列
    if (tableColumParams.type === 'selection') {
      tableColumParams.showOverflowTooltip = false
      
      if (tableColumParams.selection === 'multiple') {
        tableColumParams.selectable ??= context.selectable
      }
      
             if (tableColumParams.selection === 'single') {
         if (!tableColumParams.slots) tableColumParams.slots = {}
         tableColumParams.slots.default ??= (scope: CI<T>) => 
           h('el-radio', {
             onClick: (e: Event) => e.preventDefault(),
             label: true,
             modelValue: context.selectionRows.value.includes(scope.row)
           }, [h('span')])
       }
    }

         // 操作列
     if (tableColumParams.type === 'operation' && !tableColumParams.slots?.default) {
       if (!tableColumParams.slots) tableColumParams.slots = {}
       tableColumParams.slots.default = (scope: CI<T>) => {
        const $index = scope.$index
        let $fullIndex = $index
        if (props.isPage) {
          $fullIndex = $index + context.pagination.value.pageSize! * (context.pagination.value.currentPage! - 1)
        }
        
        return createVNode(MOperationButton, {
          ...tableColumParams,
          row: scope.row,
          index: { $index, $fullIndex }
        })
      }
    }

    // 图片列：根据单元格值渲染图片
    if (tableColumParams.type === 'image' && !tableColumParams.slots?.default && tableColumParams.prop) {
      if (!tableColumParams.slots) tableColumParams.slots = {}
      tableColumParams.showOverflowTooltip = false
      tableColumParams.align ??= 'center'
      const size = Math.min(Number(tableColumParams.width ?? 60), 80)
      tableColumParams.slots.default = (scope: CI<T>) => {
        const value: any = (scope.row as any)[tableColumParams.prop as string]
        if (!value) return h('span', '-')
        let url: string | undefined
        if (typeof value === 'string') {
          url = value.startsWith('http') || value.startsWith('data:') ? value : getDownloadFileUrl({ object: value })
        } else if (typeof value === 'object') {
          const obj = value as any
          url = getDownloadFileUrl({ id: obj.id, object: obj.object })
        }
        if (!url) return h('span', '-')
        return h('img', {
          src: url,
          style: `width: ${size}px; height: ${size}px; border-radius: 4px; object-fit: cover;`
        })
      }
    }
  }

  // 初始化
  initTableColumnParamFun()

  return {
    tableColumnsParams,
    tableColumnsParamsObj,
    sortColumns,
    sortColumnsParams,
    initTableColumnParamFun
  }
} 