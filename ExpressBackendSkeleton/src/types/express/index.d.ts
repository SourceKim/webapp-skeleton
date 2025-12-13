import { User } from '@/modules/user/user.model';
import type { PaginationQueryDto } from '@skeleton/shared-types';

// 全局声明方式
declare global {
  namespace Express {
    interface Request {
      user?: User;
      requestId?: string;
      pagination: PaginationQueryDto;
      /**
       * 自定义验证方法
       * @template T 返回的 DTO 类型
       * @param dtoClass DTO 类构造函数
       * @param source 数据来源 (默认 body)
       */
      validate<T extends object>(
        dtoClass: new () => T,
        source?: 'body' | 'query' | 'params'
      ): Promise<T>;
    }
    interface Response {
      /**
       * 分页响应方法
       */
      pagination<T>(data: T[], total: number): void;
      /**
       * 成功响应方法
       * @param data 响应数据
       * @param message 响应消息，默认为 'success'
       * @param statusCode HTTP 状态码，默认为 200
       */
      success<T>(data: T, message?: string, statusCode?: number): void;
      /**
       * 失败响应方法
       * @param message 错误消息
       * @param code API 响应码，默认为 FAILURE
       * @param statusCode HTTP 状态码，默认为 200
       * @param error 错误详情
       */
      error(message: string, code?: number, statusCode?: number, error?: any): void;
    }
  }
}

// 确保这个文件被视为模块
export {}; 