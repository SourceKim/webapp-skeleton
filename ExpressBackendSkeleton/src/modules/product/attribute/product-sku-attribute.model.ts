import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '@/modules/common/base.model';
import { ProductSku } from '@/modules/product/sku/product-sku.model';
import { ProductAttributeKey } from './product-attribute-key.model';
import { ProductAttributeValue } from './product-attribute-value.model';

@Entity('product_sku_attributes')
export class ProductSkuAttribute extends BaseEntity {
    @ManyToOne(() => ProductSku, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'sku_id' })
    sku!: ProductSku;

    @ManyToOne(() => ProductAttributeKey, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'attribute_key_id' })
    attribute_key!: ProductAttributeKey;

    @ManyToOne(() => ProductAttributeValue, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'attribute_value_id' })
    attribute_value!: ProductAttributeValue;
}


