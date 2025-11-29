import { IsString, IsOptional, IsBoolean, IsInt, IsNotEmpty } from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { BaseDTO } from '../../common/common.dto';
import { MaterialDTO } from '../../material/material.dto';

export class CarouselDTO extends BaseDTO {
    @Expose()
    title?: string;

    @Expose()
    material_id!: string;

    @Expose()
    @Type(() => MaterialDTO)
    material?: MaterialDTO;

    @Expose()
    spu_id?: string;

    @Expose()
    sort_order!: number;

    @Expose()
    is_active!: boolean;
}

export class CreateCarouselDto {
    @IsString()
    @IsOptional()
    title?: string;

    @IsString()
    @IsNotEmpty()
    material_id!: string;

    @IsString()
    @IsOptional()
    spu_id?: string;

    @IsInt()
    @IsOptional()
    sort_order?: number;

    @IsBoolean()
    @IsOptional()
    is_active?: boolean;
}

export class UpdateCarouselDto {
    @IsString()
    @IsOptional()
    title?: string;

    @IsString()
    @IsOptional()
    material_id?: string;

    @IsString()
    @IsOptional()
    spu_id?: string;

    @IsInt()
    @IsOptional()
    sort_order?: number;

    @IsBoolean()
    @IsOptional()
    is_active?: boolean;
}
