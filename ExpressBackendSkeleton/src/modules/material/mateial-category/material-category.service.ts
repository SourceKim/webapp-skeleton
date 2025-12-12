import { MaterialCategory } from '@/modules/material/mateial-category/material-category.model';
import { Repository } from 'typeorm';
import { AppDataSource } from '@/configs/database.config';
import { HttpException } from '@/exceptions/http.exception';
import { PaginationQueryDto } from '@/modules/common/common.dto';
import { plainToInstance } from 'class-transformer';
import { MaterialCategoryDTO } from './material-category.dto';
import type { CreateMaterialCategoryDto, UpdateMaterialCategoryDto } from '@skeleton/shared-types';
import { nanoid } from 'nanoid';
import { QueryFilterBuilder } from '@/utils/query-filter.util';

export class MaterialCategoryService {
    private materialCategoryRepository: Repository<MaterialCategory>;
    constructor() {
        this.materialCategoryRepository = AppDataSource.getRepository(MaterialCategory);
    }

    async findAllMaterialCategories(query: PaginationQueryDto): Promise<{ categories: MaterialCategoryDTO[]; total: number }> {
        const queryBuilder = this.materialCategoryRepository.createQueryBuilder('category');

        // 应用筛选条件
        if (query.filters) {
            const filterConditions = QueryFilterBuilder.parseFilters(query.filters, 'category');
            QueryFilterBuilder.applyFilters(queryBuilder, filterConditions);
        }

        // 排序和分页
        queryBuilder
            .orderBy(`category.${query.sort_by}`, query.sort_order)
            .skip((query.page - 1) * query.limit)
            .take(query.limit);

        const [categories, total] = await queryBuilder.getManyAndCount();

        const categoryDTOs = categories.map(category => {
            return plainToInstance(MaterialCategoryDTO, category);
        });

        return {
            categories: categoryDTOs,
            total
        };
    }

    async findMaterialCategoryById(id: string): Promise<MaterialCategoryDTO> {
        const category = await this.materialCategoryRepository.findOne({ where: { id } });
        if (!category) throw new HttpException(404, '分类不存在');

        return plainToInstance(MaterialCategoryDTO, category);
    }

    async createMaterialCategory(createMaterialCategoryDto: CreateMaterialCategoryDto): Promise<MaterialCategoryDTO> {
        const category = this.materialCategoryRepository.create(createMaterialCategoryDto);
        // 检查分类名称是否已存在
        const existingCategory = await this.materialCategoryRepository.findOne({ where: { name: createMaterialCategoryDto.name } });
        if (existingCategory) {
            throw new HttpException(400, '分类名称已存在');
        }
        category.id = nanoid(16);
        await this.materialCategoryRepository.save(category);
        return plainToInstance(MaterialCategoryDTO, category);
    }

    async updateMaterialCategory(id: string, updateMaterialCategoryDto: UpdateMaterialCategoryDto): Promise<MaterialCategoryDTO> {
        const category = await this.materialCategoryRepository.findOne({ where: { id } });
        if (!category) throw new HttpException(404, '分类不存在');

        await this.materialCategoryRepository.update(id, updateMaterialCategoryDto);
        return plainToInstance(MaterialCategoryDTO, category);
    }

    async deleteMaterialCategory(id: string): Promise<void> {
        await this.materialCategoryRepository.delete(id);
    }
}