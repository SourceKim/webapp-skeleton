import { Expose } from 'class-transformer';
import { IsEnum, IsOptional, IsString, MaxLength, IsInt, Min } from 'class-validator';
import { BaseDTO } from '@/modules/common/common.dto';
import { ProductCategoryStatus } from './product-category.model';

export class ProductCategoryDTO extends BaseDTO {
    @Expose()
    name: string = '';

    @Expose()
    description?: string;

    @Expose()
    parent_id?: string;

    @Expose()
    level: number = 0;

    @Expose()
    material_id?: string;

    @Expose()
    image_url?: string;

    @Expose()
    status: ProductCategoryStatus = ProductCategoryStatus.ENABLED;
}

export class CreateProductCategoryDto {
    @IsString()
    @MaxLength(50)
    name!: string;

    @IsOptional()
    @IsString()
    @MaxLength(200)
    description?: string;

    @IsOptional()
    @IsString()
    parent_id?: string;

    @IsOptional()
    @IsString()
    material_id?: string;

    @IsOptional()
    @IsEnum(ProductCategoryStatus)
    status?: ProductCategoryStatus;
}

export class UpdateProductCategoryDto {
    @IsOptional()
    @IsString()
    @MaxLength(50)
    name?: string;

    @IsOptional()
    @IsString()
    @MaxLength(200)
    description?: string;

    @IsOptional()
    @IsString()
    parent_id?: string | null;

    @IsOptional()
    @IsString()
    material_id?: string | null;

    @IsOptional()
    @IsEnum(ProductCategoryStatus)
    status?: ProductCategoryStatus;
}


