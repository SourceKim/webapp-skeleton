import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { IsBoolean, IsEnum, IsOptional, IsString, Length, MaxLength } from 'class-validator';
import { BaseEntity } from '@/modules/common/base.model';
import { User } from '@/modules/user/user.model';

export enum UserAddressTag {
    HOME = 'HOME',
    COMPANY = 'COMPANY',
    SCHOOL = 'SCHOOL',
    OTHER = 'OTHER',
}

export enum UserAddressStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
}

@Entity('user_addresses')
@Index('idx_user_addresses_user', ['user'])
export class UserAddress extends BaseEntity {
    @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user!: User;

    @Column({ type: 'varchar', length: 50 })
    @IsString()
    @MaxLength(50)
    name!: string;

    @Column({ type: 'varchar', length: 20 })
    @IsString()
    @MaxLength(20)
    phone!: string;

    @Column({ type: 'varchar', length: 50 })
    @IsString()
    @MaxLength(50)
    province!: string;

    @Column({ type: 'varchar', length: 50 })
    @IsString()
    @MaxLength(50)
    city!: string;

    @Column({ type: 'varchar', length: 50 })
    @IsString()
    @MaxLength(50)
    district!: string;

    @Column({ type: 'varchar', length: 200 })
    @IsString()
    @MaxLength(200)
    detail!: string;

    @Column({ type: 'varchar', length: 10, nullable: true })
    @IsOptional()
    @IsString()
    @Length(0, 10)
    postal_code?: string;

    @Column({ type: 'boolean', default: false })
    @IsBoolean()
    is_default!: boolean;

    @Column({ type: 'enum', enum: UserAddressTag, nullable: true })
    @IsOptional()
    @IsEnum(UserAddressTag)
    tag?: UserAddressTag;

    @Column({ type: 'enum', enum: UserAddressStatus, default: UserAddressStatus.ACTIVE })
    @IsEnum(UserAddressStatus)
    status!: UserAddressStatus;
}


