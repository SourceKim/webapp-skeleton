import { IsString, IsOptional, IsNotEmpty } from 'class-validator';
import { Expose } from 'class-transformer';
import { BaseDTO } from '@/modules/common/common.dto';

export class MaterialCategoryDTO extends BaseDTO {
    @Expose()
    name: string = '';

    @Expose()
    description: string = '';
}

// 创建角色的请求参数
export class CreateMaterialCategoryDto {
    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsOptional()
    @IsString()
    description?: string;
}

// 更新角色的请求参数
export class UpdateMaterialCategoryDto {
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    name?: string;

    @IsOptional()
    @IsString()
    description?: string;
}