import type {
  AxiosInstance,
  AxiosInterceptorManager,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
  AxiosInterceptorOptions,
  AxiosError
} from 'axios'
import type { RestResponse, PaginatedResponse } from '@/api/types/common';
import type { PageResult } from '@/components/table/types';

/**
 * 分页数据获取函数类型
 * API 函数返回 RestResponse<PaginatedResponse<T>> 或 RestResponse<PageResult<T>>
 * 即 Promise<ApiResponse<PaginatedResponse<T>>> 或 Promise<ApiResponse<PageResult<T>>>
 */
export type FetchPageDataFun<T> = (
  filters?: any,
  context?: { loadingRef?: any }
) => RestResponse<PaginatedResponse<T>> | RestResponse<PageResult<T>>

/**
 * axios实例重载定义
 */
interface MyAxiosInterceptorManager<V> extends Omit<AxiosInterceptorManager<V>, 'use'> {
  use(onFulfilled?: (value: AxiosResponse<V>) => V | Promise<V>, onRejected?: (error: AxiosError<V>) => any, options?: AxiosInterceptorOptions): number;
}
export interface MyAxiosInstance<T, Q> extends Omit<AxiosInstance, 'interceptors'> {
  interceptors: {
    request: AxiosInterceptorManager<InternalAxiosRequestConfig<Q>>;
    response: MyAxiosInterceptorManager<RestResponse<T>>;
  };
  getUri(config?: AxiosRequestConfig): string;
  request<R = RestResponse<T>, D = Q>(config: AxiosRequestConfig<D>): Promise<R>;
  get<R = RestResponse<T>, D = Q>(url: string, config?: AxiosRequestConfig<D>): Promise<R>;
  delete<R = RestResponse<T>, D = Q>(url: string, config?: AxiosRequestConfig<D>): Promise<R>;
  head<R = RestResponse<T>, D = Q>(url: string, config?: AxiosRequestConfig<D>): Promise<R>;
  options<R = RestResponse<T>, D = Q>(url: string, config?: AxiosRequestConfig<D>): Promise<R>;
  post<R = RestResponse<T>, D = Q>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R>;
  put<R = RestResponse<T>, D = Q>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R>;
  patch<R = RestResponse<T>, D = Q>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R>;
  postForm<R = RestResponse<T>, D = Q>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R>;
  putForm<R = RestResponse<T>, D = Q>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R>;
  patchForm<R = RestResponse<T>, D = Q>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R>;
}