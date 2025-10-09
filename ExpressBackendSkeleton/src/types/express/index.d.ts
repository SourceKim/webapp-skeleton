import { User } from '@/modules/user/user.model';
import { PaginationQueryDto } from '@/modules/common/common.dto';

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
      pagination<T>(data: T[], total: number): void;
    }
  }
}

// 确保这个文件被视为模块
export {}; 