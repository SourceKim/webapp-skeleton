import { Expose } from 'class-transformer';
import { BaseDTO } from '@/modules/common/common.dto';
import { PermissionDTO } from '@/modules/permission/permission.dto';

export class RoleDTO extends BaseDTO {
    @Expose()
    name: string = '';

    @Expose()
    description: string = '';

    @Expose()
    permissions: PermissionDTO[] = [];
}

// 请求 DTO 已迁移到 @skeleton/shared-types，请使用 type import
// 例如: import type { CreateRoleDto, UpdateRoleDto, AssignPermissionsDto, AssignRolesDto } from '@skeleton/shared-types'