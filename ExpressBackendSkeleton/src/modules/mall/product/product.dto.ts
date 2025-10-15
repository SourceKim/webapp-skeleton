import { Expose, Type } from 'class-transformer';
import { IsArray, IsEnum, IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator';
import { BaseDTO } from '@/modules/common/common.dto';
import { ProductStatus } from './product.model';

export class ProductDTO extends BaseDTO {
  @Expose()
  name!: string;

  @Expose()
  description?: string;

  @Expose()
  price!: number;

  @Expose()
  stock!: number;

  @Expose()
  status!: ProductStatus;

  @Expose()
  category_id?: string;

  @Expose()
  materials?: { id: string; filename?: string; file_path?: string; type?: string }[];
}

export class CreateProductDto {
  @IsString()
  @MaxLength(150)
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price!: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  stock!: number;

  @IsEnum(ProductStatus)
  status!: ProductStatus;

  @IsOptional()
  @IsString()
  @MaxLength(36)
  category_id?: string;

  @IsOptional()
  @IsArray()
  material_ids?: string[];
}

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  @MaxLength(150)
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  stock?: number;

  @IsOptional()
  @IsEnum(ProductStatus)
  status?: ProductStatus;

  @IsOptional()
  @IsString()
  @MaxLength(36)
  category_id?: string;

  @IsOptional()
  @IsArray()
  material_ids?: string[];
}

export interface ProductQueryDto {
  page: number;
  limit: number;
  sort_by: string;
  sort_order: 'ASC' | 'DESC';
  filters?: Record<string, any>;
}


