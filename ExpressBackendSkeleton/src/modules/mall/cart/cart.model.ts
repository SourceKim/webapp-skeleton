import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { IsBoolean, IsInt, IsPositive } from 'class-validator';
import { BaseEntity } from '@/modules/common/base.model';
import { User } from '@/modules/user/user.model';
import { ProductSku } from '@/modules/product/sku/product-sku.model';
import type { Cart as ICart } from '@skeleton/shared-types';

@Entity('cart')
@Index('uniq_cart_user_sku', ['user', 'sku'], { unique: true })
export class Cart extends BaseEntity implements ICart {
    @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user!: User;

    @ManyToOne(() => ProductSku, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'sku_id' })
    sku!: ProductSku;

    @Column({ type: 'int', default: 1 })
    @IsInt()
    @IsPositive()
    quantity!: number;

    @Column({ type: 'boolean', default: true })
    @IsBoolean()
    selected!: boolean;
}


