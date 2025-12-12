import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from '@/modules/common/base.model';
import { User } from '@/modules/user/user.model';
import {
  PaymentStatus,
  DeliveryStatus,
  OrderStatus,
  PaymentMethod,
  type MallOrder as IMallOrder,
  type MallOrderItem as IMallOrderItem
} from '@skeleton/shared-types';

// 重新导出枚举，保持向后兼容
export { PaymentStatus, DeliveryStatus, OrderStatus, PaymentMethod };

@Entity('mall_orders')
export class MallOrder extends BaseEntity implements IMallOrder {
    @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user!: User;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    total_amount!: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    discount_amount!: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    shipping_amount!: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    payable_amount!: string;

    @Column({ type: 'enum', enum: PaymentMethod, nullable: true })
    payment_method?: PaymentMethod | null;

    @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.UNPAID })
    payment_status!: PaymentStatus;

    @Column({ type: 'timestamp', nullable: true })
    payment_time?: Date | null;

    @Column({ type: 'enum', enum: DeliveryStatus, default: DeliveryStatus.PENDING })
    delivery_status!: DeliveryStatus;

    @Column({ type: 'timestamp', nullable: true })
    delivery_time?: Date | null;

    @Column({ type: 'timestamp', nullable: true })
    received_time?: Date | null;

    @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.UNPAID })
    order_status!: OrderStatus;

    @Column({ type: 'varchar', length: 36 })
    address_id!: string;

    @Column({ type: 'json' })
    address_snapshot!: Record<string, any>;

    @Column({ type: 'varchar', length: 500, nullable: true })
    remark?: string | null;

    @OneToMany(() => MallOrderItem, item => item.order)
    items!: MallOrderItem[];
}

@Entity('mall_order_items')
export class MallOrderItem extends BaseEntity implements IMallOrderItem {
    @ManyToOne(() => MallOrder, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'order_id' })
    order!: MallOrder;

    @Column({ type: 'varchar', length: 36 })
    sku_id!: string;

    @Column({ type: 'json' })
    sku_snapshot!: Record<string, any>;

    @Column({ type: 'int' })
    quantity!: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    unit_price!: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    total_price!: string;
}








