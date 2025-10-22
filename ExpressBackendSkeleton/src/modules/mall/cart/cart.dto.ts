import { Expose, Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import { BaseDTO } from '@/modules/common/common.dto';

export class CartItemDTO extends BaseDTO {
  @Expose()
  cart_id!: string;

  @Expose()
  product_id!: string;

  @Expose()
  quantity!: number;

  @Expose()
  product?: { id: string; name: string; price: number };
}

export class CartDTO extends BaseDTO {
  @Expose()
  user_id!: string;

  @Expose()
  total_price!: number;

  @Expose()
  items?: CartItemDTO[];
}

export class AddCartItemDto {
  @IsString()
  product_id!: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  quantity!: number;
}

export class UpdateCartItemDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  quantity!: number;
}



