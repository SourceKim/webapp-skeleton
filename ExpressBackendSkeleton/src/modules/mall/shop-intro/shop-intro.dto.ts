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

// 请求 DTO 已迁移到 @skeleton/shared-types，请使用 type import
// 例如: import type { CreateShopIntroDto, UpdateShopIntroDto } from '@skeleton/shared-types'
