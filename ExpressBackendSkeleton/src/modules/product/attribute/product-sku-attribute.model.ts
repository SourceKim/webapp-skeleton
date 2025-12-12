import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '@/modules/common/base.model';
import { ProductSku } from '@/modules/product/sku/product-sku.model';
import { ProductAttributeKey } from './product-attribute-key.model';
import { ProductAttributeValue } from './product-attribute-value.model';
import type { ProductSkuAttribute as IProductSkuAttribute } from '@skeleton/shared-types';

@Entity('product_sku_attributes')
export class ProductSkuAttribute extends BaseEntity implements IProductSkuAttribute {
    @Column({ type: 'varchar', length: 36, name: 'sku_id' })
    sku_id!: string;

    @ManyToOne(() => ProductSku, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'sku_id' })
    sku!: ProductSku;

    @Column({ type: 'varchar', length: 36, name: 'attribute_key_id' })
    attribute_key_id!: string;

    @ManyToOne(() => ProductAttributeKey, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'attribute_key_id' })
    attribute_key!: ProductAttributeKey;

    @Column({ type: 'varchar', length: 36, name: 'attribute_value_id' })
    attribute_value_id!: string;

    @ManyToOne(() => ProductAttributeValue, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'attribute_value_id' })
    attribute_value!: ProductAttributeValue;
}


