// @ts-nocheck
/* eslint-disable */
import { Repository } from 'typeorm';
import { AppDataSource } from '@/configs/database.config';
import { __PascalName__ } from '@/modules/__kebabName__/__kebabName__.model';
import { 
    Create__PascalName__Dto, 
    Update__PascalName__Dto,
    __PascalName__DTO,
} from '@/modules/__kebabName__/__kebabName__.dto';
import { HttpException } from '@/exceptions/http.exception';
import { PaginationQueryDto } from '@/modules/common/common.dto';
import { plainToInstance } from 'class-transformer';
import { nanoid } from 'nanoid';
import { QueryFilterBuilder } from '@/utils/query-filter.util';

export class __PascalName__Service {
    private repository: Repository<__PascalName__>;

    constructor() {
        this.repository = AppDataSource.getRepository(__PascalName__);
    }

    async findAll(query: PaginationQueryDto): Promise<{ items: __PascalName__DTO[]; total: number }> {
        const qb = this.repository.createQueryBuilder('entity');

        if (query.filters) {
            const filterConditions = QueryFilterBuilder.parseFilters(query.filters, 'entity');
            QueryFilterBuilder.applyFilters(qb, filterConditions);
        }

        qb.orderBy(`entity.${query.sort_by}`, query.sort_order)
          .skip((query.page - 1) * query.limit)
          .take(query.limit);

        const [rows, total] = await qb.getManyAndCount();
        const items = rows.map(row => plainToInstance(__PascalName__DTO, row));
        return { items, total };
    }

    async findById(id: string): Promise<__PascalName__DTO> {
        const entity = await this.repository.findOne({ where: { id } });
        if (!entity) throw new HttpException(404, '__PascalName__不存在');
        return plainToInstance(__PascalName__DTO, entity);
    }

    async create(payload: Create__PascalName__Dto): Promise<__PascalName__DTO> {
        const exists = await this.repository.findOne({ where: { name: payload.name } });
        if (exists) throw new HttpException(400, '名称已存在');

        const entity = this.repository.create({ id: nanoid(16), ...payload });
        await this.repository.save(entity);
        return plainToInstance(__PascalName__DTO, entity);
    }

    async update(id: string, payload: Update__PascalName__Dto): Promise<__PascalName__DTO> {
        const entity = await this.repository.findOne({ where: { id } });
        if (!entity) throw new HttpException(404, '__PascalName__不存在');

        if (payload.name && payload.name !== entity.name) {
            const exists = await this.repository.findOne({ where: { name: payload.name } });
            if (exists) throw new HttpException(400, '名称已存在');
        }

        if (payload.name) entity.name = payload.name;
        if (payload.description !== undefined) entity.description = payload.description as string;

        await this.repository.save(entity);
        return plainToInstance(__PascalName__DTO, entity);
    }

    async delete(id: string): Promise<void> {
        await this.repository.delete(id);
    }
}


