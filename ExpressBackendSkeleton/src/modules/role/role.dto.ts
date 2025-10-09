import { IsString, IsArray, IsOptional, IsUUID, IsNotEmpty } from 'class-validator';
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

// 创建角色的请求参数
export class CreateRoleDto {
    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsOptional()
    @IsString()
    description?: string;
}

// 更新角色的请求参数
export class UpdateRoleDto {
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    name?: string;

    @IsOptional()
    @IsString()
    description?: string;
}

// 为角色分配权限的请求参数
export class AssignPermissionsDto {
    @IsArray()
    @IsString({ each: true })
    @IsNotEmpty({ each: true })
    permissionIds!: string[];
}

// 为用户分配角色的请求参数
export class AssignRolesDto {
    @IsArray()
    @IsString({ each: true })
    @IsNotEmpty({ each: true })
    roles!: string[];
}