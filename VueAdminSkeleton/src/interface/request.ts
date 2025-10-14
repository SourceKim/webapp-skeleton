import type {
  AxiosInstance,
  AxiosInterceptorManager,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
  AxiosInterceptorOptions,
  AxiosError
} from 'axios'
import type { RestResponse } from '@/api/types/common';

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