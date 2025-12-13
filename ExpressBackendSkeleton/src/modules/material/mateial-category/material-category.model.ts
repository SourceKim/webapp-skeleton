import { Material } from '@/modules/material/material.model';
import { Entity, Column, OneToMany, Index } from 'typeorm';
import { BaseEntity } from '@/modules/common/base.model';
import type { MaterialCategory as IMaterialCategory } from '@skeleton/shared-types';

/**
 * 素材分类实体
 * 用于管理素材的分类
 */
@Entity('material_categories')
export class MaterialCategory extends BaseEntity implements IMaterialCategory {
    /**
     * 分类名称
     */
    @Column({ type: 'varchar', length: 50, unique: true })
    name!: string;

    /**
     * 分类描述
     */
    @Column({ type: 'varchar', length: 200, nullable: true })
    description?: string;

    /**
     * 该分类下的所有素材
     * 与Material实体的material_category字段对应
     */
    @OneToMany(() => Material, material => material.material_category)
    materials!: Material[];

    constructor(partial: Partial<MaterialCategory> = {}) {
        super(partial);
    }
}