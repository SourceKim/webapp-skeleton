import { Repository } from 'typeorm';
import { AppDataSource } from '@/configs/database.config';
import { ProductCategory, ProductCategoryStatus } from './product-category.model';
import { Material } from '@/modules/material/material.model';
import { ProductBrand } from '@/modules/product/brand/product-brand.model';
import { HttpException } from '@/exceptions/http.exception';
import { nanoid } from 'nanoid';
import type { PaginationQueryDto } from '@skeleton/shared-types';
import type { CreateProductCategoryDto, UpdateProductCategoryDto, ProductCategoryResponseDto } from '@skeleton/shared-types';
import { transformToCamelCase } from '@/utils/dto-transform.util';
import { QueryFilterBuilder } from '@/utils/query-filter.util';

export class ProductCategoryService {
    private repository: Repository<ProductCategory>;
    constructor() {
        this.repository = AppDataSource.getRepository(ProductCategory);
    }

    async findAll(query: PaginationQueryDto, parentId?: string | null, level?: number): Promise<{ items: ProductCategoryResponseDto[]; total: number }> {
        const qb = this.repository.createQueryBuilder('category')
            .leftJoinAndSelect('category.parent', 'parent')
            .leftJoinAndSelect('category.material', 'material')
            .leftJoinAndSelect('category.brand', 'brand');

        if (parentId !== undefined) {
            if (parentId === null) qb.andWhere('category.parent_id IS NULL');
            else qb.andWhere('category.parent_id = :pid', { pid: parentId });
        }
        if (level !== undefined) qb.andWhere('category.level = :lvl', { lvl: level });

        if (query.filters) {
            // 支持 brand_id 筛选
            if (query.filters.brand_id) {
                qb.andWhere('category.brand_id = :bid', { bid: query.filters.brand_id });
                delete query.filters.brand_id; // 避免重复处理
            }
            const conditions = QueryFilterBuilder.parseFilters(query.filters, 'category');
            QueryFilterBuilder.applyFilters(qb, conditions);
        }

        qb.orderBy(`category.${query.sort_by}`, query.sort_order)
          .skip((query.page - 1) * query.limit)
          .take(query.limit);

        const [items, total] = await qb.getManyAndCount();
        const dtos = items.map(c => transformToCamelCase({
            ...c,
            parent_id: c.parent?.id,
            material_id: c.material?.id,
            brand_id: c.brand?.id,
            brand_name: c.brand?.name
        }) as ProductCategoryResponseDto);
        return { items: dtos, total };
    }

    async findById(id: string): Promise<ProductCategoryResponseDto> {
        const c = await this.repository.findOne({ where: { id }, relations: ['parent', 'material', 'brand'] });
        if (!c) throw new HttpException(404, '分类不存在');
        return transformToCamelCase({
            ...c,
            parent_id: c.parent?.id,
            material_id: c.material?.id,
            brand_id: c.brand?.id,
            brand_name: c.brand?.name
        }) as ProductCategoryResponseDto;
    }

    async create(data: CreateProductCategoryDto): Promise<ProductCategoryResponseDto> {
        // 同名校验（同一父级下不允许重名）
        {
            const qb = this.repository.createQueryBuilder('c');
            qb.where('c.name = :name', { name: data.name });
            if (data.parent_id) qb.andWhere('c.parent_id = :pid', { pid: data.parent_id });
            else qb.andWhere('c.parent_id IS NULL');
            const existed = await qb.getOne();
            if (existed) throw new HttpException(400, '同级分类名称已存在');
        }
        const entity = this.repository.create({
            id: nanoid(16),
            name: data.name,
            description: data.description,
            status: data.status ?? ProductCategoryStatus.ENABLED,
        });

        // 设置关系对象
        if (data.parent_id) {
            entity.parent = { id: data.parent_id } as ProductCategory;
        }
        if (data.material_id) {
            entity.material = { id: data.material_id } as Material;
        }
        if (data.brand_id) {
            entity.brand = { id: data.brand_id } as ProductBrand;
        }

        // 计算层级
        if (data.parent_id) {
            const parent = await this.repository.findOne({ where: { id: data.parent_id } });
            entity.level = (parent?.level ?? -1) + 1;
        } else {
            entity.level = 0;
        }

        const saved = await this.repository.save(entity);
        // save 方法返回单个实体时，返回类型是 ProductCategory，不是数组
        const savedEntity = Array.isArray(saved) ? saved[0] : saved;
        return await this.findById(savedEntity.id);
    }

    async update(id: string, data: UpdateProductCategoryDto): Promise<ProductCategoryResponseDto> {
        const c = await this.repository.findOne({ where: { id }, relations: ['parent', 'material', 'brand'] });
        if (!c) throw new HttpException(404, '分类不存在');

        // 如果名称或父级发生变化，进行同级重名校验
        const targetName = data.name ?? c.name;
        const targetParentId = data.parent_id === undefined ? c.parent?.id : data.parent_id;
        {
            const qb = this.repository.createQueryBuilder('c');
            qb.where('c.name = :name', { name: targetName })
              .andWhere('c.id <> :id', { id });
            if (targetParentId) qb.andWhere('c.parent_id = :pid', { pid: targetParentId });
            else qb.andWhere('c.parent_id IS NULL');
            const existed = await qb.getOne();
            if (existed) throw new HttpException(400, '同级分类名称已存在');
        }

        c.name = data.name ?? c.name;
        c.description = data.description ?? c.description;
        c.status = data.status ?? c.status;

        if (data.parent_id !== undefined) {
            c.parent = data.parent_id ? ({ id: data.parent_id } as ProductCategory) : null;
            if (data.parent_id) {
                const parent = await this.repository.findOne({ where: { id: data.parent_id } });
                c.level = (parent?.level ?? -1) + 1;
            } else {
                c.level = 0;
            }
        }
        if (data.material_id !== undefined) {
            c.material = data.material_id ? ({ id: data.material_id } as Material) : null;
        }
        if (data.brand_id !== undefined) {
            c.brand = data.brand_id ? ({ id: data.brand_id } as ProductBrand) : null;
        }

        await this.repository.save(c);
        return await this.findById(id);
    }

    async remove(id: string): Promise<void> {
        const c = await this.repository.findOne({ where: { id } });
        if (!c) throw new HttpException(404, '分类不存在');
        await this.repository.remove(c);
    }
}


