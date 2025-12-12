import { Expose, Type } from 'class-transformer';

// 请求 DTO 已迁移到 @skeleton/shared-types，请使用 type import
// 例如: import type { CreateCartDto, UpdateCartDto, UpdateSelectedDto } from '@skeleton/shared-types'

export class CartItemDto {
    @Expose() id!: string;
    @Expose() quantity!: number;
    @Expose() selected!: boolean;
    @Expose() sku!: any;
}


