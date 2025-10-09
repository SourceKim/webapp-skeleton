import { Material } from '../material.model';
import { Entity, Column, ManyToMany, Index } from 'typeorm';
import { IsString, MaxLength, IsOptional, IsNotEmpty } from 'class-validator';
import { BaseEntity } from '@/modules/common/base.model';

/**
 * 素材标签实体
 * 用于管理素材的标签
 */
@Entity('material_tags')
export class MaterialTag extends BaseEntity {
    /**
     * 标签名称
     */
    @Column({ type: 'varchar', length: 50, unique: true })
    @IsString()
    @IsNotEmpty({ message: '标签名称不能为空' })
    @MaxLength(50, { message: '标签名称不能超过50个字符' })
    name!: string;

    /**
     * 标签描述
     */
    @Column({ type: 'varchar', length: 200, nullable: true })
    @IsOptional()
    @IsString()
    @MaxLength(200, { message: '标签描述不能超过200个字符' })
    description?: string;

    /**
     * 使用该标签的素材
     * 与Material实体的material_tags字段对应
     */
    @ManyToMany(() => Material, material => material.material_tags)
    materials!: Material[];

    constructor(partial: Partial<MaterialTag> = {}) {
        super(partial);
    }
}