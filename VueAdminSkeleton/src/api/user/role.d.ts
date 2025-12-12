import type { BaseModel } from '../types/common';
import type { Permission } from '../user/permission.d';
import type { Role as IRole } from '@skeleton/shared-types';

/**
 * 角色类型定义
 * 使用 @skeleton/shared-types 中的统一类型定义
 */
export type { Role } from '@skeleton/shared-types';

// 类型别名，保持向后兼容
export type Role = IRole;

export interface RoleResponseDto extends Role {
  permissions: Permission[];
}

export interface CreateAndUpdateRoleQueryDto {
  name: string;
  description?: string;
}