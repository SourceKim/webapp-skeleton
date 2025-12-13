import { In, Repository } from 'typeorm';
import { AppDataSource } from '@/configs/database.config';
import { Permission } from '@/modules/permission/permission.model';
import { Role } from '@/modules/role/role.model';
import { User } from '@/modules/user/user.model';
import type {
    CreateRoleDto,
    UpdateRoleDto,
    AssignPermissionsDto,
    AssignRolesDto,
} from '@skeleton/shared-types';
import { HttpException } from '@/exceptions/http.exception';
import type { PaginationQueryDto } from '@skeleton/shared-types';
import type { RoleResponseDto, UserResponseDto } from '@skeleton/shared-types';
import { transformToCamelCase } from '@/utils/dto-transform.util';
import { nanoid } from 'nanoid';
import { QueryFilterBuilder } from '@/utils/query-filter.util';

export class RoleService {
    private permissionRepository: Repository<Permission>;
    private roleRepository: Repository<Role>;
    private userRepository: Repository<User>;

    constructor() {
        this.permissionRepository = AppDataSource.getRepository(Permission);
        this.roleRepository = AppDataSource.getRepository(Role);
        this.userRepository = AppDataSource.getRepository(User);
    }

    async findAllRoles(query: PaginationQueryDto): Promise<{ roles: RoleResponseDto[]; total: number }> {
        const queryBuilder = this.roleRepository.createQueryBuilder('role')
            .leftJoinAndSelect('role.permissions', 'permission');
        
        // 应用筛选条件
        if (query.filters) {
            const filterConditions = QueryFilterBuilder.parseFilters(query.filters, 'role');
            QueryFilterBuilder.applyFilters(queryBuilder, filterConditions);
        }

        // 排序和分页
        queryBuilder
            .orderBy(`role.${query.sort_by}`, query.sort_order)
            .skip((query.page - 1) * query.limit)
            .take(query.limit);
        
        const [roles, total] = await queryBuilder.getManyAndCount();

        const roleDTOs = roles.map(role => {
            return transformToCamelCase(role) as RoleResponseDto;
        });
        return {
            roles: roleDTOs,
            total
        };
    }

    async findRoleById(id: string): Promise<RoleResponseDto> {
        const role = await this.roleRepository.findOne({
            where: { id },
            relations: ['permissions']
        });

        if (!role) throw new HttpException(404, '角色不存在');

        return transformToCamelCase(role) as RoleResponseDto;
    }

    async createRole(createRoleDto: CreateRoleDto): Promise<RoleResponseDto> {

        // 检查角色名是否已存在
        const existingRole = await this.roleRepository.findOne({ where: { name: createRoleDto.name } });
        if (existingRole) {
            throw new HttpException(409, '角色名已存在');
        }

        const role = this.roleRepository.create({
            id: nanoid(16),
            ...createRoleDto,
            permissions: []
        });

        await this.roleRepository.save(role);

        return transformToCamelCase(role) as RoleResponseDto;
    }

    async updateRole(id: string, updateRoleDto: UpdateRoleDto): Promise<RoleResponseDto> {
        const role = await this.roleRepository.findOne({
            where: { id },
            relations: ['permissions']
        });

        if (!role) throw new HttpException(404, '角色不存在');

        // 更新角色属性
        if (updateRoleDto.name) role.name = updateRoleDto.name;
        if (updateRoleDto.description !== undefined) role.description = updateRoleDto.description;

        await this.roleRepository.save(role);

        return transformToCamelCase(role) as RoleResponseDto;
    }

    async deleteRole(id: string): Promise<void> {
        await this.roleRepository.delete(id);
    }

    async assignPermissionsToRole(roleId: string, data: AssignPermissionsDto): Promise<RoleResponseDto> {
        const role = await this.roleRepository.findOne({
            where: { id: roleId }
        });

        if (!role) throw new HttpException(404, '角色不存在');

        // 获取权限
        const permissions = await this.permissionRepository.find({
            where: { id: In(data.permissionIds) }
        });

        if (permissions.length !== data.permissionIds.length) {
            throw new HttpException(400, '部分权限ID不存在');
        }

        // 更新角色权限
        role.permissions = permissions;
        await this.roleRepository.save(role);

        return transformToCamelCase(role) as RoleResponseDto;
    }

    async assignRolesToUser(userId: string, data: AssignRolesDto): Promise<UserResponseDto> {
        // 获取用户
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ['roles', 'roles.permissions']
        });

        if (!user) {
            throw new HttpException(404, '用户不存在');
        }

        // 获取角色
        const roles = await this.roleRepository.find({
            where: { id: In(data.roles) },
            relations: ['permissions']
        });

        if (roles.length !== data.roles.length) {
            throw new HttpException(400, '部分角色ID不存在');
        }

        // 更新用户角色
        user.roles = roles;
        await this.userRepository.save(user);

        return transformToCamelCase(user) as UserResponseDto;
    }
} 