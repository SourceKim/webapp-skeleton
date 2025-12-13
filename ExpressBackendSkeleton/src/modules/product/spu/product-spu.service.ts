import { Repository, FindOptionsWhere } from 'typeorm';
import { AppDataSource } from '@/configs/database.config';
import { ProductSpu, ProductSpuStatus } from './product-spu.model';
import { HttpException } from '@/exceptions/http.exception';
import { nanoid } from 'nanoid';
import type { PaginationQueryDto } from '@skeleton/shared-types';
import type { CreateProductSpuDto, UpdateProductSpuDto, ProductSpuResponseDto } from '@skeleton/shared-types';
import { transformToCamelCase } from '@/utils/dto-transform.util';
import { QueryFilterBuilder } from '@/utils/query-filter.util';
import { ENV } from '@/configs/env.config';
import { ProductSku, ProductSkuStatus } from '@/modules/product/sku/product-sku.model';
import { ProductSkuAttribute } from '@/modules/product/attribute/product-sku-attribute.model';
import { ProductAttributeValue } from '@/modules/product/attribute/product-attribute-value.model';
import { Material } from '@/modules/material/material.model';

export class ProductSpuService {
    private repository: Repository<ProductSpu>;
    constructor() {
        this.repository = AppDataSource.getRepository(ProductSpu);
    }

    // 由前端根据 material 的 file_path 组合 URL；后端不再返回 URL

    async findAll(query: PaginationQueryDto): Promise<{ items: ProductSpuResponseDto[]; total: number }> {
        const qb = this.repository.createQueryBuilder('spu')
            .leftJoinAndSelect('spu.category', 'category')
            .leftJoinAndSelect('spu.brand', 'brand')
            .leftJoinAndSelect('spu.main_material', 'main_material')
            .leftJoinAndSelect('spu.sub_materials', 'sub_materials');

        if (query.filters) {
            const conditions = QueryFilterBuilder.parseFilters(query.filters, 'spu');
            QueryFilterBuilder.applyFilters(qb, conditions);
        }

        qb.orderBy(`spu.${query.sort_by}`, query.sort_order)
          .skip((query.page - 1) * query.limit)
          .take(query.limit);

        const [items, total] = await qb.getManyAndCount();
        const dtos = items.map(s => transformToCamelCase({
            ...s,
            category_id: s.category?.id,
            brand_id: s.brand?.id,
            main_material_id: s.main_material?.id,
        }) as ProductSpuResponseDto);

        if (dtos.length > 0) {
            const spuIds = dtos.map(i => i.id);
            const prices = await this.repository.manager.createQueryBuilder(ProductSku, 'sku')
                .select('sku.spu_id', 'spu_id')
                .addSelect('MIN(sku.price)', 'min_price')
                .where('sku.spu_id IN (:...ids)', { ids: spuIds })
                .andWhere("sku.status = 'ON_SHELF'")
                .groupBy('sku.spu_id')
                .getRawMany();
            
            const priceMap = new Map(prices.map(p => [p.spu_id, p.min_price]));
            dtos.forEach(d => {
                const p = priceMap.get(d.id);
                d.price = p ? String(p) : undefined;
            });
        }

        return { items: dtos, total };
    }

    async findById(id: string): Promise<ProductSpuResponseDto> {
        const s = await this.repository.findOne({ where: { id }, relations: ['category', 'brand', 'main_material', 'sub_materials'] });
        if (!s) throw new HttpException(404, 'SPU不存在');
        return transformToCamelCase({
            ...s,
            category_id: s.category?.id,
            brand_id: s.brand?.id,
            main_material_id: s.main_material?.id,
        }) as ProductSpuResponseDto;
    }

    async create(data: CreateProductSpuDto): Promise<ProductSpuResponseDto> {
        const s = this.repository.create({
            id: nanoid(16),
            name: data.name,
            sub_title: data.sub_title,
            description: data.description,
            status: data.status ?? ProductSpuStatus.DRAFT,
            category_id: data.category_id || undefined,
            brand_id: data.brand_id || undefined,
            main_material_id: data.main_material_id || undefined,
            detail_content: data.detail_content
        });
        
        // 处理多对多关系 sub_materials
        if (data.sub_material_ids && data.sub_material_ids.length > 0) {
            const materialRepo = this.repository.manager.getRepository(Material);
            const materials = await materialRepo.find({ 
                where: data.sub_material_ids.map(id => ({ id })) as FindOptionsWhere<Material>[]
            });
            s.sub_materials = materials;
        }

        const saved = await this.repository.save(s);
        return await this.findById(saved.id);
    }

    async update(id: string, data: UpdateProductSpuDto): Promise<ProductSpuResponseDto> {
        const s = await this.repository.findOne({ where: { id }, relations: ['category', 'brand', 'main_material', 'sub_materials'] });
        if (!s) throw new HttpException(404, 'SPU不存在');

        s.name = data.name ?? s.name;
        s.sub_title = data.sub_title ?? s.sub_title;
        s.description = data.description ?? s.description;
        s.status = data.status ?? s.status;
        s.detail_content = data.detail_content ?? s.detail_content;

        if (data.sub_material_ids !== undefined) {
            if (data.sub_material_ids && data.sub_material_ids.length > 0) {
                const materialRepo = this.repository.manager.getRepository(Material);
                const materials = await materialRepo.find({ 
                    where: data.sub_material_ids.map(id => ({ id })) as FindOptionsWhere<Material>[]
                });
                s.sub_materials = materials;
            } else {
                s.sub_materials = [];
            }
        }

        if (data.category_id !== undefined) s.category_id = data.category_id || undefined;
        if (data.brand_id !== undefined) s.brand_id = data.brand_id || undefined;
        if (data.main_material_id !== undefined) s.main_material_id = data.main_material_id || undefined;

        await this.repository.save(s);
        return await this.findById(id);
    }

    async remove(id: string): Promise<void> {
        const s = await this.repository.findOne({ where: { id } });
        if (!s) throw new HttpException(404, 'SPU不存在');
        await this.repository.remove(s);
    }

    async generateSkus(spuId: string, items: Array<{ sku_code?: string; sku_name?: string; price?: string; stock?: number; status?: string; is_default?: boolean; attribute_value_ids?: string[] }>): Promise<number> {
        if (!items || items.length === 0) return 0;
        const skuRepo = this.repository.manager.getRepository(ProductSku);
        const skuAttrRepo = this.repository.manager.getRepository(ProductSkuAttribute);
        const valRepo = this.repository.manager.getRepository(ProductAttributeValue);
        // 清空旧 SKU
        await skuRepo.createQueryBuilder().delete().where('spu_id = :spuId', { spuId }).execute();
        // 生成新 SKU
        let count = 0;
        for (const it of items) {
            const sku = skuRepo.create({
                id: nanoid(16),
                sku_code: it.sku_code || nanoid(12),
                sku_name: it.sku_name,
                price: it.price || '0',
                stock: it.stock ?? 0,
                is_default: it.is_default ?? false,
                status: (it.status as ProductSkuStatus) || ProductSkuStatus.ON_SHELF,
                spu_id: spuId
            });
            await skuRepo.save(sku);
            // 写入 SKU 属性关联（如有）
            if (it.attribute_value_ids && it.attribute_value_ids.length > 0) {
                const values = await valRepo.find({ 
                    where: it.attribute_value_ids.map(id => ({ id })) as FindOptionsWhere<ProductAttributeValue>[],
                    relations: ['attribute_key'] 
                });
                for (const v of values) {
                    const sa = skuAttrRepo.create({ 
                        id: nanoid(16),
                        sku_id: sku.id,
                        attribute_key_id: v.attribute_key?.id || '',
                        attribute_value_id: v.id
                    });
                    await skuAttrRepo.save(sa);
                }
            }
            count++;
        }
        return count;
    }
}


