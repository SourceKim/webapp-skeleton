import { PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { IsString, IsDate, IsOptional } from 'class-validator';
import type { BaseEntity as IBaseEntity } from '@skeleton/shared-types';

/**
 * 基础模型类
 * 包含所有模型共有的字段和方法
 * 实现 shared-types 中的 BaseEntity 接口
 */
export abstract class BaseEntity implements IBaseEntity {
    @PrimaryColumn({ type: 'varchar', length: 36 })
    @IsString()
    id!: string;

    @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
    @IsDate()
    created_at!: Date;

    @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
    @IsDate()
    updated_at!: Date;

    @DeleteDateColumn({ type: 'timestamp', name: 'deleted_at', nullable: true })
    @IsOptional()
    @IsDate()
    deleted_at?: Date;

    constructor(partial: Partial<BaseEntity> = {}) {
        Object.assign(this, partial);
    }
}
