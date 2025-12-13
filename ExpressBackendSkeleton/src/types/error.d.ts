/**
 * 错误详情类型
 * 用于 HttpException 和错误响应中的错误详情
 */
export interface ErrorDetail {
  name?: string;
  message?: string;
  stack?: string;
  [key: string]: string | number | boolean | null | undefined | ErrorDetail | ErrorDetail[];
}

/**
 * 错误对象类型
 * 用于 catch 块中的错误处理
 */
export interface AppError {
  status?: number;
  message?: string;
  name?: string;
  stack?: string;
  code?: string | number;
  [key: string]: string | number | boolean | null | undefined | AppError | AppError[];
}
