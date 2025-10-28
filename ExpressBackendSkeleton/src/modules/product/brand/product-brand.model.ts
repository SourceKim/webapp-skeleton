import { Entity, Column, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { IsEnum, IsOptional, IsString, MaxLength, IsUrl } from 'class-validator';
import { BaseEntity } from '@/modules/common/base.model';
import { Material } from '@/modules/material/material.model';

export enum ProductBrandStatus {
    ENABLED = 'ENABLED',
    DISABLED = 'DISABLED',
}

@Entity('product_brands')
@Unique('uniq_product_brand_name', ['name'])
export class ProductBrand extends BaseEntity {
    @Column({ type: 'varchar', length: 50 })
    @IsString()
    @MaxLength(50)
    name!: string;

    @Column({ type: 'varchar', length: 200, nullable: true })
    @IsOptional()
    @IsString()
    @MaxLength(200)
    description?: string;

    @ManyToOne(() => Material, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'material_id' })
    material?: Material | null;

    @Column({ type: 'varchar', length: 200, nullable: true })
    @IsOptional()
    @IsString()
    @MaxLength(200)
    website?: string;

    @Column({ type: 'enum', enum: ProductBrandStatus, default: ProductBrandStatus.ENABLED })
    @IsEnum(ProductBrandStatus)
    status!: ProductBrandStatus;
}


