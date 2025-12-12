import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '@/modules/common/base.model';
import { User } from '@/modules/user/user.model';
import { UserAddressTag, UserAddressStatus, type UserAddress as IUserAddress } from '@skeleton/shared-types';

// 重新导出枚举，保持向后兼容
export { UserAddressTag, UserAddressStatus };

@Entity('user_addresses')
@Index('idx_user_addresses_user', ['user'])
export class UserAddress extends BaseEntity implements IUserAddress {
    @Column({ type: 'varchar', length: 36, name: 'user_id' })
    user_id!: string;

    @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user!: User;

    @Column({ type: 'varchar', length: 50 })
    name!: string;

    @Column({ type: 'varchar', length: 20 })
    phone!: string;

    @Column({ type: 'varchar', length: 50 })
    province!: string;

    @Column({ type: 'varchar', length: 50 })
    city!: string;

    @Column({ type: 'varchar', length: 50 })
    country!: string;

    @Column({ type: 'varchar', length: 50, nullable: true })
    town?: string;

    @Column({ type: 'varchar', length: 200 })
    detail!: string;

    @Column({ type: 'varchar', length: 10, nullable: true })
    postal_code?: string;

    @Column({ type: 'boolean', default: false })
    is_default!: boolean;

    @Column({ type: 'enum', enum: UserAddressTag, nullable: true })
    tag?: UserAddressTag;

    @Column({ type: 'enum', enum: UserAddressStatus, default: UserAddressStatus.ACTIVE })
    status!: UserAddressStatus;
}


