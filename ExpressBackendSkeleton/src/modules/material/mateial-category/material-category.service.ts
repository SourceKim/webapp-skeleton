import { MaterialCategory } from '@/modules/material/mateial-category/material-category.model';
import { Repository } from 'typeorm';
import { AppDataSource } from '@/configs/database.config';
import { HttpException } from '@/exceptions/http.exception';
import type { PaginationQueryDto } from '@skeleton/shared-types';
import type { CreateMaterialCategoryDto, UpdateMaterialCategoryDto, MaterialCategoryResponseDto } from '@skeleton/shared-types';
import { transformToCamelCase } from '@/utils/dto-transform.util';
import { nanoid } from 'nanoid';
import { QueryFilterBuilder } from '@/utils/query-filter.util';

export class MaterialCategoryService {
    private materialCategoryRepository: Repository<MaterialCategory>;
    constructor() {
        this.materialCategoryRepository = AppDataSource.getRepository(MaterialCategory);
    }

    async findAllMaterialCategories(query: PaginationQueryDto): Promise<{ categories: MaterialCategoryResponseDto[]; total: number }> {
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
            return transformToCamelCase(category) as unknown as MaterialCategoryResponseDto;
        });

        return {
            categories: categoryDTOs,
            total
        };
    }

    async findMaterialCategoryById(id: string): Promise<MaterialCategoryResponseDto> {
        const category = await this.materialCategoryRepository.findOne({ where: { id } });
        if (!category) throw new HttpException(404, '分类不存在');

        return transformToCamelCase(category) as unknown as MaterialCategoryResponseDto;
    }

    async createMaterialCategory(createMaterialCategoryDto: CreateMaterialCategoryDto): Promise<MaterialCategoryResponseDto> {
        const category = this.materialCategoryRepository.create(createMaterialCategoryDto);
        // 检查分类名称是否已存在
        const existingCategory = await this.materialCategoryRepository.findOne({ where: { name: createMaterialCategoryDto.name } });
        if (existingCategory) {
            throw new HttpException(400, '分类名称已存在');
        }
        category.id = nanoid(16);
        await this.materialCategoryRepository.save(category);
        return transformToCamelCase(category) as unknown as MaterialCategoryResponseDto;
    }

    async updateMaterialCategory(id: string, updateMaterialCategoryDto: UpdateMaterialCategoryDto): Promise<MaterialCategoryResponseDto> {
        const category = await this.materialCategoryRepository.findOne({ where: { id } });
        if (!category) throw new HttpException(404, '分类不存在');

        await this.materialCategoryRepository.update(id, updateMaterialCategoryDto);
        return transformToCamelCase(category) as unknown as MaterialCategoryResponseDto;
    }

    async deleteMaterialCategory(id: string): Promise<void> {
        await this.materialCategoryRepository.delete(id);
    }
}