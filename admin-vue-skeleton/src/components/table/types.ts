/**
 * 表格相关类型定义
 */

/** 分页查询参数 */
export interface PageQuery<T = any> {
  /** 是否分页 */
  isPage?: boolean
  /** 当前页码 */
  currentPage?: number
  /** 每页大小 */
  pageSize?: number
  /** 查询参数 */
  param?: T
  /** 过滤条件 */
  filters?: T
}

/** 分页结果 */
export interface PageResult<T = any> {
  /** 数据列表 */
  items: T[]
  /** 总数 */
  total: number
  /** 当前页 */
  currentPage?: number
  /** 每页大小 */
  pageSize?: number
}

/** REST API 响应 */
export interface RestResponse<T = any> {
  /** 响应代码 */
  code?: number
  /** 响应消息 */
  message?: string
  /** 响应数据 */
  data?: T
  /** 是否成功 */
  success?: boolean
}

/** 表格选择模式 */
export type TableSelectionMode = 'single' | 'multiple' | false

/** 表格布局模式 */
export type TableLayoutMode = 'auto' | 'fixed' | 'default'

/** 表格数据获取函数 */
export type TableFetchFunction<T, F> = (
  filters?: F,
  context?: { loadingRef?: any }
) => Promise<RestResponse<PageResult<T>>>

/** 表格排序列 */
export interface TableSortColumn {
  /** 唯一标识 */
  _id: string
  /** 列标题 */
  label: string
  /** 是否隐藏 */
  hidden?: boolean
  /** 子列 */
  children?: TableSortColumn[]
} 