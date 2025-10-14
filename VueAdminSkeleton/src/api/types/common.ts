/**
 * API 通用类型定义
 */

export interface BaseModel {
  id: string;
  created_at: string;
  updated_at: string;
}

/**
 * API 响应格式
 */
export interface ApiResponse<T = any> {
  code: number;
  message?: string;
  data?: T;
  error?: any;
}

/**
 * 分页查询参数
 */
export interface PaginationQuery {
  isPage?: boolean
  page?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: 'ASC' | 'DESC';
}

/**
 * 分页响应数据
 */
export interface PaginatedResponse<T = any> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
  sort_by: string;
  sort_order: string;
}

/**
 * 请求选项
 */
export interface RequestOption {
  showLoading?: boolean;
  showBeforeConfirm?: boolean;
  confirmButtonText?: string;
  confirmMsg?: string;
  loadingText?: string;
  showSuccessMsg?: boolean;
  successDuration?: number;
  successMsg?: string;
  errorDuration?: number;
  errorMsg?: string;
  loadingRef?: any;
}

/**
 * REST 响应类型
 */
export type RestResponse<T = any> = Promise<ApiResponse<T>>; 

export type FetchPageDataFun<T extends object> = (pageQuery: PaginationQuery, option: RequestOption) => Promise<PaginatedResponse<T>>