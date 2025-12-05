import { Expose } from 'class-transformer';
import { IsArray, IsBoolean, IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { BaseDTO } from '@/modules/common/common.dto';
import { AttributeType } from './product-attribute-key.model';

export class ProductAttributeKeyDTO extends BaseDTO {
    @Expose() spu_id!: string;
    @Expose() name!: string;
    @Expose() key!: string;
    @Expose() type!: AttributeType;
    @Expose() required!: boolean;
}

export class CreateProductAttributeKeyDto {
    @IsString() spu_id!: string;
    @IsString() @MaxLength(50) name!: string;
    @IsString() @MaxLength(50) key!: string;
    @IsEnum(AttributeType) type!: AttributeType;
    @IsOptional() @IsBoolean() required?: boolean;
}

export class UpdateProductAttributeKeyDto {
    @IsOptional() @IsString() @MaxLength(50) name?: string;
    @IsOptional() @IsString() @MaxLength(50) key?: string;
    @IsOptional() @IsEnum(AttributeType) type?: AttributeType;
    @IsOptional() @IsBoolean() required?: boolean;
}

export class ProductAttributeValueDTO extends BaseDTO {
    @Expose() attribute_key_id!: string;
    @Expose() value!: string;
    @Expose() value_id!: string;
    @Expose() image_id?: string;
    @Expose() color_hex?: string;
}

export class CreateProductAttributeValueDto {
    @IsString() attribute_key_id!: string;
    @IsString() @MaxLength(100) value!: string;
    @IsString() @MaxLength(100) value_id!: string;
    @IsOptional() @IsString() image_id?: string;
    @IsOptional() @IsString() color_hex?: string;
}

export class UpdateProductAttributeValueDto {
    @IsOptional() @IsString() @MaxLength(100) value?: string;
    @IsOptional() @IsString() @MaxLength(100) value_id?: string;
    @IsOptional() @IsString() image_id?: string | null;
    @IsOptional() @IsString() color_hex?: string | null;
}


