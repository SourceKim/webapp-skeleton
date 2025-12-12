import { BaseModel } from "../types/common";
import type { Permission as IPermission } from '@skeleton/shared-types';

/**
 * 权限类型定义
 * 使用 @skeleton/shared-types 中的统一类型定义
 */
export type { Permission } from '@skeleton/shared-types';

// 类型别名，保持向后兼容
export type Permission = IPermission;

export interface CreateAndUpdatePermissionQueryDto {
  name: string;
  resource: string;
  action: string;
  description?: string;
}

