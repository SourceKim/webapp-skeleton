import { Entity, Column, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { BaseEntity } from '@/modules/common/base.model';
import { IsInt, IsString, Min } from 'class-validator';
import { Cart } from './cart.model';
import { Product } from '@/modules/mall/product/product.model';

@Entity('cart_items')
@Unique('uniq_cart_product', ['cart_id', 'product_id'])
export class CartItem extends BaseEntity {
  @Column({ type: 'varchar', length: 36, name: 'cart_id' })
  @IsString()
  cart_id!: string;

  @ManyToOne(() => Cart, cart => cart.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cart_id', referencedColumnName: 'id' })
  cart?: Cart;

  @Column({ type: 'varchar', length: 36, name: 'product_id' })
  @IsString()
  product_id!: string;

  @ManyToOne(() => Product, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id', referencedColumnName: 'id' })
  product?: Product;

  @Column({ type: 'int', default: 1 })
  @IsInt()
  @Min(1)
  quantity!: number;
}



