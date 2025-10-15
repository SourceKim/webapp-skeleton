import { Entity, Column, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from '@/modules/common/base.model';
import { IsEnum, IsInt, IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator';
import { Material } from '@/modules/material/material.model';

export enum ProductStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive'
}

@Entity('products')
export class Product extends BaseEntity {
  @Column({ type: 'varchar', length: 150 })
  @IsString()
  @MaxLength(150)
  name!: string;

  @Column({ type: 'text', nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  @IsNumber()
  @Min(0)
  price!: number;

  @Column({ type: 'int', default: 0 })
  @IsInt()
  @Min(0)
  stock!: number;

  @Column({ type: 'enum', enum: ProductStatus, default: ProductStatus.ACTIVE })
  @IsEnum(ProductStatus)
  status!: ProductStatus;

  @Column({ type: 'varchar', length: 36, nullable: true, name: 'category_id' })
  @IsOptional()
  @IsString()
  @MaxLength(36)
  category_id?: string;

  @ManyToMany(() => Material)
  @JoinTable({
    name: 'product_material_relations',
    joinColumn: { name: 'product_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'material_id', referencedColumnName: 'id' }
  })
  materials?: Material[];

  constructor(partial: Partial<Product> = {}) {
    super(partial);
  }
}


