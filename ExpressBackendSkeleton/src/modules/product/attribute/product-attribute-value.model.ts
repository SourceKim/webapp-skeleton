import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '@/modules/common/base.model';
import { ProductAttributeKey } from './product-attribute-key.model';
import { Material } from '@/modules/material/material.model';
import type { ProductAttributeValue as IProductAttributeValue } from '@skeleton/shared-types';

@Entity('product_attribute_values')
export class ProductAttributeValue extends BaseEntity implements IProductAttributeValue {
    @Column({ type: 'varchar', length: 36, name: 'attribute_key_id' })
    attribute_key_id!: string;

    @ManyToOne(() => ProductAttributeKey, k => k.values, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'attribute_key_id' })
    attribute_key!: ProductAttributeKey;

    @Column({ type: 'varchar', length: 100 })
    value!: string;

    @Column({ type: 'varchar', length: 100 })
    value_id!: string;

    @ManyToOne(() => Material, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'image_id' })
    image?: Material | null;
}


