import { Entity, Column, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { BaseEntity } from '@/modules/common/base.model';
import { Material } from '@/modules/material/material.model';
import { ProductBrand } from '@/modules/product/brand/product-brand.model';
import { ProductCategoryStatus, type ProductCategory as IProductCategory } from '@skeleton/shared-types';

// 重新导出枚举，保持向后兼容
export { ProductCategoryStatus };

@Entity('product_categories')
export class ProductCategory extends BaseEntity implements IProductCategory {
    @Column({ type: 'varchar', length: 50 })
    name!: string;

    @Column({ type: 'varchar', length: 200, nullable: true })
    description?: string;

    @ManyToOne(() => ProductCategory, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'parent_id' })
    parent?: ProductCategory | null;

    @Column({ type: 'int', default: 0 })
    level!: number;

    @ManyToOne(() => Material, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'material_id' })
    material?: Material | null;

    @ManyToOne(() => ProductBrand, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'brand_id' })
    brand?: ProductBrand | null;

    @Column({ type: 'enum', enum: ProductCategoryStatus, default: ProductCategoryStatus.ENABLED })
    status!: ProductCategoryStatus;
}


