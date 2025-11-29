import { Entity, Column, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { IsEnum, IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator';
import { BaseEntity } from '@/modules/common/base.model';
import { Material } from '@/modules/material/material.model';

import { ProductBrand } from '../brand/product-brand.model';

export enum ProductCategoryStatus {
    ENABLED = 'ENABLED',
    DISABLED = 'DISABLED',
}

@Entity('product_categories')
export class ProductCategory extends BaseEntity {
    @Column({ type: 'varchar', length: 50 })
    @IsString()
    @MaxLength(50)
    name!: string;

    @Column({ type: 'varchar', length: 200, nullable: true })
    @IsOptional()
    @IsString()
    @MaxLength(200)
    description?: string;

    @ManyToOne(() => ProductCategory, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'parent_id' })
    parent?: ProductCategory | null;

    @Column({ type: 'int', default: 0 })
    @IsInt()
    @Min(0)
    level!: number;

    @ManyToOne(() => Material, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'material_id' })
    material?: Material | null;

    @ManyToOne(() => ProductBrand, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'brand_id' })
    brand?: ProductBrand | null;

    @Column({ type: 'enum', enum: ProductCategoryStatus, default: ProductCategoryStatus.ENABLED })
    @IsEnum(ProductCategoryStatus)
    status!: ProductCategoryStatus;
}


