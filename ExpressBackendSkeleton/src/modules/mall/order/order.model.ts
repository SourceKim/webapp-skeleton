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

/**
 * 订单地址快照类型
 * 保存下单时的地址信息快照
 */
export interface OrderAddressSnapshot {
  name: string;
  phone: string;
  province: string;
  city: string;
  country: string;
  town?: string | null;
  detail: string;
  postal_code?: string | null;
}

/**
 * SKU 属性值快照
 */
export interface SkuAttributeSnapshot {
  key_id: string;
  key_name: string;
  value_id: string;
  value: string;
}

/**
 * SPU 快照
 */
export interface SpuSnapshot {
  id: string;
  name: string;
  sub_title?: string | null;
  main_material?: {
    file_path?: string;
  } | null;
}

/**
 * 订单 SKU 快照类型
 * 保存下单时的 SKU 信息快照
 */
export interface OrderSkuSnapshot {
  id: string;
  price: number;
  attributes: SkuAttributeSnapshot[];
  spu: SpuSnapshot;
}

@Entity('mall_orders')
export class MallOrder extends BaseEntity implements IMallOrder {
    @Column({ type: 'varchar', length: 36, name: 'user_id' })
    user_id!: string;

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
    address_snapshot!: OrderAddressSnapshot;

    @Column({ type: 'varchar', length: 500, nullable: true })
    remark?: string | null;

    @OneToMany(() => MallOrderItem, item => item.order)
    items!: MallOrderItem[];
}

@Entity('mall_order_items')
export class MallOrderItem extends BaseEntity implements IMallOrderItem {
    @Column({ type: 'varchar', length: 36, name: 'order_id' })
    order_id!: string;

    @ManyToOne(() => MallOrder, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'order_id' })
    order!: MallOrder;

    @Column({ type: 'varchar', length: 36 })
    sku_id!: string;

    @Column({ type: 'json' })
    sku_snapshot!: OrderSkuSnapshot;

    @Column({ type: 'int' })
    quantity!: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    unit_price!: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    total_price!: string;
}








