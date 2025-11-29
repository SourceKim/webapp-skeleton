import { Expose, Type } from 'class-transformer';
import { IsArray, IsBoolean, IsInt, IsOptional, IsPositive, IsString, Length, ArrayNotEmpty } from 'class-validator';

export class CreateCartDto {
    @IsString()
    @Length(1, 36)
    sku_id!: string;

    @Type(() => Number)
    @IsInt()
    @IsPositive()
    quantity!: number;
}

export class UpdateCartDto {
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @IsPositive()
    quantity?: number;
}

export class UpdateSelectedDto {
    @IsBoolean()
    selected!: boolean;

    @IsArray()
    @ArrayNotEmpty()
    @IsString({ each: true })
    cart_item_ids!: string[];
}

export class CartItemDto {
    @Expose() id!: string;
    @Expose() quantity!: number;
    @Expose() selected!: boolean;
    @Expose() sku!: any;
}


