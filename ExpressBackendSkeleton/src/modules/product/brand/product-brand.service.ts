import { Repository } from 'typeorm';
import { AppDataSource } from '@/configs/database.config';
import { ProductBrand, ProductBrandStatus } from './product-brand.model';
import { Material } from '@/modules/material/material.model';
import { HttpException } from '@/exceptions/http.exception';
import { nanoid } from 'nanoid';
import type { PaginationQueryDto } from '@skeleton/shared-types';
import type { CreateProductBrandDto, UpdateProductBrandDto, ProductBrandResponseDto } from '@skeleton/shared-types';
import { transformToCamelCase } from '@/utils/dto-transform.util';
import { QueryFilterBuilder } from '@/utils/query-filter.util';
import { ENV } from '@/configs/env.config';

export class ProductBrandService {
    private brandRepository: Repository<ProductBrand>;
    constructor() {
        this.brandRepository = AppDataSource.getRepository(ProductBrand);
    }

    async findAllBrands(query: PaginationQueryDto): Promise<{ items: ProductBrandResponseDto[]; total: number }> {
        const qb = this.brandRepository.createQueryBuilder('brand')
            .leftJoinAndSelect('brand.material', 'material');

        if (query.filters) {
            const conditions = QueryFilterBuilder.parseFilters(query.filters, 'brand');
            QueryFilterBuilder.applyFilters(qb, conditions);
        }

        qb.orderBy(`brand.${query.sort_by}`, query.sort_order)
          .skip((query.page - 1) * query.limit)
          .take(query.limit);

        const [items, total] = await qb.getManyAndCount();
        const dtos = items.map(b => transformToCamelCase({
            ...b,
            material_id: b.material?.id,
        }) as ProductBrandResponseDto);
        return { items: dtos, total };
    }

    async findBrandById(id: string): Promise<ProductBrandResponseDto> {
        const brand = await this.brandRepository.findOne({ where: { id }, relations: ['material'] });
        if (!brand) throw new HttpException(404, '品牌不存在');
        return transformToCamelCase({ 
            ...brand, 
            material_id: brand.material?.id,
        }) as ProductBrandResponseDto;
    }

    async createBrand(data: CreateProductBrandDto): Promise<ProductBrandResponseDto> {
        const existed = await this.brandRepository.findOne({ where: { name: data.name } });
        if (existed) throw new HttpException(400, '品牌名称已存在');

        const brand = this.brandRepository.create({
            id: nanoid(16),
            name: data.name,
            description: data.description,
            website: data.website,
            status: data.status ?? ProductBrandStatus.ENABLED,
        });

        // 设置 material 关系（如果提供了 material_id）
        if (data.material_id) {
            brand.material = { id: data.material_id } as Material;
        }

        const saved = await this.brandRepository.save(brand);
        const reloaded = await this.brandRepository.findOne({ where: { id: saved.id }, relations: ['material'] });
        return transformToCamelCase({ 
            ...reloaded!, 
            material_id: reloaded?.material?.id,
        }) as ProductBrandResponseDto;
    }

    async updateBrand(id: string, data: UpdateProductBrandDto): Promise<ProductBrandResponseDto> {
        const brand = await this.brandRepository.findOne({ where: { id }, relations: ['material'] });
        if (!brand) throw new HttpException(404, '品牌不存在');

        if (data.name && data.name !== brand.name) {
            const existed = await this.brandRepository.findOne({ where: { name: data.name } });
            if (existed && existed.id !== id) throw new HttpException(400, '品牌名称已存在');
        }

        brand.name = data.name ?? brand.name;
        brand.description = data.description ?? brand.description;
        brand.website = data.website ?? brand.website;
        brand.status = data.status ?? brand.status;
        if (data.material_id !== undefined) {
            brand.material = data.material_id ? ({ id: data.material_id } as Material) : null;
        }

        await this.brandRepository.save(brand);
        const reloaded = await this.brandRepository.findOne({ where: { id }, relations: ['material'] });
        return transformToCamelCase({ 
            ...reloaded!, 
            material_id: reloaded?.material?.id,
        }) as ProductBrandResponseDto;
    }

    async deleteBrand(id: string): Promise<void> {
        const brand = await this.brandRepository.findOne({ where: { id } });
        if (!brand) throw new HttpException(404, '品牌不存在');
        await this.brandRepository.remove(brand);
    }
}


