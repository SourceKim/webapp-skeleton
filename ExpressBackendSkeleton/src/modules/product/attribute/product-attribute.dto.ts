import { Expose } from 'class-transformer';
import { BaseDTO } from '@/modules/common/common.dto';

export class ProductAttributeKeyDTO extends BaseDTO {
    @Expose() spu_id!: string;
    @Expose() name!: string;
    @Expose() key!: string;
    @Expose() required!: boolean;
}

// 请求 DTO 已迁移到 @skeleton/shared-types，请使用 type import
// 例如: import type { CreateProductAttributeKeyDto, UpdateProductAttributeKeyDto } from '@skeleton/shared-types'

export class ProductAttributeValueDTO extends BaseDTO {
    @Expose() attribute_key_id!: string;
    @Expose() value!: string;
    @Expose() value_id!: string;
    @Expose() image_id?: string;
}

// 请求 DTO 已迁移到 @skeleton/shared-types，请使用 type import
// 例如: import type { CreateProductAttributeValueDto, UpdateProductAttributeValueDto } from '@skeleton/shared-types'


