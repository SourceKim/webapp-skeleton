import { Entity, Column, OneToMany, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '@/modules/common/base.model';
import { IsNumber, IsString, Min } from 'class-validator';
import { User } from '@/modules/user/user.model';
import { CartItem } from './cart-item.model';

@Entity('carts')
@Index('uniq_cart_user_id', ['user_id'], { unique: true })
export class Cart extends BaseEntity {
  @Column({ type: 'varchar', length: 36, name: 'user_id' })
  @IsString()
  user_id!: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user?: User;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0, name: 'total_price' })
  @IsNumber()
  @Min(0)
  total_price!: number;

  @OneToMany(() => CartItem, (item: CartItem) => item.cart, { cascade: true })
  items?: CartItem[];

  constructor(partial: Partial<Cart> = {}) {
    super(partial);
  }
}


