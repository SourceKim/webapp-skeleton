import { Request, Response, NextFunction } from 'express';
import type { ApiResponse } from '@skeleton/shared-types';
import { ApiResponseCode } from '@skeleton/shared-types';

/**
 * 响应中间件
 * 扩展 Response 对象，添加便捷的响应方法
 */
export const responseMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    /**
     * 发送成功响应
     * @param data 响应数据
     * @param message 响应消息，默认为 'success'
     * @param statusCode HTTP 状态码，默认为 200
     */
    res.success = function<T>(data: T, message: string = 'success', statusCode: number = 200): void {
        const response: ApiResponse<T> = {
            code: ApiResponseCode.SUCCESS,
            message,
            data
        };
        res.status(statusCode).json(response);
    };

    /**
     * 发送失败响应
     * @param message 错误消息
     * @param code API 响应码，默认为 FAILURE
     * @param statusCode HTTP 状态码，默认为 200
     * @param error 错误详情
     */
    res.error = function(
        message: string,
        code: number = ApiResponseCode.FAILURE,
        statusCode: number = 200,
        error?: any
    ): void {
        const response: ApiResponse<null> = {
            code,
            message,
            error
        };
        res.status(statusCode).json(response);
    };

    next();
};
