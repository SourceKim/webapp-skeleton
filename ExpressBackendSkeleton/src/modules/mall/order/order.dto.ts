import { Expose, Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator';
import { BaseDTO } from '@/modules/common/common.dto';
import { OrderStatus } from './order.model';
import { ProductDTO } from '@/modules/mall/product/product.dto';

export class OrderItemDTO extends BaseDTO {
  @Expose()
  order_id!: string;

  @Expose()
  product_id!: string | null;

  @Expose()
  quantity!: number;

  @Expose()
  unit_price!: number;

  @Expose()
  @Type(() => ProductDTO)
  product?: ProductDTO | null;
}

export class OrderDTO extends BaseDTO {
  @Expose()
  user_id!: string;

  @Expose()
  status!: OrderStatus;

  @Expose()
  total_price!: number;

  @Expose()
  address?: string;

  @Expose()
  shipping_no?: string;

  @Expose()
  remark?: string;

  @Expose()
  @Type(() => OrderItemDTO)
  items?: OrderItemDTO[];

  @Expose()
  paid_at?: Date | null;

  @Expose()
  shipped_at?: Date | null;

  @Expose()
  completed_at?: Date | null;
}

export class CreateOrderDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  address?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  remark?: string;
}

export class UpdateOrderAddressDto {
  @IsString()
  @MaxLength(200)
  address!: string;
}

export class UpdateOrderRemarkDto {
  @IsString()
  @MaxLength(200)
  remark!: string;
}

export class UpdateOrderItemQuantityDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  quantity!: number;
}

export class AdminUpdateOrderStatusDto {
  @IsEnum(OrderStatus)
  status!: OrderStatus;
}


