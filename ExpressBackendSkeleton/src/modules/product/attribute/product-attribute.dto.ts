import { Expose } from 'class-transformer';
import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';
import { BaseDTO } from '@/modules/common/common.dto';

export class ProductAttributeKeyDTO extends BaseDTO {
    @Expose() spu_id!: string;
    @Expose() name!: string;
    @Expose() key!: string;
    @Expose() required!: boolean;
}

export class CreateProductAttributeKeyDto {
    @IsString() spu_id!: string;
    @IsString() @MaxLength(50) name!: string;
    @IsOptional() @IsString() @MaxLength(50) key?: string; // 可选，后端会自动生成
    @IsOptional() @IsBoolean() required?: boolean;
}

export class UpdateProductAttributeKeyDto {
    @IsOptional() @IsString() @MaxLength(50) name?: string;
    @IsOptional() @IsString() @MaxLength(50) key?: string;
    @IsOptional() @IsBoolean() required?: boolean;
}

export class ProductAttributeValueDTO extends BaseDTO {
    @Expose() attribute_key_id!: string;
    @Expose() value!: string;
    @Expose() value_id!: string;
    @Expose() image_id?: string;
}

export class CreateProductAttributeValueDto {
    @IsString() attribute_key_id!: string;
    @IsString() @MaxLength(100) value!: string;
    @IsOptional() @IsString() @MaxLength(100) value_id?: string; // 可选，后端会自动生成
    @IsOptional() @IsString() image_id?: string;
}

export class UpdateProductAttributeValueDto {
    @IsOptional() @IsString() @MaxLength(100) value?: string;
    @IsOptional() @IsString() @MaxLength(100) value_id?: string;
    @IsOptional() @IsString() image_id?: string | null;
}


