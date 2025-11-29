import { Entity, Column, OneToMany, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../common/base.model';
import { Material } from '../../material/material.model';
import { IsString, IsOptional, IsInt, IsNumber } from 'class-validator';

@Entity('shop_intros')
export class ShopIntro extends BaseEntity {
    @Column({ length: 100, comment: '店铺名称' })
    @IsString()
    name!: string;

    @Column({ length: 500, nullable: true, comment: '店铺简介' })
    @IsString()
    @IsOptional()
    introduction?: string;

    @Column({ type: 'text', nullable: true, comment: '店铺详情' })
    @IsString()
    @IsOptional()
    detail?: string;

    @Column({ length: 20, nullable: true, comment: '联系电话' })
    @IsString()
    @IsOptional()
    contact_phone?: string;

    @Column({ type: 'decimal', precision: 10, scale: 6, nullable: true, comment: '经度' })
    @IsNumber()
    @IsOptional()
    longitude?: number;

    @Column({ type: 'decimal', precision: 10, scale: 6, nullable: true, comment: '纬度' })
    @IsNumber()
    @IsOptional()
    latitude?: number;

    @Column({ length: 255, nullable: true, comment: '详细地址' })
    @IsString()
    @IsOptional()
    address?: string;

    @OneToMany(() => ShopIntroBanner, banner => banner.shop_intro, { cascade: true })
    banners!: ShopIntroBanner[];
}

@Entity('shop_intro_banners')
export class ShopIntroBanner extends BaseEntity {
    @Column({ name: 'shop_intro_id', length: 36 })
    shop_intro_id!: string;

    @ManyToOne(() => ShopIntro, shopIntro => shopIntro.banners, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'shop_intro_id' })
    shop_intro!: ShopIntro;

    @Column({ name: 'material_id', length: 36 })
    material_id!: string;

    @ManyToOne(() => Material)
    @JoinColumn({ name: 'material_id' })
    material?: Material;

    @Column({ name: 'sort_order', type: 'int', default: 0 })
    @IsInt()
    sort_order: number = 0;
}
