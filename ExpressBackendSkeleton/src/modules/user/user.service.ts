import { Repository } from 'typeorm';
import { User, UserStatus } from '@/modules/user/user.model';
import { Role } from '@/modules/role/role.model';
import { AppDataSource } from '@/configs/database.config';
import { HttpException } from '@/exceptions/http.exception';
import { nanoid } from 'nanoid';
import type { PaginationQueryDto } from '@skeleton/shared-types';
import type { CreateUserDto, UpdateUserDto, ChangePasswordDto, ChangePhoneDto, UserResponseDto } from '@skeleton/shared-types';
import { transformToCamelCase } from '@/utils/dto-transform.util';
import { QueryFilterBuilder } from '@/utils/query-filter.util';
import { MallOrder, OrderStatus } from '@/modules/mall/order/order.model';
import { ENV } from '@/configs/env.config';

export class UserService {
    private userRepository: Repository<User>;
    private roleRepository: Repository<Role>;
    private orderRepository: Repository<MallOrder>;
    private dataSource;

    constructor() {
        this.dataSource = ENV.NODE_ENV === 'test' ? AppDataSource : AppDataSource;
        this.userRepository = this.dataSource.getRepository(User);
        this.roleRepository = this.dataSource.getRepository(Role);
        this.orderRepository = this.dataSource.getRepository(MallOrder);
    }

    private generateUserId(): string {
        return nanoid(16);
    }

    async createUser(userData: CreateUserDto): Promise<UserResponseDto> {

        // 检查用户名是否已存在
        const existingUser = await this.userRepository.findOne({ where: { username: userData.username } });
        if (existingUser) {
            throw new HttpException(409, '用户名已存在');
        }

        // 创建新用户
        const user = new User();
        Object.assign(user, {
            id: this.generateUserId(),
            username: userData.username,
            password: userData.password,
            email: userData.email && userData.email.trim() !== '' ? userData.email : undefined,
            phone: userData.phone && userData.phone.trim() !== '' ? userData.phone : undefined,
            status: UserStatus.ACTIVE,
        });

        // 保存用户
        const savedUser = await this.userRepository.save(user);

        // 返回用户DTO
        return transformToCamelCase(savedUser) as unknown as UserResponseDto;
    }

    async updateUser(userId: string, updateData: UpdateUserDto): Promise<UserResponseDto> {
        // 仅允许白名单字段被更新，根除 id 被覆盖的风险
        const { roles: roleIds, ...rest } = updateData;

        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ['roles']
        });
        
        if (!user) {
            throw new HttpException(404, '用户不存在');
        }

        // 如果需要更新角色
        if (roleIds) {
            const roles = await this.roleRepository.findByIds(roleIds);
            if (roles.length !== roleIds.length) {
                throw new HttpException(400, '部分角色ID不存在');
            }
            user.roles = roles;
        }

        // 显式字段映射更新，避免 undefined 覆盖
        if (rest.username !== undefined) user.username = rest.username;
        // 注意：普通 updateUser 不应允许直接修改密码，应该走 changePassword 接口
        // 但为了兼容性或管理员修改，这里暂时保留，但前端应避免使用
        if (rest.password !== undefined) user.password = rest.password;
        if (rest.email !== undefined) user.email = rest.email;
        if (rest.nickname !== undefined) user.nickname = rest.nickname;
        if (rest.phone !== undefined) user.phone = rest.phone;
        if (rest.avatar !== undefined) user.avatar = rest.avatar;
        if (rest.bio !== undefined) user.bio = rest.bio;
        if (rest.gender !== undefined) user.gender = rest.gender;
        if (rest.birthdate !== undefined) user.birthdate = rest.birthdate;

        // 保存用户
        const savedUser = await this.userRepository.save(user);

        // 返回用户DTO
        return transformToCamelCase(savedUser) as unknown as UserResponseDto;
    }

    async changePassword(userId: string, dto: ChangePasswordDto): Promise<void> {
        const user = await this.userRepository.findOne({ 
            where: { id: userId },
            select: ['id', 'password'] // 显式查出密码
        });

        if (!user) {
            throw new HttpException(404, '用户不存在');
        }

        // 验证旧密码
        const isMatch = await user.comparePassword(dto.oldPassword);
        if (!isMatch) {
            throw new HttpException(400, '旧密码错误');
        }

        // 设置新密码
        user.password = dto.newPassword;
        await this.userRepository.save(user);
    }

    async changePhone(userId: string, dto: ChangePhoneDto): Promise<void> {
        const user = await this.userRepository.findOne({ 
            where: { id: userId },
            select: ['id', 'password', 'phone']
        });

        if (!user) {
            throw new HttpException(404, '用户不存在');
        }

        // 验证密码
        const isMatch = await user.comparePassword(dto.password);
        if (!isMatch) {
            throw new HttpException(400, '密码验证失败');
        }

        // 检查新手机号是否被占用
        if (dto.phone !== user.phone) {
            const existing = await this.userRepository.findOne({ where: { phone: dto.phone } });
            if (existing) {
                throw new HttpException(409, '该手机号已被绑定');
            }
        }

        // 更新手机号
        user.phone = dto.phone;
        await this.userRepository.save(user);
    }

    async deleteUser(userId: string): Promise<void> {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new HttpException(404, '用户不存在');
        }

        await this.userRepository.remove(user);
    }

    async getUser(userId: string): Promise<UserResponseDto> {

        const queryBuilder = this.userRepository.createQueryBuilder('user')
            .andWhere('user.id = :userId', { userId })
            .leftJoinAndSelect('user.roles', 'roles')
            .leftJoinAndSelect('roles.permissions', 'permissions');

        const user = await queryBuilder.getOne();

        if (!user) {
            throw new HttpException(404, '用户不存在');
        }

        return transformToCamelCase(user) as unknown as UserResponseDto;
    }

    async getUserStats(userId: string): Promise<{ couponCount: number; pointCount: number; totalConsumption: string }> {
        const result = await this.orderRepository.createQueryBuilder('order')
            .select('SUM(order.payable_amount)', 'total_amount')
            .where('order.user_id = :userId', { userId })
            .andWhere('order.order_status = :status', { status: OrderStatus.COMPLETED })
            .getRawOne();

        return {
            couponCount: 0,
            pointCount: 0,
            totalConsumption: Number(result?.total_amount || 0).toFixed(2)
        };
    }

    async getUsers(query: PaginationQueryDto): Promise<{ users: UserResponseDto[]; total: number }> {

        const queryBuilder = this.userRepository.createQueryBuilder('user')
            .leftJoinAndSelect('user.roles', 'roles')
            .leftJoinAndSelect('roles.permissions', 'permissions');

        // 应用筛选条件
        if (query.filters) {
            const filterConditions = QueryFilterBuilder.parseFilters(query.filters, 'user');
            QueryFilterBuilder.applyFilters(queryBuilder, filterConditions);
        }

        // 排序
        queryBuilder.orderBy(`user.${query.sort_by}`, query.sort_order);

        // 分页
        const skip = (query.page - 1) * query.limit;
        queryBuilder.skip(skip).take(query.limit);

        const [users, total] = await queryBuilder.getManyAndCount();

        const userDTOs = users.map(user => {
            return transformToCamelCase(user) as unknown as UserResponseDto;
        });

        return { users: userDTOs, total };
    }
}
