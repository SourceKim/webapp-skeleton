import type { BaseModel } from '../types/common';
import type { MaterialCategory as IMaterialCategory } from '@skeleton/shared-types';

/**
 * 素材分类类型定义
 * 使用 @skeleton/shared-types 中的统一类型定义
 */
export type { MaterialCategory } from '@skeleton/shared-types';

// 类型别名，保持向后兼容
export type MaterialCategory = IMaterialCategory;

/**
* 创建 & 更新素材 tags 请求参数
*/
export interface CreateUpdateMaterialCategoryQueryDto {
  name: string;
  description?: string;
}