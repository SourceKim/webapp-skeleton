// src/middlewares/request-extension.ts
import { Request, Response, NextFunction } from 'express';
import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { HttpException } from '@/exceptions/http.exception';

/**
 * 为 Request 扩展 validate 方法
 */
export function extendRequestValidate() {
  return (req: Request, _res: Response, next: NextFunction) => {
    /**
     * 通用验证方法
     * @param dtoClass DTO 类
     * @param source 数据来源 (body/query/params)
     * @returns 验证后的数据
     * @throws 验证错误
     */
    req.validate = async <T extends object>(
      dtoClass: new () => T,
      source: 'body' | 'query' | 'params' = 'body'
    ): Promise<T> => {
      const data = req[source];
      const dto = plainToInstance(dtoClass, data);
      
      const errors = await validate(dto, {
        whitelist: true,
        forbidNonWhitelisted: true,
      });

      if (errors.length > 0) {
        const errorMessages = errors.map((error) => ({
          field: error.property,
          message: Object.values(error.constraints || {})[0],
        }));
        throw new HttpException(400, 'Validation failed', errorMessages);
      }

      return dto;
    };

    next();
  };
}