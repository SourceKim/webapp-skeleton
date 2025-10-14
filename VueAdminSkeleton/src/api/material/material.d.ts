/**
 * 素材管理相关类型定义
 */
import type { PaginationQuery } from '../types/common';

/**
 * 素材类型
 */
export type MaterialType = 'image' | 'audio' | 'video' | 'document' | 'text' | 'other';

/**
 * 素材分类信息
 */
export interface MaterialCategory {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

/**
 * 素材标签信息
 */
export interface MaterialTag {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

/**
 * 用户信息
 */
export interface User {
  id: string;
  username: string;
  email: string;
  nickname?: string;
  phone?: string;
  avatar?: string;
  status: string;
  bio?: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

/**
 * 素材信息
 */
export interface Material {
  id: string;
  filename: string;
  original_name: string;
  file_path: string;
  mime_type: string;
  file_size: string;
  type: MaterialType;
  material_category?: MaterialCategory;
  description?: string;
  material_tags: MaterialTag[];
  user: User;
  is_public: boolean;
  upload_dir?: string;
  metadata?: Record<string, any>;
  parent_id?: string;
  access_count: number;
  file_hash: string;
  url?: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
  
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
