import { BaseModel } from "../types/common";
import type { Permission } from '@skeleton/shared-types';

/**
 * 权限类型定义
 * 使用 @skeleton/shared-types 中的统一类型定义
 */
export type { Permission } from '@skeleton/shared-types';

export interface CreateAndUpdatePermissionQueryDto {
  name: string;
  resource: string;
  action: string;
  description?: string;
}

