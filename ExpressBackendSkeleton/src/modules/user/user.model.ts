import { Entity, Column, BeforeInsert, BeforeUpdate, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Role } from '@/modules/role/role.model';
import { BaseEntity } from '@/modules/common/base.model';
import { UserStatus, UserGender, type User as IUser } from '@skeleton/shared-types';

// 重新导出枚举，保持向后兼容
export { UserStatus, UserGender };

@Entity('users')
export class User extends BaseEntity implements IUser {
    @Column({ type: 'varchar', length: 100, unique: true })
    username!: string;

    @Column({ type: 'varchar', length: 100, select: false }) // 默认查询时不返回密码
    password!: string;

    @Column({ type: 'varchar', length: 100, unique: true, nullable: true })
    email?: string;

    @Column({ type: 'varchar', length: 100, nullable: false })
    nickname?: string;

    @Column({ type: 'varchar', length: 20, unique: true, nullable: false })
    phone?: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    avatar?: string;

    @Column({
        type: 'enum',
        enum: UserStatus,
        default: UserStatus.ACTIVE
    })
    status!: UserStatus;

    @Column({ type: 'varchar', length: 500, nullable: true })
    bio?: string; // 用户简介

    @Column({
        type: 'enum',
        enum: UserGender,
        nullable: false
    })
    gender!: UserGender;

    @Column({ type: 'date', nullable: true })
    birthdate?: string; // YYYY-MM-DD

    @ManyToMany(() => Role, role => role.users)
    @JoinTable({
        name: 'user_roles',
        joinColumn: {
            name: 'user_id',
            referencedColumnName: 'id'
        },
        inverseJoinColumn: {
            name: 'role_id',
            referencedColumnName: 'id'
        }
    })
    roles!: Role[];

    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword() {
        if (this.password) {
            this.password = await bcrypt.hash(this.password, 10);
        }
    }

    async comparePassword(password: string): Promise<boolean> {
        if (!this.password) return false;
        return bcrypt.compare(password, this.password);
    }

    constructor(partial: Partial<User> = {}) {
        super(partial);
    }
} 