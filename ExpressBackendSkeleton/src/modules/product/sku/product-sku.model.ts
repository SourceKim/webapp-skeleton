import { Entity, Column, ManyToOne, JoinColumn, Index, OneToMany } from 'typeorm';
import { BaseEntity } from '@/modules/common/base.model';
import { IsBoolean, IsEnum, IsInt, IsNumberString, IsOptional, IsString, MaxLength, Min } from 'class-validator';
import { ProductSpu } from '@/modules/product/spu/product-spu.model';
import { ProductSkuAttribute } from '@/modules/product/attribute/product-sku-attribute.model';

export enum ProductSkuStatus {
    ON_SHELF = 'ON_SHELF',
    OFF_SHELF = 'OFF_SHELF',
}

@Entity('product_sku')
export class ProductSku extends BaseEntity {
    @ManyToOne(() => ProductSpu, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'spu_id' })
    spu!: ProductSpu;

    @Column({ type: 'varchar', length: 100 })
    @IsString()
    @MaxLength(100)
    @Index()
    sku_code!: string; // 可与 id 一致或业务编码

    @Column({ type: 'varchar', length: 500, nullable: true })
    @IsOptional()
    @IsString()
    @MaxLength(500)
    sku_name?: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    @IsNumberString()
    price!: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    @IsOptional()
    @IsNumberString()
    original_price?: string | null;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    @IsOptional()
    @IsNumberString()
    cost_price?: string | null;

    @Column({ type: 'int', default: 0 })
    @IsInt()
    @Min(0)
    stock!: number;

    @Column({ type: 'enum', enum: ProductSkuStatus, default: ProductSkuStatus.ON_SHELF })
    @IsEnum(ProductSkuStatus)
    status!: ProductSkuStatus;

    @Column({ type: 'boolean', default: false })
    @IsBoolean()
    is_default!: boolean;

    @OneToMany(() => ProductSkuAttribute, a => a.sku)
    sku_attributes?: ProductSkuAttribute[];
}


