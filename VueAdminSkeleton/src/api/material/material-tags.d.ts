import type { BaseModel } from '../types/common';
import type { MaterialTag as IMaterialTag } from '@skeleton/shared-types';

/**
 * 素材标签类型定义
 * 使用 @skeleton/shared-types 中的统一类型定义
 */
export type { MaterialTag } from '@skeleton/shared-types';

// 类型别名，保持向后兼容
export type MaterialTag = IMaterialTag;

/**
 * 创建 & 更新素材 tags 请求参数
 */
export interface CreateUpdateMaterialTagQueryDto {
    name: string;
    description?: string;
}