/**
 * 素材管理相关类型定义
 * 使用 @skeleton/shared-types 中的统一类型定义
 */
import type { PaginationQuery } from '../types/common';
import type {
  Material as IMaterial,
  MaterialCategory as IMaterialCategory,
  MaterialTag as IMaterialTag,
  MaterialType,
  User as IUser
} from '@skeleton/shared-types';

// 重新导出 shared-types 中的类型和枚举
export type { MaterialType };
export type { Material, MaterialCategory, MaterialTag, User } from '@skeleton/shared-types';

// 扩展 Material 接口，添加前端特定的字段
export interface Material extends IMaterial {
  // 前端特定的扩展字段
  url?: string;
  
  // 兼容旧字段名
  originalname?: string;
  path?: string;
  size?: number;
  mimetype?: string;
  category?: string;
  tags?: string[];
}

/**
 * 创建素材请求参数
 */
export interface CreateMaterialDto {
  category?: string;
  description?: string;
  is_public?: boolean;
  tags?: string[];
  metadata?: Record<string, any>;
  parent_id?: string;
}

/**
 * 更新素材请求参数
 */
export interface UpdateMaterialDto {
  filename?: string;
  originalname?: string;
  description?: string;
  category?: string;
  is_public?: boolean;
  tags?: string[];
  metadata?: Record<string, any>;
}

/**
 * 素材查询参数
 */
export interface GetMaterialsQueryDto extends PaginationQuery {
  type?: MaterialType | MaterialType[];
  category?: string;
  keyword?: string;
  is_public?: boolean;
  tags?: string[];
  parent_id?: string;
  min_size?: number;
  max_size?: number;
}

/**
 * 批量删除素材请求参数
 */
export interface BatchDeleteMaterialsDto {
  ids: string[];
}
