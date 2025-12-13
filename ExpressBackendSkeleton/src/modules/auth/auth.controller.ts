import { Request, Response } from 'express';
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
import { asyncHandler } from '@/utils/async-handler';

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
    register = asyncHandler(async (
        req: Request<{}, ApiResponse<RegisterResponseDto>, RegisterDto>, 
        res: Response<ApiResponse<RegisterResponseDto>>
    ): Promise<void> => {
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
            data: transformToCamelCase(result.user) as unknown as RegisterResponseDto
        });
    });

    /**
     * 用户登录
     * POST /api/auth/login
     */
    login = asyncHandler(async (
        req: Request<{}, ApiResponse<LoginResponseDto>, LoginDto>,
        res: Response<ApiResponse<LoginResponseDto>>
    ): Promise<void> => {
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
                user: transformToCamelCase(result.user) as unknown as UserResponseDto
            }
        });
    });

    /**
     * 获取用户个人信息
     * GET /api/auth/profile
     */
    getProfile = asyncHandler(async (
        req: Request<{}, ApiResponse<ProfileResponseDto>, {}>,
        res: Response<ApiResponse<ProfileResponseDto>>
    ): Promise<void> => {
        // 使用已定义的 Request 类型扩展访问 user
        if (!req.user) {
            throw new HttpException(401, '用户未认证');
        }
        
        const user = await this.authService.getProfile(req.user.id);
        
        res.json({
            code: 0,
            message: 'success',
            data: transformToCamelCase(user) as unknown as ProfileResponseDto
        });
    });

    /**
     * 通过令牌登录
     * POST /api/auth/token-login
     */
    tokenLogin = asyncHandler(async (
        req: Request<{}, ApiResponse<LoginResponseDto>, {}>,
        res: Response<ApiResponse<LoginResponseDto>>
    ): Promise<void> => {
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
                user: transformToCamelCase(result.user) as unknown as UserResponseDto
            }
        });
    });
} 