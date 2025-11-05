import { IsArray, ArrayNotEmpty, IsString, IsOptional, IsEnum } from 'class-validator';
import { PaymentMethod } from './order.model';

export class OrderPreviewDto {
    @IsArray() @ArrayNotEmpty()
    cart_item_ids!: string[];
}

export class CreateOrderDto {
    @IsArray() @ArrayNotEmpty()
    cart_item_ids!: string[];

    @IsString()
    address_id!: string;

    @IsOptional()
    @IsEnum(PaymentMethod)
    payment_method?: PaymentMethod;

    @IsOptional()
    @IsString()
    remark?: string;
}




