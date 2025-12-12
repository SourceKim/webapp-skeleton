import { Expose, Transform } from 'class-transformer';
import { BaseDTO } from '@/modules/common/common.dto';
import { ProductSpuStatus } from './product-spu.model';
import { MaterialDTO } from '@/modules/material/material.dto';
import { convertSpuStatusToChinese } from '@/utils/status.util';

import { ProductCategoryDTO } from '../category/product-category.dto';
import { ProductBrandDTO } from '../brand/product-brand.dto';

export class ProductSpuDTO extends BaseDTO {
    @Expose()
    name: string = '';

    @Expose()
    sub_title?: string;

    @Expose()
    description?: string;

    @Expose()
    category_id?: string;

    @Expose()
    category?: ProductCategoryDTO;

    @Expose()
    brand_id?: string;

    @Expose()
    brand?: ProductBrandDTO;

    @Expose()
    @Transform(({ value }) => convertSpuStatusToChinese(value))
    status: string = ProductSpuStatus.DRAFT;

    @Expose()
    main_material_id?: string;

    @Expose()
    main_material?: MaterialDTO;

    @Expose()
    sub_materials?: MaterialDTO[];


    @Expose()
    detail_content?: string;

    @Expose()
    price?: string;
}

// 请求 DTO 已迁移到 @skeleton/shared-types，请使用 type import
// 例如: import type { CreateProductSpuDto, UpdateProductSpuDto } from '@skeleton/shared-types'


