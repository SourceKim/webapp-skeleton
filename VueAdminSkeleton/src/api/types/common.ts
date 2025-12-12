/**
 * API 通用类型定义
 * 使用 @skeleton/shared-types 中的统一类型定义
 */
import type {
  ApiResponse,
  PaginationQuery,
  PaginatedResponse,
  RequestOption,
  RestResponse,
  PageResult,
  FetchPageDataFun,
  BaseEntity
} from '@skeleton/shared-types';

// 重新导出 shared-types 中的类型
export type {
  ApiResponse,
  PaginationQuery,
  PaginatedResponse,
  RequestOption,
  RestResponse,
  PageResult,
  FetchPageDataFun
};

// BaseModel 作为 BaseEntity 的别名，保持向后兼容
export type BaseModel = BaseEntity;