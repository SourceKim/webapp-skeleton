import { Repository } from 'typeorm';
import { User } from '@/modules/user/user.model';
import { AppDataSource } from '@/configs/database.config';
import { HttpException } from '@/exceptions/http.exception';
import * as jwt from 'jsonwebtoken';
import type { StringValue } from 'ms';
import type { RegisterDto, LoginDto } from '@skeleton/shared-types';
import { logDebug, logError } from '@/utils/logger';
import { customAlphabet } from 'nanoid';
import { ENV } from '@/configs/env.config';

export class AuthService {
    private userRepository: Repository<User>;
    private dataSource;
    private generateId: () => string;

    constructor() {
        // 根据环境选择数据源
        this.dataSource = ENV.NODE_ENV === 'test' ? AppDataSource : AppDataSource;
        this.userRepository = this.dataSource.getRepository(User);
        // 初始化 nanoid，使用数字和小写字母
        this.generateId = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 16);
        
    }

    private generateUserId(): string {
        return this.generateId();
    }

    async register(userData: {
        username: string;
        password: string;
        phone: string;
        nickname: string;
        gender: User['gender'];
        birthdate?: string;
        email?: string;
        avatar?: string;
        bio?: string;
    }): Promise<{ user: Partial<User>; access_token: string }> {
        const { username, password, email, phone, nickname, gender, birthdate, avatar, bio } = userData;

        // 检查用户名是否已存在
        const existingUser = await this.userRepository.findOne({ where: { username } });
        if (existingUser) {
            throw new HttpException(409, '用户名已存在');
        }

        // 检查手机号唯一
        const existingPhone = await this.userRepository.findOne({ where: { phone } });
        if (existingPhone) {
            throw new HttpException(409, '手机号已被使用');
        }

        // 生成随机 user id
        const userId = this.generateUserId();

        // 创建新用户
        const user = this.userRepository.create({
            id: userId,
            username,
            password,
            phone,
            nickname,
            gender,
            birthdate,
            email: email && email.trim() !== '' ? email : undefined,
            avatar: avatar && avatar.trim() !== '' ? avatar : undefined,
            bio: bio && bio.trim() !== '' ? bio : undefined,
        });

        // 保存用户
        await this.userRepository.save(user);

        // 用户设置模块已移除，不再创建默认设置

        // 生成 token
        const accessToken = this.generateToken(user);

        return {
            user: this.sanitizeUser(user),
            access_token: accessToken
        };
    }

    async login(username: string, password: string): Promise<{ user: Partial<User>; access_token: string }> {
        // 使用 findOne 查找用户，包括密码字段和角色关系
        const user = await this.userRepository.findOne({
            where: { username },
            select: ['id', 'username', 'email', 'phone', 'avatar', 'status', 'bio', 'password'],
            relations: ['roles', 'roles.permissions']
        });
        
        if (!user) {
            logDebug("用户不存在", undefined, { username });
            throw new HttpException(404, '用户不存在');
        }

        logDebug(`尝试登录用户: ${username}`, undefined, { username });
        logDebug(`数据库中的密码哈希: ${user.password.substring(0, 10)}...`, undefined, { userId: user.id });

        // 使用实体的 comparePassword 方法验证密码
        const isValidPassword = await user.comparePassword(password);
        logDebug(`密码验证结果: ${isValidPassword ? '成功' : '失败'}`, undefined, { username, isValidPassword });
        
        if (!isValidPassword) {
            throw new HttpException(400, '密码错误');
        }

        if (user.status == 'inactive') {
            throw new HttpException(403, '账户已被禁用');
        }

        const accessToken = this.generateToken(user);
        
        // 返回用户信息时排除密码
        const userWithoutPassword = this.sanitizeUser(user);

        return { user: userWithoutPassword, access_token: accessToken };
    }

    async getProfile(userId: string): Promise<Partial<User>> {
        const user = await this.userRepository.findOne({
            where: { id: userId }
        });

        if (!user) {
            throw new HttpException(404, '用户不存在');
        }

        return this.sanitizeUser(user);
    }

    private generateToken(user: User): string {
        const secret: jwt.Secret = ENV.JWT_SECRET;
        const expiresIn: StringValue | number = (ENV.JWT_EXPIRES_IN) as StringValue;
        return jwt.sign(
            { id: user.id, username: user.username },
            secret,
            { expiresIn }
        );
    }

    private sanitizeUser(user: User): Partial<User> {
        // 创建一个新对象，只包含我们想要返回的字段
        const sanitizedUser = {
            id: user.id,
            username: user.username,
            email: user.email,
            phone: user.phone,
            avatar: user.avatar,
            status: user.status,
            bio: user.bio,
            roles: user.roles,  // 包含角色信息
            created_at: user.created_at,
            updated_at: user.updated_at
        };
        return sanitizedUser;
    }

    async loginWithToken(token: string): Promise<{ user: Partial<User>; access_token: string }> {
        try {
            // 验证令牌
            const secret: string = ENV.JWT_SECRET;
            const decoded = jwt.verify(token, secret) as { id: string; username: string };
            
            // 查找用户
            const user = await this.userRepository.findOne({
                where: { id: decoded.id },
                select: ['id', 'username', 'email', 'phone', 'avatar', 'status', 'bio', 'password'],
                relations: ['roles', 'roles.permissions']
            });
            
            if (!user) {
                throw new HttpException(401, '用户不存在');
            }

            if (user.status === 'inactive') {
                throw new HttpException(403, '账户已被禁用');
            }

            // 生成新的访问令牌
            const accessToken = this.generateToken(user);
            
            // 返回用户信息和新令牌
            return { 
                user: this.sanitizeUser(user), 
                access_token: accessToken 
            };
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            
            // 处理 JWT 验证错误
            if (error instanceof jwt.JsonWebTokenError) {
                throw new HttpException(401, '无效的认证令牌');
            }
            
            if (error instanceof jwt.TokenExpiredError) {
                throw new HttpException(401, '认证令牌已过期');
            }
            
            throw new HttpException(401, '认证失败');
        }
    }
} 