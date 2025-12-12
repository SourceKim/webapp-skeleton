/**
 * Zod 验证工具函数
 * 用于在 Express 控制器中使用 Zod Schema 进行验证
 */

import { Request, Response, NextFunction } from 'express'
import { HttpException } from '@/exceptions/http.exception'
import { validate, formatValidationErrors, ValidationResult } from '@skeleton/shared-types'

/**
 * 验证请求体的中间件工厂函数
 * @param schema Zod Schema
 * @returns Express 中间件
 */
export function validateBody<T>(schema: any) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result: ValidationResult<T> = validate<T>(schema, req.body)
      
      if (!result.success && result.errors) {
        const errors = formatValidationErrors(result.errors)
        throw new HttpException(400, '请求参数验证失败', errors)
      }
      
      // 将验证后的数据赋值回 req.body
      if (result.data) {
        req.body = result.data
      }
      
      next()
    } catch (error) {
      if (error instanceof HttpException) {
        next(error)
      } else {
        next(new HttpException(400, '请求参数验证失败', error))
      }
    }
  }
}

/**
 * 验证查询参数的中间件工厂函数
 * @param schema Zod Schema
 * @returns Express 中间件
 */
export function validateQuery<T>(schema: any) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result: ValidationResult<T> = validate<T>(schema, req.query)
      
      if (!result.success && result.errors) {
        const errors = formatValidationErrors(result.errors)
        throw new HttpException(400, '查询参数验证失败', errors)
      }
      
      // 将验证后的数据赋值回 req.query
      if (result.data) {
        req.query = result.data as any
      }
      
      next()
    } catch (error) {
      if (error instanceof HttpException) {
        next(error)
      } else {
        next(new HttpException(400, '查询参数验证失败', error))
      }
    }
  }
}

/**
 * 验证路径参数的中间件工厂函数
 * @param schema Zod Schema
 * @returns Express 中间件
 */
export function validateParams<T>(schema: any) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result: ValidationResult<T> = validate<T>(schema, req.params)
      
      if (!result.success && result.errors) {
        const errors = formatValidationErrors(result.errors)
        throw new HttpException(400, '路径参数验证失败', errors)
      }
      
      // 将验证后的数据赋值回 req.params
      if (result.data) {
        req.params = result.data as any
      }
      
      next()
    } catch (error) {
      if (error instanceof HttpException) {
        next(error)
      } else {
        next(new HttpException(400, '路径参数验证失败', error))
      }
    }
  }
}

/**
 * 在控制器中直接验证数据（不创建中间件）
 * @param schema Zod Schema
 * @param data 要验证的数据
 * @returns 验证后的数据
 * @throws HttpException 如果验证失败
 */
export function validateData<T>(schema: any, data: unknown): T {
  const result: ValidationResult<T> = validate<T>(schema, data)
  
  if (!result.success && result.errors) {
    const errors = formatValidationErrors(result.errors)
    throw new HttpException(400, '数据验证失败', errors)
  }
  
  if (!result.data) {
    throw new HttpException(400, '数据验证失败：数据为空')
  }
  
  return result.data
}
