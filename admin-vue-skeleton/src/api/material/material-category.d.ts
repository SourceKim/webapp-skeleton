import type { BaseModel } from '../types/common';

export interface MaterialCategory extends BaseModel {
  name: string;
  description?: string;
}

/**
* 创建 & 更新素材 tags 请求参数
*/
export interface CreateUpdateMaterialCategoryQueryDto {
  name: string;
  description?: string;
}