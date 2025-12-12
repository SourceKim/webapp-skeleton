import { Repository } from 'typeorm';
import { AppDataSource } from '@/configs/database.config';
import { ProductBrand, ProductBrandStatus } from './product-brand.model';
import { HttpException } from '@/exceptions/http.exception';
import { nanoid } from 'nanoid';
import { PaginationQueryDto } from '@/modules/common/common.dto';
import { plainToInstance } from 'class-transformer';
import { ProductBrandDTO } from './product-brand.dto';
import type { CreateProductBrandDto, UpdateProductBrandDto } from '@skeleton/shared-types';
import { QueryFilterBuilder } from '@/utils/query-filter.util';
import { ENV } from '@/configs/env.config';

export class ProductBrandService {
    private brandRepository: Repository<ProductBrand>;
    constructor() {
        this.brandRepository = AppDataSource.getRepository(ProductBrand);
    }

    async findAllBrands(query: PaginationQueryDto): Promise<{ items: ProductBrandDTO[]; total: number }> {
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
        const dtos = items.map(b => plainToInstance(ProductBrandDTO, {
            ...b,
            material_id: (b as any)?.material?.id,
        }));
        return { items: dtos, total };
    }

    async findBrandById(id: string): Promise<ProductBrandDTO> {
        const brand = await this.brandRepository.findOne({ where: { id }, relations: ['material'] });
        if (!brand) throw new HttpException(404, '品牌不存在');
        return plainToInstance(ProductBrandDTO, { 
            ...brand, 
            material_id: (brand as any)?.material?.id,
        });
    }

    async createBrand(data: CreateProductBrandDto): Promise<ProductBrandDTO> {
        const existed = await this.brandRepository.findOne({ where: { name: data.name } });
        if (existed) throw new HttpException(400, '品牌名称已存在');

        const brand = this.brandRepository.create({
            id: nanoid(16),
            name: data.name,
            description: data.description,
            website: data.website,
            status: data.status ?? ProductBrandStatus.ENABLED,
        });

        if (data.material_id) {
            // 仅通过外键 ID 绑定，避免额外查询
            (brand as any).material = { id: data.material_id } as any;
        }

        const saved = await this.brandRepository.save(brand);
        const reloaded = await this.brandRepository.findOne({ where: { id: saved.id }, relations: ['material'] });
        return plainToInstance(ProductBrandDTO, { 
            ...reloaded!, 
            material_id: (reloaded as any)?.material?.id,
        });
    }

    async updateBrand(id: string, data: UpdateProductBrandDto): Promise<ProductBrandDTO> {
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
            (brand as any).material = data.material_id ? ({ id: data.material_id } as any) : null;
        }

        await this.brandRepository.save(brand);
        const reloaded = await this.brandRepository.findOne({ where: { id }, relations: ['material'] });
        return plainToInstance(ProductBrandDTO, { 
            ...reloaded!, 
            material_id: (reloaded as any)?.material?.id,
        });
    }

    async deleteBrand(id: string): Promise<void> {
        const brand = await this.brandRepository.findOne({ where: { id } });
        if (!brand) throw new HttpException(404, '品牌不存在');
        await this.brandRepository.remove(brand);
    }
}


