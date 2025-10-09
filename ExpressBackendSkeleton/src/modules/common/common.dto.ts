import { Expose } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";

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

export class FindByIdDto {
    @IsString()
    @IsNotEmpty()
    id!: string;
}

/**
 * 筛选操作符枚举
 */
export enum FilterOperator {
    EQUALS = 'eq',           // 等于
    NOT_EQUALS = 'ne',       // 不等于
    LIKE = 'like',           // 模糊匹配
    ILIKE = 'ilike',         // 忽略大小写的模糊匹配
    IN = 'in',               // 在...之中
    NOT_IN = 'not_in',       // 不在...之中
    GREATER_THAN = 'gt',     // 大于
    GREATER_THAN_EQUAL = 'gte', // 大于等于
    LESS_THAN = 'lt',        // 小于
    LESS_THAN_EQUAL = 'lte', // 小于等于
    IS_NULL = 'is_null',     // 为空
    IS_NOT_NULL = 'is_not_null', // 不为空
    BETWEEN = 'between',     // 在...之间
}

/**
 * 筛选条件接口
 */
export interface FilterCondition {
    field: string;
    operator: FilterOperator;
    value: any;
}

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