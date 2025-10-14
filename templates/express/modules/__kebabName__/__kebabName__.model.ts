// @ts-nocheck
/* eslint-disable */
import { Entity, Column } from 'typeorm';
import { IsString, IsOptional, IsNotEmpty, MaxLength } from 'class-validator';
import { BaseEntity } from '@/modules/common/base.model';

@Entity('__kebabNamePlural__')
export class __PascalName__ extends BaseEntity {
    @Column({ type: 'varchar', length: 100, unique: true })
    @IsString()
    @IsNotEmpty({ message: '名称不能为空' })
    @MaxLength(100, { message: '名称长度不能超过100个字符' })
    name!: string;

    @Column({ type: 'text', nullable: true })
    @IsOptional()
    @IsString()
    description!: string;

    constructor(partial: Partial<__PascalName__> = {}) {
        super(partial);
    }
}


