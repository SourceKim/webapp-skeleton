import { Entity, Column, ManyToOne, JoinColumn, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from '@/modules/common/base.model';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { ProductCategory } from '@/modules/product/category/product-category.model';
import { ProductBrand } from '@/modules/product/brand/product-brand.model';
import { Material } from '@/modules/material/material.model';

export enum ProductSpuStatus {
    DRAFT = 'DRAFT',
    ON_SHELF = 'ON_SHELF',
    OFF_SHELF = 'OFF_SHELF',
}

@Entity('product_spu')
export class ProductSpu extends BaseEntity {
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

    @ManyToOne(() => ProductCategory, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'category_id' })
    category?: ProductCategory | null;

    @ManyToOne(() => ProductBrand, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'brand_id' })
    brand?: ProductBrand | null;

    @Column({ type: 'enum', enum: ProductSpuStatus, default: ProductSpuStatus.DRAFT })
    @IsEnum(ProductSpuStatus)
    status!: ProductSpuStatus;

    @ManyToOne(() => Material, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'main_material' })
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


