import { Entity, Column, ManyToMany } from 'typeorm';
import { Role } from '@/modules/role/role.model';
import { BaseEntity } from '@/modules/common/base.model';
import type { Permission as IPermission } from '@skeleton/shared-types';

@Entity('permissions')
export class Permission extends BaseEntity implements IPermission {
    @Column({ type: 'varchar', length: 100, unique: true })
    name!: string;

    @Column({ type: 'varchar', length: 100 })
    resource!: string;

    @Column({ type: 'varchar', length: 100 })
    action!: string;

    @Column({ type: 'text', nullable: true })
    description!: string;

    @ManyToMany(() => Role, role => role.permissions)
    roles!: Role[];

    constructor(partial: Partial<Permission> = {}) {
        super(partial);
    }
} 