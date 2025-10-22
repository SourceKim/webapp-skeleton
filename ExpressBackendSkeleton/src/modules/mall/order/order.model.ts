import { Entity, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '@/modules/common/base.model';
import { IsEnum, IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator';
import { User } from '@/modules/user/user.model';
import { OrderItem } from './order-item.model';

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  SHIPPED = 'shipped',
  COMPLETED = 'completed',
  CANCELED = 'canceled'
}

@Entity('orders')
export class Order extends BaseEntity {
  @Column({ type: 'varchar', length: 36, name: 'user_id' })
  @IsString()
  user_id!: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user?: User;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
  @IsEnum(OrderStatus)
  status!: OrderStatus;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0, name: 'total_price' })
  @IsNumber()
  @Min(0)
  total_price!: number;

  @Column({ type: 'varchar', length: 200, nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  address?: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  shipping_no?: string;

  @Column({ type: 'text', nullable: true })
  @IsOptional()
  @IsString()
  remark?: string;

  @Column({ type: 'timestamp', nullable: true, name: 'paid_at' })
  paid_at?: Date | null;

  @Column({ type: 'timestamp', nullable: true, name: 'shipped_at' })
  shipped_at?: Date | null;

  @Column({ type: 'timestamp', nullable: true, name: 'completed_at' })
  completed_at?: Date | null;

  @OneToMany(() => OrderItem, (item: OrderItem) => item.order, { cascade: true })
  items?: OrderItem[];

  constructor(partial: Partial<Order> = {}) {
    super(partial);
  }
}


