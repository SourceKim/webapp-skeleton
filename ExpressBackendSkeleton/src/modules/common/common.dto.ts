import { Expose } from "class-transformer";
import { FilterOperator, FilterCondition } from '@skeleton/shared-types';

export class BaseDTO {
    @Expose()
    id: string = '';

    @Expose()
    createdAt: Date = new Date();

    @Expose()
    updatedAt: Date = new Date();

    @Expose()
    deletedAt: Date | null = null;
}

// 重新导出 shared-types 中的类型，保持向后兼容
export { FilterOperator, FilterCondition };

/**
 * 分页查询接口
 * 用于分页查询的参数验证
 */
export interface PaginationQueryDto {
    page: number;
    limit: number;
    sort_by: string;
    sort_order: 'ASC' | 'DESC';
    filters?: Record<string, any>; // 筛选参数，支持嵌套对象
}
/**
 * 分页响应接口
 * 用于返回分页数据
 */
export interface PaginatedResponse<T> {
    items: T[];
    meta: {
        total: number;
        page: number;
        limit: number;
        pages: number;
        sort_by?: string;
        sort_order?: 'ASC' | 'DESC';
    };
}

/**
 * API响应接口
 * 用于统一API响应格式
 */
export interface ApiResponse<T> {
    code: number; // 0 成功, 1 失败, 2 警告, 3 信息, 401 未授权, 403 禁止访问, 404 未找到, 500 服务器错误
    message?: string;
    data?: T;
    error?: any;
} 