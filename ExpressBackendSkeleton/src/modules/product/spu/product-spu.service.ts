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
}


