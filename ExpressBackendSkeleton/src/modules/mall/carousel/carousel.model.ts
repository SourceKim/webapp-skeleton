import { Entity, Column, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '@/modules/common/base.model';
import { Material } from '@/modules/material/material.model';
import { ProductSpu } from '@/modules/product/spu/product-spu.model';
import type { Carousel as ICarousel } from '@skeleton/shared-types';

@Entity('carousels')
export class Carousel extends BaseEntity implements ICarousel {
    @Column({ length: 100, nullable: true, comment: '轮播图标题' })
    title?: string;

    @Column({ name: 'material_id', length: 36, comment: '关联图片素材ID' })
    material_id!: string;

    @ManyToOne(() => Material)
    @JoinColumn({ name: 'material_id' })
    material?: Material;

    @Column({ name: 'spu_id', length: 36, nullable: true, comment: '关联商品SPU ID' })
    spu_id?: string;

    @ManyToOne(() => ProductSpu)
    @JoinColumn({ name: 'spu_id' })
    spu?: ProductSpu;

    @Column({ name: 'sort_order', type: 'int', default: 0, comment: '排序权重' })
    sort_order: number = 0;

    @Column({ name: 'is_active', type: 'boolean', default: true, comment: '是否启用' })
    is_active: boolean = true;
}
