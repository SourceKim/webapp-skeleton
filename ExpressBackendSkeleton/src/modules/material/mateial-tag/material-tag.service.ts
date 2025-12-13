import { nanoid } from 'nanoid';
import { MaterialTag } from './material-tag.model';
import { Repository } from 'typeorm';
import { AppDataSource } from '@/configs/database.config';
import { HttpException } from '@/exceptions/http.exception';
import type { PaginationQueryDto } from '@skeleton/shared-types';
import type { CreateMaterialTagDto, UpdateMaterialTagDto, MaterialTagResponseDto } from '@skeleton/shared-types';
import { transformToCamelCase } from '@/utils/dto-transform.util';
import { QueryFilterBuilder } from '@/utils/query-filter.util';

export class MaterialTagService {
    private materialTagRepository: Repository<MaterialTag>;
    constructor() {
        this.materialTagRepository = AppDataSource.getRepository(MaterialTag);
    }

    async findAllMaterialTags(query: PaginationQueryDto): Promise<{ tags: MaterialTagResponseDto[]; total: number }> {
        const queryBuilder = this.materialTagRepository.createQueryBuilder('tag');

        // 应用筛选条件
        if (query.filters) {
            const filterConditions = QueryFilterBuilder.parseFilters(query.filters, 'tag');
            QueryFilterBuilder.applyFilters(queryBuilder, filterConditions);
        }

        // 排序和分页
        queryBuilder
            .orderBy(`tag.${query.sort_by}`, query.sort_order)
            .skip((query.page - 1) * query.limit)
            .take(query.limit);

        const [tags, total] = await queryBuilder.getManyAndCount();

        const tagDTOs = tags.map(tag => {
            return transformToCamelCase(tag) as unknown as MaterialTagResponseDto;
        });

        return {
            tags: tagDTOs,
            total
        };
    }

    async findMaterialTagById(id: string): Promise<MaterialTagResponseDto> {
        const tag = await this.materialTagRepository.findOne({ where: { id } });
        if (!tag) throw new HttpException(404, '标签不存在');

        return transformToCamelCase(tag) as unknown as MaterialTagResponseDto;
    }

    async createMaterialTag(createMaterialTagDto: CreateMaterialTagDto): Promise<MaterialTagResponseDto> {
        const tag = this.materialTagRepository.create(createMaterialTagDto);
        // 检查标签名称是否已存在
        const existingTag = await this.materialTagRepository.findOne({ where: { name: createMaterialTagDto.name } });
        if (existingTag) {
            throw new HttpException(400, '分类名称已存在');
        }
        tag.id = nanoid(16);
        await this.materialTagRepository.save(tag);
        return transformToCamelCase(tag) as unknown as MaterialTagResponseDto;
    }

    async updateMaterialTag(id: string, updateMaterialTagDto: UpdateMaterialTagDto): Promise<MaterialTagResponseDto> {
        const tag = await this.materialTagRepository.findOne({ where: { id } });
        if (!tag) throw new HttpException(404, '标签不存在');

        await this.materialTagRepository.update(id, updateMaterialTagDto);
        return transformToCamelCase(tag) as unknown as MaterialTagResponseDto;
    }

    async deleteMaterialTag(id: string): Promise<void> {
        await this.materialTagRepository.delete(id);
    }
}