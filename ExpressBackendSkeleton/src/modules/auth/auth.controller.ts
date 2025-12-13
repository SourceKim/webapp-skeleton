import { Request, Response, NextFunction } from 'express';
import { AuthService } from '@/modules/auth/auth.service';
import { HttpException } from '@/exceptions/http.exception';
import type { ApiResponse } from '@skeleton/shared-types';
import type { 
    RegisterDto, 
    LoginDto, 
    RegisterResponseDto, 
    LoginResponseDto, 
    ProfileResponseDto,
    UserResponseDto
} from '@skeleton/shared-types';
import { transformToCamelCase } from '@/utils/dto-transform.util';
import { 
    loginSchema, 
    registerSchema
} from '@skeleton/shared-types';
import { z } from 'zod';
import { validateData } from '@/utils/zod-validator';
import { logInfo, logError, logDebug } from '@/utils/logger';

/**
 * 认证控制器
 * 处理用户注册、登录和获取个人信息
 */
export class AuthController {
    private authService: AuthService;

    constructor() {
        this.authService = new AuthService();
        logInfo('AuthController 初始化');
    }

    /**
     * 用户注册
     * POST /api/auth/register
     */
    register = async (
        req: Request<{}, ApiResponse<RegisterResponseDto>, RegisterDto>, 
        res: Response<ApiResponse<RegisterResponseDto>>,
        next: NextFunction
    ): Promise<void> => {
        try {
            // 使用 Zod Schema 验证请求体
            const registerData = validateData<z.infer<typeof registerSchema>>(registerSchema, req.body);
            const { username, password, email, phone, nickname, gender, birthdate, avatar, bio } = registerData;
            
            logInfo('用户注册请求', req.requestId, { username, email, phone, nickname });

            // Zod Schema 已经完成所有验证，直接使用验证后的数据
            const result = await this.authService.register({
                username,
                password,
                phone: phone!,
                nickname: nickname!,
                gender: gender!,
                birthdate,
                email,
                avatar,
                bio
            });
            
            logInfo('用户注册成功', req.requestId, { userId: result.user.id, username });
            
            res.status(200).json({
                code: 0,
                message: '注册成功',
                data: transformToCamelCase(result.user) as RegisterResponseDto
            });
        } catch (error) {
            logError('用户注册失败', req.requestId, { error, body: req.body });
            next(error);
        }
    };

    /**
     * 用户登录
     * POST /api/auth/login
     */
    login = async (
        req: Request<{}, ApiResponse<LoginResponseDto>, LoginDto>,
        res: Response<ApiResponse<LoginResponseDto>>,
        next: NextFunction
    ): Promise<void> => {
        try {
            // 使用 Zod Schema 验证请求体
            const loginData = validateData<z.infer<typeof loginSchema>>(loginSchema, req.body);
            const { username, password } = loginData;
            
            logInfo('用户登录请求', req.requestId, { username });

            const result = await this.authService.login(username, password);
            
            logInfo('用户登录成功', req.requestId, { userId: result.user.id, username });
            
            res.json({
                code: 0,
                message: '登录成功',
                data: {
                    access_token: result.access_token,
                    user: transformToCamelCase(result.user) as UserResponseDto
                }
            });
        } catch (error) {
            logError('用户登录失败', req.requestId, { error, username: req.body.username });
            next(error);
        }
    };

    /**
     * 获取用户个人信息
     * GET /api/auth/profile
     */
    getProfile = async (
        req: Request<{}, ApiResponse<ProfileResponseDto>, {}>,
        res: Response<ApiResponse<ProfileResponseDto>>,
        next: NextFunction
    ): Promise<void> => {
        try {
            // 使用已定义的 Request 类型扩展访问 user
            if (!req.user) {
                throw new HttpException(401, '用户未认证');
            }
            
            const user = await this.authService.getProfile(req.user.id);
            
            res.json({
                code: 0,
                message: 'success',
                data: transformToCamelCase(user) as ProfileResponseDto
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * 通过令牌登录
     * POST /api/auth/token-login
     */
    tokenLogin = async (
        req: Request<{}, ApiResponse<LoginResponseDto>, {}>,
        res: Response<ApiResponse<LoginResponseDto>>,
        next: NextFunction
    ): Promise<void> => {
        try {
            const authHeader = req.headers.authorization;
            logInfo('用户令牌登录请求', req.requestId);

            if (!authHeader) {
                logError('令牌登录失败 - 未提供认证令牌', req.requestId);
                throw new HttpException(401, '未提供认证令牌');
            }

            const token = authHeader.split(' ')[1];
            const result = await this.authService.loginWithToken(token);
            
            logInfo('用户令牌登录成功', req.requestId, { userId: result.user.id, username: result.user.username });
            
            res.json({
                code: 0,
                message: '登录成功',
                data: {
                    access_token: result.access_token,
                    user: transformToCamelCase(result.user) as UserResponseDto
                }
            });
        } catch (error) {
            logError('用户令牌登录失败', req.requestId, { error });
            next(error);
        }
    };
} 