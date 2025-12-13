import { Request, Response } from 'express';
import { UserService } from '@/modules/user/user.service';
import type { ApiResponse, PaginatedResponse } from '@skeleton/shared-types';
import type { UserResponseDto } from '@skeleton/shared-types';
import { HttpException } from '@/exceptions/http.exception';
import type { UserStats } from '@/types/common';
import {
    createUserSchema,
    updateUserSchema,
    changePasswordSchema,
    changePhoneSchema,
    updateProfileSchema
} from '@skeleton/shared-types';
import { idParamSchema } from '@skeleton/shared-types';
import { validateData } from '@/utils/zod-validator';
import { asyncHandler } from '@/utils/async-handler';

/**
 * 用户控制器
 * 处理用户相关的请求
 */
export class UserController {
    private userService: UserService;

    constructor() {
        this.userService = new UserService();
    }

    /**
     * 创建用户
     * POST /api/v1/users/admin
     */
    createUser = asyncHandler(async (
        req: Request,
        res: Response<ApiResponse<UserResponseDto>>
    ): Promise<void> => {
        const userData = validateData(createUserSchema, req.body);
        const user = await this.userService.createUser(userData);
        res.status(200).json({
            code: 0,
            message: '创建用户成功',
            data: user
        });
    });

    /**
     * 更新用户
     * PUT /api/v1/users/admin/:id 或 PUT /api/v1/users/profile
     */
    updateUser = asyncHandler(async (
        req: Request,
        res: Response<ApiResponse<UserResponseDto>>
    ): Promise<void> => {
        const { id } = validateData(idParamSchema, req.params);
        // Zod 会自动过滤未定义的字段，所以不需要手动过滤
        const userData = validateData(updateUserSchema, req.body);
        const user = await this.userService.updateUser(id, userData);
        res.json({
            code: 0,
            message: '更新用户成功',
            data: user
        });
    });

    /**
     * 获取当前登录用户信息
     * GET /api/v1/users/profile
     */
    getProfile = asyncHandler(async (
        req: Request,
        res: Response<ApiResponse<UserResponseDto>>
    ): Promise<void> => {
        const userId = req.user?.id as string | undefined;
        if (!userId) {
            throw new HttpException(401, '未认证');
        }
        const user = await this.userService.getUser(userId);
        res.json({
            code: 0,
            message: 'success',
            data: user
        });
    });

    /**
     * 获取用户统计信息
     * GET /api/v1/users/stats
     */
    getStats = asyncHandler(async (
        req: Request,
        res: Response<ApiResponse<UserStats>>
    ): Promise<void> => {
        const userId = req.user?.id;
        if (!userId) throw new HttpException(401, '未认证');
        
        const stats = await this.userService.getUserStats(userId);
        res.json({ code: 0, message: 'success', data: stats });
    });

    /**
     * 更新当前登录用户信息
     * PUT /api/v1/users/profile
     */
    updateProfile = asyncHandler(async (
        req: Request,
        res: Response<ApiResponse<UserResponseDto>>
    ): Promise<void> => {
        const userId = req.user?.id as string | undefined;
        if (!userId) {
            throw new HttpException(401, '未认证');
        }
        const userData = validateData(updateProfileSchema, req.body);
        const user = await this.userService.updateUser(userId, userData);
        res.json({
            code: 0,
            message: '更新用户成功',
            data: user
        });
    });

    /**
     * 修改密码
     * POST /api/v1/users/change-password
     */
    changePassword = asyncHandler(async (
        req: Request,
        res: Response<ApiResponse<null>>
    ): Promise<void> => {
        const userId = req.user?.id;
        if (!userId) throw new HttpException(401, '未认证');

        const dto = validateData(changePasswordSchema, req.body);
        await this.userService.changePassword(userId, dto);
        res.json({
            code: 0,
            message: '密码修改成功',
            data: null
        });
    });

    /**
     * 修改手机号
     * POST /api/v1/users/change-phone
     */
    changePhone = asyncHandler(async (
        req: Request,
        res: Response<ApiResponse<null>>
    ): Promise<void> => {
        const userId = req.user?.id;
        if (!userId) throw new HttpException(401, '未认证');

        const dto = validateData(changePhoneSchema, req.body);
        await this.userService.changePhone(userId, dto);
        res.json({
            code: 0,
            message: '手机号修改成功',
            data: null
        });
    });

    /**
     * 删除用户
     * DELETE /api/v1/users/admin/:id
     */
    deleteUser = asyncHandler(async (
        req: Request,
        res: Response<ApiResponse<null>>
    ): Promise<void> => {
        const { id } = validateData(idParamSchema, req.params);
        await this.userService.deleteUser(id);
        res.json({
            code: 0,
            message: '删除用户成功',
            data: null
        });
    });

    /**
     * 获取用户信息
     * GET /api/v1/users/admin/:id 或 GET /api/v1/users/profile
     */
    getUser = asyncHandler(async (
        req: Request,
        res: Response<ApiResponse<UserResponseDto>>
    ): Promise<void> => {
        const { id } = validateData(idParamSchema, req.params);
        const user = await this.userService.getUser(id);
        res.json({
            code: 0,
            message: 'success',
            data: user
        });
    });

    /**
     * 获取用户列表
     * GET /api/v1/users/admin
     */
    getUsers = asyncHandler(async (
        req: Request,
        res: Response<ApiResponse<PaginatedResponse<UserResponseDto>>>
    ): Promise<void> => {
        const { users, total } = await this.userService.getUsers(req.pagination);
        res.pagination(users, total);
    });
}
