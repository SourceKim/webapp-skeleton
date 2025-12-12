import { Entity, Column, ManyToOne, JoinColumn, Index, OneToMany } from 'typeorm';
import { BaseEntity } from '@/modules/common/base.model';
import { ProductSpu } from '@/modules/product/spu/product-spu.model';
import { ProductSkuAttribute } from '@/modules/product/attribute/product-sku-attribute.model';
import { ProductSkuStatus, type ProductSku as IProductSku } from '@skeleton/shared-types';

// 重新导出枚举，保持向后兼容
export { ProductSkuStatus };

@Entity('product_sku')
export class ProductSku extends BaseEntity implements IProductSku {
    @Column({ type: 'varchar', length: 36, name: 'spu_id' })
    spu_id!: string;

    @ManyToOne(() => ProductSpu, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'spu_id' })
    spu!: ProductSpu;

    @Column({ type: 'varchar', length: 100 })
    @Index()
    sku_code!: string; // 可与 id 一致或业务编码

    @Column({ type: 'varchar', length: 500, nullable: true })
    sku_name?: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    price!: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    original_price?: string | null;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    cost_price?: string | null;

    @Column({ type: 'int', default: 0 })
    stock!: number;

    @Column({ type: 'enum', enum: ProductSkuStatus, default: ProductSkuStatus.ON_SHELF })
    status!: ProductSkuStatus;

    @Column({ type: 'boolean', default: false })
    is_default!: boolean;

    @OneToMany(() => ProductSkuAttribute, a => a.sku)
    sku_attributes?: ProductSkuAttribute[];
}


