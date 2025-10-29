import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { BaseEntity } from '@/modules/common/base.model';
import { IsBoolean, IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { ProductSpu } from '@/modules/product/spu/product-spu.model';
import { ProductAttributeValue } from './product-attribute-value.model';

export enum AttributeType {
    TEXT = 'TEXT',
    COLOR = 'COLOR',
    IMAGE = 'IMAGE',
}

@Entity('product_attribute_keys')
export class ProductAttributeKey extends BaseEntity {
    @ManyToOne(() => ProductSpu, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'spu_id' })
    spu!: ProductSpu;

    @Column({ type: 'varchar', length: 50 })
    @IsString()
    @MaxLength(50)
    name!: string;

    @Column({ type: 'varchar', length: 50 })
    @IsString()
    @MaxLength(50)
    key!: string;

    @Column({ type: 'enum', enum: AttributeType, default: AttributeType.TEXT })
    @IsEnum(AttributeType)
    type!: AttributeType;

    @Column({ type: 'boolean', default: false })
    @IsBoolean()
    required!: boolean;

    @OneToMany(() => ProductAttributeValue, v => v.attribute_key)
    values?: ProductAttributeValue[];
}


