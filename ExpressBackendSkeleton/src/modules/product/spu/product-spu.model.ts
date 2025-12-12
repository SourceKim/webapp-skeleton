import { Entity, Column, ManyToOne, JoinColumn, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from '@/modules/common/base.model';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { ProductCategory } from '@/modules/product/category/product-category.model';
import { ProductBrand } from '@/modules/product/brand/product-brand.model';
import { Material } from '@/modules/material/material.model';
import { ProductSpuStatus, type ProductSpu as IProductSpu } from '@skeleton/shared-types';

// 重新导出枚举，保持向后兼容
export { ProductSpuStatus };

@Entity('product_spu')
export class ProductSpu extends BaseEntity implements IProductSpu {
    @Column({ type: 'varchar', length: 255 })
    @IsString()
    @MaxLength(255)
    name!: string;

    @Column({ type: 'varchar', length: 500, nullable: true, name: 'sub_title' })
    @IsOptional()
    @IsString()
    @MaxLength(500)
    sub_title?: string;

    @Column({ type: 'text', nullable: true })
    @IsOptional()
    @IsString()
    description?: string;

    @Column({ type: 'varchar', length: 36, nullable: true, name: 'category_id' })
    category_id?: string | null;

    @ManyToOne(() => ProductCategory, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'category_id' })
    category?: ProductCategory | null;

    @Column({ type: 'varchar', length: 36, nullable: true, name: 'brand_id' })
    brand_id?: string | null;

    @ManyToOne(() => ProductBrand, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'brand_id' })
    brand?: ProductBrand | null;

    @Column({ type: 'enum', enum: ProductSpuStatus, default: ProductSpuStatus.DRAFT })
    @IsEnum(ProductSpuStatus)
    status!: ProductSpuStatus;

    @Column({ type: 'varchar', length: 36, nullable: true, name: 'main_material_id' })
    main_material_id?: string | null;

    @ManyToOne(() => Material, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'main_material_id' })
    main_material?: Material | null;

    @ManyToMany(() => Material)
    @JoinTable({
        name: 'product_spu_sub_materials',
        joinColumn: { name: 'spu_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'material_id', referencedColumnName: 'id' }
    })
    sub_materials?: Material[] | null;

    @Column({ type: 'text', nullable: true, name: 'detail_content' })
    detail_content?: string | null;
}


