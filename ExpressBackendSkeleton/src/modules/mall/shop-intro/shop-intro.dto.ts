import { IsString, IsOptional, IsArray, IsNotEmpty, IsNumber } from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { BaseDTO } from '../../common/common.dto';
import { MaterialDTO } from '../../material/material.dto';

export class ShopIntroBannerDTO extends BaseDTO {
    @Expose()
    material_id!: string;

    @Expose()
    @Type(() => MaterialDTO)
    material?: MaterialDTO;

    @Expose()
    sort_order!: number;
}

export class ShopIntroDTO extends BaseDTO {
    @Expose()
    name!: string;

    @Expose()
    introduction?: string;

    @Expose()
    detail?: string;

    @Expose()
    contact_phone?: string;

    @Expose()
    longitude?: number;

    @Expose()
    latitude?: number;

    @Expose()
    address?: string;

    @Expose()
    @Type(() => ShopIntroBannerDTO)
    banners?: ShopIntroBannerDTO[];
}

export class CreateShopIntroDto {
    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsString()
    @IsOptional()
    introduction?: string;

    @IsString()
    @IsOptional()
    detail?: string;

    @IsString()
    @IsOptional()
    contact_phone?: string;

    @IsNumber()
    @IsOptional()
    longitude?: number;

    @IsNumber()
    @IsOptional()
    latitude?: number;

    @IsString()
    @IsOptional()
    address?: string;

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    banner_ids?: string[];
}

export class UpdateShopIntroDto {
    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    introduction?: string;

    @IsString()
    @IsOptional()
    detail?: string;

    @IsString()
    @IsOptional()
    contact_phone?: string;

    @IsNumber()
    @IsOptional()
    longitude?: number;

    @IsNumber()
    @IsOptional()
    latitude?: number;

    @IsString()
    @IsOptional()
    address?: string;

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    banner_ids?: string[];
}
