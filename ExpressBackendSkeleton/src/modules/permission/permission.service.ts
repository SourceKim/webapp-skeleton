import { Repository } from 'typeorm';
import { AppDataSource } from '@/configs/database.config';
import { Permission } from '@/modules/permission/permission.model';
import type {
    CreatePermissionDto,
    UpdatePermissionDto,
} from '@skeleton/shared-types';
import { HttpException } from '@/exceptions/http.exception';
import { PaginationQueryDto } from '@/modules/common/common.dto';
import { PermissionDTO } from '@/modules/permission/permission.dto';
import { plainToInstance } from 'class-transformer';
import { nanoid } from 'nanoid';
import { QueryFilterBuilder } from '@/utils/query-filter.util';

export class PermissionService {
    private permissionRepository: Repository<Permission>;

    constructor() {
        this.permissionRepository = AppDataSource.getRepository(Permission);
    }

    async findAllPermissions(query: PaginationQueryDto): Promise<{ permissions: PermissionDTO[]; total: number }> {
        const queryBuilder = this.permissionRepository.createQueryBuilder('permission');

        // 应用筛选条件
        if (query.filters) {
            const filterConditions = QueryFilterBuilder.parseFilters(query.filters, 'permission');
            QueryFilterBuilder.applyFilters(queryBuilder, filterConditions);
        }

        // 排序和分页
        queryBuilder
            .orderBy(`permission.${query.sort_by}`, query.sort_order)
            .skip((query.page - 1) * query.limit)
            .take(query.limit);

        const [permissions, total] = await queryBuilder.getManyAndCount();

        const permissionDTOs = permissions.map(permission => {
            return plainToInstance(PermissionDTO, permission);
        });

        return {
            permissions: permissionDTOs,
            total,
        }
    }

    async findPermissionById(id: string): Promise<PermissionDTO> {
        const permission = await this.permissionRepository.findOne({ where: { id } });
        if (!permission) throw new HttpException(404, '权限不存在');

        return plainToInstance(PermissionDTO, permission);
    }

    async createPermission(createPermissionDto: CreatePermissionDto): Promise<PermissionDTO> {
        // 检查权限名称是否已存在
        const existingPermission = await this.permissionRepository.findOne({
            where: { name: createPermissionDto.name }
        });

        if (existingPermission) {
            throw new HttpException(400, '权限名称已存在');
        }

        const permission = this.permissionRepository.create({
            id: nanoid(16),
            ...createPermissionDto
        });
        await this.permissionRepository.save(permission);

        return plainToInstance(PermissionDTO, permission);
    }

    async updatePermission(id: string, updatePermissionDto: UpdatePermissionDto): Promise<PermissionDTO> {
        const permission = await this.permissionRepository.findOne({ where: { id } });
        if (!permission) throw new HttpException(404, '权限不存在');

        // 如果要更新名称，检查新名称是否已存在
        if (updatePermissionDto.name && updatePermissionDto.name !== permission.name) {
            const existingPermission = await this.permissionRepository.findOne({
                where: { name: updatePermissionDto.name }
            });

            if (existingPermission) {
                throw new HttpException(400, '权限名称已存在');
            }
        }

        // 更新权限属性
        if (updatePermissionDto.name) permission.name = updatePermissionDto.name;
        if (updatePermissionDto.resource) permission.resource = updatePermissionDto.resource;
        if (updatePermissionDto.action) permission.action = updatePermissionDto.action;
        if (updatePermissionDto.description !== undefined) permission.description = updatePermissionDto.description;

        await this.permissionRepository.save(permission);

        return plainToInstance(PermissionDTO, permission);
    }

    async deletePermission(id: string): Promise<void> {
        await this.permissionRepository.delete(id);
    }
} 