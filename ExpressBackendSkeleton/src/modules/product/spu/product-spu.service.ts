import { Repository } from 'typeorm';
import { AppDataSource } from '@/configs/database.config';
import { ProductSpu, ProductSpuStatus } from './product-spu.model';
import { HttpException } from '@/exceptions/http.exception';
import { nanoid } from 'nanoid';
import { PaginationQueryDto } from '@/modules/common/common.dto';
import { plainToInstance } from 'class-transformer';
import { CreateProductSpuDto, ProductSpuDTO, UpdateProductSpuDto } from './product-spu.dto';
import { QueryFilterBuilder } from '@/utils/query-filter.util';
import { ENV } from '@/configs/env.config';
import { ProductSku } from '@/modules/product/sku/product-sku.model';
import { ProductSkuAttribute } from '@/modules/product/attribute/product-sku-attribute.model';
import { ProductAttributeValue } from '@/modules/product/attribute/product-attribute-value.model';

export class ProductSpuService {
    private repository: Repository<ProductSpu>;
    constructor() {
        this.repository = AppDataSource.getRepository(ProductSpu);
    }

    // 由前端根据 material 的 file_path 组合 URL；后端不再返回 URL

    async findAll(query: PaginationQueryDto): Promise<{ items: ProductSpuDTO[]; total: number }> {
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
        const dtos = items.map(s => plainToInstance(ProductSpuDTO, {
            ...s,
            category_id: (s as any)?.category?.id,
            brand_id: (s as any)?.brand?.id,
            main_material_id: (s as any)?.main_material?.id,
        }));
        return { items: dtos, total };
    }

    async findById(id: string): Promise<ProductSpuDTO> {
        const s = await this.repository.findOne({ where: { id }, relations: ['category', 'brand', 'main_material', 'sub_materials'] });
        if (!s) throw new HttpException(404, 'SPU不存在');
        return plainToInstance(ProductSpuDTO, {
            ...s,
            category_id: (s as any)?.category?.id,
            brand_id: (s as any)?.brand?.id,
            main_material_id: (s as any)?.main_material?.id,
        });
    }

    async create(data: CreateProductSpuDto): Promise<ProductSpuDTO> {
        const s = this.repository.create({
            id: nanoid(16),
            name: data.name,
            sub_title: data.sub_title,
            description: data.description,
            status: data.status ?? ProductSpuStatus.DRAFT,
            
            detail_content: data.detail_content
        });
        if (data.category_id) (s as any).category = { id: data.category_id } as any;
        if (data.brand_id) (s as any).brand = { id: data.brand_id } as any;
        if (data.main_material_id) (s as any).main_material = { id: data.main_material_id } as any;
        if (data.sub_material_ids && data.sub_material_ids.length > 0) {
            (s as any).sub_materials = data.sub_material_ids.map(id => ({ id }) as any);
        }

        const saved = await this.repository.save(s);
        return await this.findById(saved.id);
    }

    async update(id: string, data: UpdateProductSpuDto): Promise<ProductSpuDTO> {
        const s = await this.repository.findOne({ where: { id }, relations: ['category', 'brand', 'main_material', 'sub_materials'] });
        if (!s) throw new HttpException(404, 'SPU不存在');

        s.name = data.name ?? s.name;
        s.sub_title = data.sub_title ?? s.sub_title;
        s.description = data.description ?? s.description;
        s.status = data.status ?? s.status;
        if (data.sub_material_ids !== undefined) {
            (s as any).sub_materials = data.sub_material_ids ? data.sub_material_ids.map(id => ({ id }) as any) : [];
        }
        s.detail_content = data.detail_content ?? s.detail_content;

        if (data.category_id !== undefined) (s as any).category = data.category_id ? ({ id: data.category_id } as any) : null;
        if (data.brand_id !== undefined) (s as any).brand = data.brand_id ? ({ id: data.brand_id } as any) : null;
        if (data.main_material_id !== undefined) (s as any).main_material = data.main_material_id ? ({ id: data.main_material_id } as any) : null;

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
                status: (it.status as any) || 'ON_SHELF'
            });
            (sku as any).spu = { id: spuId } as any;
            await skuRepo.save(sku);
            // 写入 SKU 属性关联（如有）
            if (it.attribute_value_ids && it.attribute_value_ids.length > 0) {
                const values = await valRepo.find({ where: it.attribute_value_ids.map(id => ({ id })) as any, relations: ['attribute_key'] });
                for (const v of values) {
                    const sa = skuAttrRepo.create({ id: nanoid(16) } as any);
                    (sa as any).sku = { id: sku.id } as any;
                    (sa as any).attribute_key = { id: (v as any).attribute_key?.id } as any;
                    (sa as any).attribute_value = { id: v.id } as any;
                    await skuAttrRepo.save(sa);
                }
            }
            count++;
        }
        return count;
    }
}


