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

// 请求 DTO 已迁移到 @skeleton/shared-types，请使用 type import
// 例如: import type { CreateCarouselDto, UpdateCarouselDto } from '@skeleton/shared-types'
