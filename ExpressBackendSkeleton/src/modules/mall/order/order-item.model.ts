import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '@/modules/common/base.model';
import { IsInt, IsNumber, IsString, Min } from 'class-validator';
import { Order } from './order.model';
import { Product } from '@/modules/mall/product/product.model';

@Entity('order_items')
export class OrderItem extends BaseEntity {
  @Column({ type: 'varchar', length: 36, name: 'order_id' })
  @IsString()
  order_id!: string;

  @ManyToOne(() => Order, order => order.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id', referencedColumnName: 'id' })
  order?: Order;

  @Column({ type: 'varchar', length: 36, name: 'product_id' })
  @IsString()
  product_id!: string;

  @ManyToOne(() => Product, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'product_id', referencedColumnName: 'id' })
  product?: Product | null;

  @Column({ type: 'int', default: 1 })
  @IsInt()
  @Min(1)
  quantity!: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0, name: 'unit_price' })
  @IsNumber()
  @Min(0)
  unit_price!: number;
}


