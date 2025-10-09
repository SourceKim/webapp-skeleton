import { IsString, IsOptional, IsEnum, IsBoolean, IsArray, IsObject, MaxLength } from 'class-validator';
import { BaseDTO } from '@/modules/common/common.dto';
import { MaterialType } from '@/modules/material/material.model';
import { MaterialCategory } from '@/modules/material/mateial-category/material-category.model';
import { MaterialTag } from '@/modules/material/mateial-tag/material-tag.model';
import { User } from '@/modules/user/user.model';
import { Expose } from 'class-transformer';

export class MaterialDTO extends BaseDTO {


    @Expose()
    filename?: string;

    @Expose()
    original_name?: string;

    @Expose()
    file_path?: string;

    @Expose()
    mime_type?: string;

    @Expose()
    file_size?: number;

    @Expose()
    type!: MaterialType;

    @Expose()
    material_category?: MaterialCategory;

    @Expose()
    description?: string;

    @Expose()
    material_tags?: MaterialTag[];

    @Expose()
    user!: User;

    @Expose()
    is_public!: boolean;

    @Expose()
    upload_dir?: string;

    @Expose()
    metadata?: Record<string, any>;

    @Expose()
    parent_id?: string;

    @Expose()
    access_count!: number;

    @Expose()
    file_hash?: string;

    @Expose()
    url?: string;
}
    

/**
 * 创建素材DTO
 * 用于上传文件类型素材时的数据验证
 */
export class CreateMaterialDto {
    @IsString()
    @IsOptional()
    @MaxLength(36, { message: '分类ID长度不能超过36个字符' })
    categoryId?: string;

    @IsString()
    @IsOptional()
    @MaxLength(255, { message: '文件名长度不能超过255个字符' })
    filename?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsBoolean()
    @IsOptional()
    is_public?: boolean;

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    tags?: string[];

    @IsObject()
    @IsOptional()
    metadata?: Record<string, any>;

    @IsString()
    @IsOptional()
    @MaxLength(36, { message: '父素材ID长度不能超过36个字符' })
    parent_id?: string;
}

/**
 * 更新素材DTO
 * 用于更新素材信息时的数据验证
 */
export class UpdateMaterialDto {
    @IsString()
    @IsOptional()
    @MaxLength(255, { message: '文件名长度不能超过255个字符' })
    filename?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsBoolean()
    @IsOptional()
    is_public?: boolean;

    @IsString()
    @IsOptional()
    @MaxLength(36, { message: '分类ID长度不能超过36个字符' })
    categoryId?: string;

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    tags?: string[];

    @IsObject()
    @IsOptional()
    metadata?: Record<string, any>;

    @IsString()
    @IsOptional()
    @MaxLength(36, { message: '父素材ID长度不能超过36个字符' })
    parent_id?: string;
}

/**
 * 素材查询DTO
 * 用于查询素材列表时的参数验证
 */
export class MaterialQueryDto {
    @IsEnum(MaterialType)
    @IsOptional()
    type?: MaterialType;

    @IsString()
    @IsOptional()
    categoryId?: string;

    @IsString()
    @IsOptional()
    keyword?: string;

    @IsBoolean()
    @IsOptional()
    is_public?: boolean;

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    tags?: string[];

    @IsString()
    @IsOptional()
    userId?: string;
}