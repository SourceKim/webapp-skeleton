import { Expose } from 'class-transformer';
import { IsBoolean, IsEnum, IsInt, IsNumberString, IsOptional, IsString, MaxLength } from 'class-validator';
import { BaseDTO } from '@/modules/common/common.dto';
import { ProductSkuStatus } from './product-sku.model';

export class ProductSkuDTO extends BaseDTO {
    @Expose() spu_id!: string;
    @Expose() sku_code!: string;
    @Expose() sku_name?: string;
    @Expose() price!: string;
    @Expose() original_price?: string;
    @Expose() cost_price?: string;
    @Expose() stock!: number;
    @Expose() status!: ProductSkuStatus;
    @Expose() is_default!: boolean;
    @Expose() attributes?: Array<{ key_id: string; value_id: string; key_name?: string; value?: string }>;
}

export class CreateProductSkuDto {
    @IsString() spu_id!: string;
    @IsString() @MaxLength(100) sku_code!: string;
    @IsOptional() @IsString() @MaxLength(500) sku_name?: string;
    @IsNumberString() price!: string;
    @IsOptional() @IsNumberString() original_price?: string;
    @IsOptional() @IsNumberString() cost_price?: string;
    @IsInt() stock!: number;
    @IsOptional() @IsEnum(ProductSkuStatus) status?: ProductSkuStatus;
    @IsOptional() @IsBoolean() is_default?: boolean;
}

export class UpdateProductSkuDto {
    @IsOptional() @IsString() @MaxLength(100) sku_code?: string;
    @IsOptional() @IsString() @MaxLength(500) sku_name?: string;
    @IsOptional() @IsNumberString() price?: string;
    @IsOptional() @IsNumberString() original_price?: string | null;
    @IsOptional() @IsNumberString() cost_price?: string | null;
    @IsOptional() @IsInt() stock?: number;
    @IsOptional() @IsEnum(ProductSkuStatus) status?: ProductSkuStatus;
    @IsOptional() @IsBoolean() is_default?: boolean;
}

export class UpdateSkuPriceDto { @IsNumberString() price!: string; }
export class UpdateSkuStockDto { @IsInt() stock!: number; }
export class UpdateSkuStatusDto { @IsEnum(ProductSkuStatus) status!: ProductSkuStatus; }


