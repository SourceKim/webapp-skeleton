import { Repository } from 'typeorm';
import { User, UserStatus } from '@/modules/user/user.model';
import { Role } from '@/modules/role/role.model';
import { AppDataSource } from '@/configs/database.config';
import { HttpException } from '@/exceptions/http.exception';
import { nanoid } from 'nanoid';
import { PaginationQueryDto } from '@/modules/common/common.dto';
import { CreateUserDto, UpdateUserDto, UserDTO } from '@/modules/user/user.dto';
import { plainToInstance } from 'class-transformer';
import { QueryFilterBuilder } from '@/utils/query-filter.util';

export class UserService {
    private userRepository: Repository<User>;
    private roleRepository: Repository<Role>;
    private dataSource;

    constructor() {
        this.dataSource = process.env.NODE_ENV === 'test' ? AppDataSource : AppDataSource;
        this.userRepository = this.dataSource.getRepository(User);
        this.roleRepository = this.dataSource.getRepository(Role);
    }

    private generateUserId(): string {
        return nanoid(16);
    }

    async createUser(userData: CreateUserDto): Promise<UserDTO> {

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
        return plainToInstance(UserDTO, savedUser);
    }

    async updateUser(userId: string, updateData: UpdateUserDto): Promise<UserDTO> {
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

        // 更新其他用户信息
        Object.assign(user, rest);

        // 保存用户
        const savedUser = await this.userRepository.save(user);

        // 返回用户DTO
        return plainToInstance(UserDTO, savedUser);
    }

    async deleteUser(userId: string): Promise<void> {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new HttpException(404, '用户不存在');
        }

        await this.userRepository.remove(user);
    }

    async getUser(userId: string): Promise<UserDTO> {

        const queryBuilder = this.userRepository.createQueryBuilder('user')
            .andWhere('user.id = :userId', { userId })
            .leftJoinAndSelect('user.roles', 'roles')
            .leftJoinAndSelect('roles.permissions', 'permissions');

        const user = await queryBuilder.getOne();

        if (!user) {
            throw new HttpException(404, '用户不存在');
        }

        return plainToInstance(UserDTO, user);
    }

    async getUsers(query: PaginationQueryDto): Promise<{ users: UserDTO[]; total: number }> {

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
            return plainToInstance(UserDTO, user);
        });

        return { users: userDTOs, total };
    }
} 