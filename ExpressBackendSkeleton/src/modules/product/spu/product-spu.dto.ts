import { Expose } from 'class-transformer';
import { IsEnum, IsOptional, IsString, MaxLength, IsArray } from 'class-validator';
import { BaseDTO } from '@/modules/common/common.dto';
import { ProductSpuStatus } from './product-spu.model';
import { MaterialDTO } from '@/modules/material/material.dto';

import { ProductCategoryDTO } from '../category/product-category.dto';
import { ProductBrandDTO } from '../brand/product-brand.dto';

export class ProductSpuDTO extends BaseDTO {
    @Expose()
    name: string = '';

    @Expose()
    sub_title?: string;

    @Expose()
    description?: string;

    @Expose()
    category_id?: string;

    @Expose()
    category?: ProductCategoryDTO;

    @Expose()
    brand_id?: string;

    @Expose()
    brand?: ProductBrandDTO;

    @Expose()
    status: ProductSpuStatus = ProductSpuStatus.DRAFT;

    @Expose()
    main_material_id?: string;

    @Expose()
    main_material?: MaterialDTO;

    @Expose()
    sub_materials?: MaterialDTO[];


    @Expose()
    detail_content?: string;

    @Expose()
    price?: string;
}

export class CreateProductSpuDto {
    @IsString()
    @MaxLength(255)
    name!: string;

    @IsOptional()
    @IsString()
    @MaxLength(500)
    sub_title?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsString()
    category_id?: string;

    @IsOptional()
    @IsString()
    brand_id?: string;

    @IsOptional()
    @IsEnum(ProductSpuStatus)
    status?: ProductSpuStatus;

    @IsOptional()
    @IsString()
    main_material_id?: string;

    @IsOptional()
    @IsArray()
    sub_material_ids?: string[];

    @IsOptional()
    @IsString()
    detail_content?: string;
}

export class UpdateProductSpuDto {
    @IsOptional()
    @IsString()
    @MaxLength(255)
    name?: string;

    @IsOptional()
    @IsString()
    @MaxLength(500)
    sub_title?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsString()
    category_id?: string | null;

    @IsOptional()
    @IsString()
    brand_id?: string | null;

    @IsOptional()
    @IsEnum(ProductSpuStatus)
    status?: ProductSpuStatus;

    @IsOptional()
    @IsString()
    main_material_id?: string | null;

    @IsOptional()
    @IsArray()
    sub_material_ids?: string[] | null;

    @IsOptional()
    @IsString()
    detail_content?: string | null;
}

export class UpdateProductSpuStatusDto {
    @IsEnum(ProductSpuStatus)
    status!: ProductSpuStatus;
}


