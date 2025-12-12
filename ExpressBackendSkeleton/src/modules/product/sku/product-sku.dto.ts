import { Expose, Transform } from 'class-transformer';
import { BaseDTO } from '@/modules/common/common.dto';
import { ProductSkuStatus } from './product-sku.model';
import { convertSkuStatusToChinese } from '@/utils/status.util';

export class ProductSkuDTO extends BaseDTO {
    @Expose() spu_id!: string;
    @Expose() sku_code!: string;
    @Expose() sku_name?: string;
    @Expose() price!: string;
    @Expose() original_price?: string;
    @Expose() cost_price?: string;
    @Expose() stock!: number;
    @Expose()
    @Transform(({ value }) => convertSkuStatusToChinese(value))
    status!: string;
    @Expose() is_default!: boolean;
    @Expose() attributes?: Array<{ key_id: string; value_id: string; key_name?: string; value?: string }>;
}

// 请求 DTO 已迁移到 @skeleton/shared-types，请使用 type import
// 例如: import type { CreateProductSkuDto, UpdateProductSkuDto, UpdateSkuPriceDto, UpdateSkuStockDto, UpdateSkuStatusDto } from '@skeleton/shared-types'


