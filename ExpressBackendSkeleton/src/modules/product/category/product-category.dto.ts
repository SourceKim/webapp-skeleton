import { Expose, Transform, Type } from 'class-transformer';
import { BaseDTO } from '@/modules/common/common.dto';
import { ProductCategoryStatus } from './product-category.model';
import { MaterialDTO } from '@/modules/material/material.dto';
import { convertEnabledStatusToChinese } from '@/utils/status.util';

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
    @Type(() => MaterialDTO)
    material?: MaterialDTO;

    @Expose()
    brand_id?: string;

    @Expose()
    brand_name?: string;

    @Expose()
    @Transform(({ value }) => convertEnabledStatusToChinese(value))
    status: string = ProductCategoryStatus.ENABLED;
}

// 请求 DTO 已迁移到 @skeleton/shared-types，请使用 type import
// 例如: import type { CreateProductCategoryDto, UpdateProductCategoryDto } from '@skeleton/shared-types'


