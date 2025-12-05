import { Expose } from 'class-transformer';
import { IsEnum, IsOptional, IsString, MaxLength, IsUrl } from 'class-validator';
import { BaseDTO } from '@/modules/common/common.dto';
import { ProductBrandStatus } from './product-brand.model';

export class ProductBrandDTO extends BaseDTO {
    @Expose()
    name: string = '';

    @Expose()
    description?: string;

    @Expose()
    material_id?: string;

    @Expose()
    website?: string;

    @Expose()
    status: ProductBrandStatus = ProductBrandStatus.ENABLED;
}

export class CreateProductBrandDto {
    @IsString()
    @MaxLength(50)
    name!: string;

    @IsOptional()
    @IsString()
    @MaxLength(200)
    description?: string;

    @IsOptional()
    @IsString()
    material_id?: string;

    @IsOptional()
    @IsString()
    @MaxLength(200)
    website?: string;

    @IsOptional()
    @IsEnum(ProductBrandStatus)
    status?: ProductBrandStatus;
}

export class UpdateProductBrandDto {
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
    material_id?: string;

    @IsOptional()
    @IsString()
    @MaxLength(200)
    website?: string;

    @IsOptional()
    @IsEnum(ProductBrandStatus)
    status?: ProductBrandStatus;
}


