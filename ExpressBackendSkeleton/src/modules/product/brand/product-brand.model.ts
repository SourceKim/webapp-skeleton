import { Entity, Column, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { BaseEntity } from '@/modules/common/base.model';
import { Material } from '@/modules/material/material.model';
import { ProductBrandStatus, type ProductBrand as IProductBrand } from '@skeleton/shared-types';

// 重新导出枚举，保持向后兼容
export { ProductBrandStatus };

@Entity('product_brands')
@Unique('uniq_product_brand_name', ['name'])
export class ProductBrand extends BaseEntity implements IProductBrand {
    @Column({ type: 'varchar', length: 50 })
    name!: string;

    @Column({ type: 'varchar', length: 200, nullable: true })
    description?: string;

    @ManyToOne(() => Material, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'material_id' })
    material?: Material | null;

    @Column({ type: 'varchar', length: 200, nullable: true })
    website?: string;

    @Column({ type: 'enum', enum: ProductBrandStatus, default: ProductBrandStatus.ENABLED })
    status!: ProductBrandStatus;
}


