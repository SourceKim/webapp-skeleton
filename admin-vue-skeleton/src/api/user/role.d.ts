import type { BaseModel } from '../types/common';
import type { Permission } from '../user/permission.d';

export interface Role extends BaseModel {
  name: string;
  description?: string;
}

export interface RoleResponseDto extends Role {
  permissions: Permission[];
}

export interface CreateAndUpdateRoleQueryDto {
  name: string;
  description?: string;
}