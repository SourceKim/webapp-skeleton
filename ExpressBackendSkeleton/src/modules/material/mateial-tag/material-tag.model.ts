import { Material } from '@/modules/material/material.model';
import { Entity, Column, ManyToMany, Index } from 'typeorm';
import { BaseEntity } from '@/modules/common/base.model';
import type { MaterialTag as IMaterialTag } from '@skeleton/shared-types';

/**
 * 素材标签实体
 * 用于管理素材的标签
 */
@Entity('material_tags')
export class MaterialTag extends BaseEntity implements IMaterialTag {
    /**
     * 标签名称
     */
    @Column({ type: 'varchar', length: 50, unique: true })
    name!: string;

    /**
     * 标签描述
     */
    @Column({ type: 'varchar', length: 200, nullable: true })
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