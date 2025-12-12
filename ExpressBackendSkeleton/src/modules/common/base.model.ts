import { PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import type { BaseEntity as IBaseEntity } from '@skeleton/shared-types';

/**
 * 基础模型类
 * 包含所有模型共有的字段和方法
 * 实现 shared-types 中的 BaseEntity 接口
 */
export abstract class BaseEntity implements IBaseEntity {
    @PrimaryColumn({ type: 'varchar', length: 36 })
    id!: string;

    @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
    created_at!: Date;

    @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
    updated_at!: Date;

    @DeleteDateColumn({ type: 'timestamp', name: 'deleted_at', nullable: true })
    deleted_at?: Date;

    constructor(partial: Partial<BaseEntity> = {}) {
        Object.assign(this, partial);
    }
}
