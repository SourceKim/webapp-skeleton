import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from '@/modules/common/base.model';
import { User } from '@/modules/user/user.model';

export enum PaymentStatus { UNPAID = 'UNPAID', PAID = 'PAID', REFUNDED = 'REFUNDED' }
export enum DeliveryStatus { PENDING = 'PENDING', SHIPPED = 'SHIPPED', DELIVERED = 'DELIVERED' }
export enum OrderStatus { PENDING = 'PENDING', CONFIRMED = 'CONFIRMED', CANCELED = 'CANCELED', COMPLETED = 'COMPLETED' }
export enum PaymentMethod { ALIPAY = 'ALIPAY', WECHAT = 'WECHAT', CASH = 'CASH' }

@Entity('mall_orders')
export class MallOrder extends BaseEntity {
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

    @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
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
export class MallOrderItem extends BaseEntity {
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








