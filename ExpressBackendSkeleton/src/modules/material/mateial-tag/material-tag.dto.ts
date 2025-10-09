import { IsString, IsOptional, IsNotEmpty, MaxLength } from 'class-validator';
import { Expose } from 'class-transformer';
import { BaseDTO } from '@/modules/common/common.dto';

export class MaterialTagDTO extends BaseDTO {
    @Expose()
    name!: string;

    @Expose()
    description?: string;
}

export class CreateMaterialTagDTO {
    @IsString()
    @MaxLength(50, { message: '标签名称不能超过50个字符' })
    name!: string;

    @IsString()
    @IsOptional()
    @MaxLength(200, { message: '标签描述不能超过200个字符' })
    description?: string;
}

export class UpdateMaterialTagDTO {
    @IsString()
    @IsOptional()
    @MaxLength(50, { message: '标签名称不能超过50个字符' })
    name?: string;

    @IsString()
    @IsOptional()
    @MaxLength(200, { message: '标签描述不能超过200个字符' })
    description?: string;
}
