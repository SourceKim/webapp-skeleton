import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable } from 'typeorm';
import { Permission } from '@/modules/permission/permission.model';
import { User } from '@/modules/user/user.model';
import { BaseEntity } from '@/modules/common/base.model';
import type { Role as IRole } from '@skeleton/shared-types';

@Entity('roles')
export class Role extends BaseEntity implements IRole {
    @Column({ type: 'varchar', length: 100, unique: true })
    name!: string;

    @Column({ type: 'text', nullable: true })
    description!: string;

    @ManyToMany(() => Permission, permission => permission.roles)
    @JoinTable({
        name: 'role_permissions',
        joinColumn: {
            name: 'role_id',
            referencedColumnName: 'id'
        },
        inverseJoinColumn: {
            name: 'permission_id',
            referencedColumnName: 'id'
        }
    })
    permissions!: Permission[];

    @ManyToMany(() => User, user => user.roles)
    users!: User[];

    constructor(partial: Partial<Role> = {}) {
        super(partial);
    }
} 