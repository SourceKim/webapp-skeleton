import { Expose, Transform } from 'class-transformer';
import { BaseDTO } from '@/modules/common/common.dto';
import { ProductBrandStatus } from './product-brand.model';
import { convertEnabledStatusToChinese } from '@/utils/status.util';

export class ProductBrandDTO extends BaseDTO {
    @Expose()
    name: string = '';

    @Expose()
    description?: string;

    @Expose()
    material_id?: string;

    @Expose()
    website?: string;

    @Expose()
    @Transform(({ value }) => convertEnabledStatusToChinese(value))
    status: string = ProductBrandStatus.ENABLED;
}

// 请求 DTO 已迁移到 @skeleton/shared-types，请使用 type import
// 例如: import type { CreateProductBrandDto, UpdateProductBrandDto } from '@skeleton/shared-types'


