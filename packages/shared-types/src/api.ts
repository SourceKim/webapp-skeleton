/**
 * API 相关类型定义
 */

/**
 * API 响应状态码
 */
export enum ApiResponseCode {
  /** 成功 */
  SUCCESS = 0,
  /** 失败 */
  FAILURE = 1,
  /** 警告 */
  WARNING = 2,
  /** 信息 */
  INFO = 3,
  /** 未授权 */
  UNAUTHORIZED = 401,
  /** 禁止访问 */
  FORBIDDEN = 403,
  /** 未找到 */
  NOT_FOUND = 404,
  /** 服务器错误 */
  INTERNAL_ERROR = 500
}

/**
 * API 响应格式
 */
export interface ApiResponse<T = any> {
  code: number // 使用 ApiResponseCode 枚举值
  data?: T
  message?: string
  error?: any
}

/**
 * 分页请求参数
 */
export interface PaginationParams {
  page?: number
  pageSize?: number
  limit?: number
  offset?: number
  sort_by?: string
  sort_order?: 'ASC' | 'DESC'
}

/**
 * 分页响应数据
 */
export interface PaginationResponse<T = any> {
  list: T[]
  total: number
  page: number
  pageSize: number
  totalPages?: number
}

/**
 * 分页查询参数（兼容后端）
 */
export interface PaginationQuery {
  isPage?: boolean
  page?: number
  limit?: number
  sort_by?: string
  sort_order?: 'ASC' | 'DESC'
}

/**
 * 分页查询接口（后端使用）
 * 用于分页查询的参数验证
 */
export interface PaginationQueryDto {
  page: number
  limit: number
  sort_by: string
  sort_order: 'ASC' | 'DESC'
  filters?: Record<string, any> // 筛选参数，支持嵌套对象
}

/**
 * 分页响应数据（兼容后端）
 */
export interface PaginatedResponse<T = any> {
  items: T[]
  total: number
  page: number
  limit: number
  pages: number
  sort_by: string
  sort_order: string
}

/**
 * 请求选项
 */
export interface RequestOption {
  showLoading?: boolean
  showBeforeConfirm?: boolean
  confirmButtonText?: string
  confirmMsg?: string
  loadingText?: string
  showSuccessMsg?: boolean
  successDuration?: number
  successMsg?: string
  errorDuration?: number
  errorMsg?: string
  loadingRef?: any
}

/**
 * REST 响应类型
 */
export type RestResponse<T = any> = Promise<ApiResponse<T>>

/**
 * 分页结果类型（兼容表格组件）
 */
export interface PageResult<T = any> {
  items: T[]
  total: number
  currentPage?: number
  pageSize?: number
}

export type FetchPageDataFun<T extends object> = (
  pageQuery: PaginationQuery,
  option: RequestOption
) => Promise<PaginatedResponse<T>>
