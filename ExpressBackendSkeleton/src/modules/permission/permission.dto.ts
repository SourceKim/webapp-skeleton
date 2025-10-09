import { IsString, IsOptional, IsNotEmpty } from 'class-validator';
import { Expose } from 'class-transformer';
import { BaseDTO } from '@/modules/common/common.dto';

export class PermissionDTO extends BaseDTO {
    @Expose()
    name: string = '';

    @Expose()
    description: string = '';

    @Expose()
    resource: string = '';

    @Expose()
    action: string = '';
}

// 创建权限的请求参数
export class CreatePermissionDto {
    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsString()
    @IsNotEmpty()
    resource!: string;

    @IsString()
    @IsNotEmpty()
    action!: string;

    @IsOptional()
    @IsString()
    description?: string;
}

// 更新权限的请求参数
export class UpdatePermissionDto {
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    name?: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    resource?: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    action?: string;

    @IsOptional()
    @IsString()
    description?: string;
}