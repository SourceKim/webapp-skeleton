import type { TableColumnCtx } from 'element-plus'
import type { FetchPageDataFun } from '@/interface/request'
import type { CommonFormColumn } from '@/components/interface/form'
import type { CommonItemData, CommonItemList, ItemListColumn, SlotRender } from '@/components/interface'
import type { VNode } from 'vue'
import type { ValidRule } from '@/components/interface/validate'
import type { TableProps } from 'element-plus'

/**
 * T为表格行的数据类型，F为简单查询条件对象类型
 */
export type MTableProps<T extends object, F extends object> = Omit<TableProps<T>, 'data'> & {
  version?: string // 版本号 (For warning)
  install?: boolean // 是否安装 (For warning)
  layout?: TableLayout // 表格布局类型, 如果高度随内容自动增高：则需要设置为 "auto", 如果表格高度制定了则需要设定为 "stretch"
  isFilterTable?: boolean // 是否是筛选过滤的表格，是：表格包含搜索框，同时布局有间距调整
  isSortColumn?: boolean // 是否表格列排序
  selection?: TableSelection // 表格多选类型
  selectionLimit?: number // 最多可选择行数
  filterColumns?: CommonFormColumn<F>[] // 过滤column
  filterParam?: F // 过滤param
  columns?: CommonTableColumn<T>[] // 表格列定义
  fetchData?: FetchPageDataFun<T> // 请求后台数据的方法
  defaultQuery?: boolean // 是否默认查询，启动就查询一次
  data: T[] // 表格数据
  isPage?: boolean // 是否分页
  pagination?: TablePagination // 分页对象
  stripe?: boolean // 表格是否斑马纹
}

// 表格列定义
export interface TableColumn<T extends object> extends Partial<Omit<TableColumnCtx<T>, 'children'>> {
  //绑定行的属性
  prop?: string
  //prop属性别名
  alias?: string
  prop2?: string
  single?: string
  type?: string
  _id?: string
  //标题名称
  label?: string
  //疑问备注框
  comment?: VNode
  //显示必填星号
  required?: boolean
  // 此列隐藏
  hidden?: boolean
  // 表格是否可编辑
  editable?: boolean
  // 表格编辑参数
  editParam?: CommonFormColumn<T> | ((scope: CI<T>) => CommonFormColumn<T>)
  //允许用户按照自己的slotName插槽定制
  slotName?: string
  // 操作列按钮
  buttons?: OperationButton<T>[]
  //选项列表
  itemList?: CommonItemList
  labelKey?: string | ((item: CommonItemData) => string | number)
  valueKey?: string | ((item: CommonItemData) => string | number)
  //按钮最大数量，超过的部分会被收纳进更多下拉选项里面
  readonly maxCount?: number
  // 当前节点数据校验规则
  rules?: ValidRule<T, keyof T> | ValidRule<T, keyof T>[]
  //选择列
  selection?: TableSelection
  //表格列插槽
  slots?: {
    default?: SlotRender
    header?: SlotRender
  }
  children?: TableColumn<T>[]
}

export interface TableSortColumn {
  _id: string
  label: string
  hidden?: boolean
  children?: TableSortColumn[]
}

export interface CI<T extends object> {
  $index: number
  column: TableColumnCtx<T>
  row: T
  $fullIndex?: number
  $column: TableColumn<T>
}

// 通用表格分页参数对象类型
export interface TablePagination {
  // 合计值
  total?: number
  // 当前页码 分页为true时必有值
  currentPage?: number
  // 分页大小 分页为true时必有值
  pageSize?: number
  // 分页框有背景颜色，参考element-plus分页组件
  background: true
  // 显示哪些布局控件，参考element-plus分页组件
  layout: 'total,sizes,prev,pager,next,jumper' | string

  [prop: string]: string | number | boolean | null | undefined | Record<string, string | number | boolean | null | undefined> | (string | number | boolean | null | undefined)[]
}

/**
 * 表格多选类型
 */
export declare type TableSelection = 'multiple' | 'single'

/**
 * 表格布局类型, 如果高度随内容自动增高：则需要设置为 "auto", 如果表格高度制定了则需要设定为 "stretch"
 */
export type TableLayout = 'auto' | 'stretch'

export type CommonTableColumn<T extends object> =
  | TextTableColumn<T>
  | IndexTableColumn<T>
  | OperationTableColumn<T>
  | ItemListTableColumn<T>
  | SlotsTableColumn<T>
  | EditableTableColumn<T>
  | SelectionTableColumn<T>

/**
 * 文本列
 */
export interface TextTableColumn<T extends object> extends TableColumn<T> {
  label: string
}

/**
 * 选择列
 */
export interface SelectionTableColumn<T extends object> extends TableColumn<T> {
  type: 'selection'
  //选择列
  selection?: TableSelection
}

/**
 * 索引列
 */
export interface IndexTableColumn<T extends object> extends TableColumn<T> {
  type: 'index'
  index?: (index: number) => number
}

/**
 * 操作项列表列
 */
export interface OperationTableColumn<T extends object> extends TableColumn<T> {
  type: 'operation'
  //按钮最大数量，超过的部分会被收纳进更多下拉选项里面
  readonly maxCount?: number
  // 操作列按钮
  buttons: OperationButton<T>[]
}

/**
 * 具有itemList列
 */
export interface ItemListTableColumn<T extends object> extends TableColumn<T>, ItemListColumn {
  type: 'select'
  //选项列表
  itemList: CommonItemList
}

/**
 * table插槽列
 */
export interface SlotsTableColumn<T extends object> extends TableColumn<T> {
  slots?: {
    default?: SlotRender
    header?: SlotRender
  }
}

/**
 * table可编辑列
 */
export interface EditableTableColumn<T extends object> extends TableColumn<T>, ItemListColumn {
  editable: true
  // 表格编辑参数
  editParam?: CommonFormColumn<T> | ((row: T, column: TableColumn<T>) => CommonFormColumn<T>)
}

export interface OperationButton<T> {
  type?: 'default' | 'success' | 'warning' | 'info' | 'primary' | 'danger'
  label: string
  icon?: string | VNode | (() => VNode)
  hidden?: boolean
  authLogic?: 'and' | 'or'
  onClick?: (row: T, index: { $index: number; $fullIndex: number }) => void
  disabled?: ((row: T) => boolean) | boolean
}

export interface OperationButtonProps<T> {
  // 按钮权限
  readonly auth?: boolean
  // 最大显示数量，超出会被收纳进更多
  readonly maxCount?: number
  // 当前行数据
  readonly row?: T
  // 当前行索引
  readonly index?: { $index: number; $fullIndex: number }
  // 按钮
  readonly buttons: OperationButton<T>[]
}

export interface FilterRow {
  type?: string
  logic: 'and' | 'or'
  checked: boolean
  prop?: string
  condition?: 'ct' | 'nct' | 'eq' | 'ne' | 'gt' | 'ge' | 'lt' | 'le' | 'in' | 'bt'
  value1: string | number | boolean | null | undefined | Date | string[] | number[]
  value2?: string | number | boolean | null | undefined | Date | string[] | number[]
  children?: FilterRow[]
}

export interface QueryFilterProps {
  //是否递归搜索条件
  recursive?: boolean
}

export interface QueryFilter {
  recursive: boolean
  filters: FilterRow[]
  changeCheck: (row: FilterRow, checked: boolean) => void
  addRow: (prop: string, parent?: FilterRow) => void
  removeRow: (index: number, parent?: FilterRow) => void
}

export interface PreviewType extends Omit<FilterRow, 'children'> {
  alias?: string
  enabled: boolean
  str: string
  children?: PreviewType[]
}
