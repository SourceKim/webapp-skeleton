import { Request, Response, NextFunction } from 'express';
import { UserService } from '@/modules/user/user.service';
import { ApiResponse, PaginatedResponse } from '@/modules/common/common.dto';
import { UserDTO } from '@/modules/user/user.dto';
import { HttpException } from '@/exceptions/http.exception';
import {
    createUserSchema,
    updateUserSchema,
    changePasswordSchema,
    changePhoneSchema,
    updateProfileSchema
} from '@skeleton/shared-types';
import { idParamSchema } from '@skeleton/shared-types';
import { validateData } from '@/utils/zod-validator';

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
    createUser = async (
        req: Request,
        res: Response<ApiResponse<UserDTO>>,
        next: NextFunction
    ): Promise<void> => {
        try {
            const userData = validateData(createUserSchema, req.body);
            const user = await this.userService.createUser(userData);
            res.status(200).json({
                code: 0,
                message: '创建用户成功',
                data: user
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * 更新用户
     * PUT /api/v1/users/admin/:id 或 PUT /api/v1/users/profile
     */
    updateUser = async (
        req: Request,
        res: Response<ApiResponse<UserDTO>>,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { id } = validateData(idParamSchema, req.params);
            // Zod 会自动过滤未定义的字段，所以不需要手动过滤
            const userData = validateData(updateUserSchema, req.body);
            const user = await this.userService.updateUser(id, userData);
            res.json({
                code: 0,
                message: '更新用户成功',
                data: user
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * 获取当前登录用户信息
     * GET /api/v1/users/profile
     */
    getProfile = async (
        req: Request,
        res: Response<ApiResponse<UserDTO>>,
        next: NextFunction
    ): Promise<void> => {
        try {
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
        } catch (error) {
            next(error);
        }
    };

    /**
     * 获取用户统计信息
     * GET /api/v1/users/stats
     */
    getStats = async (
        req: Request,
        res: Response<ApiResponse<any>>,
        next: NextFunction
    ): Promise<void> => {
        try {
            const userId = req.user?.id;
            if (!userId) throw new HttpException(401, '未认证');
            
            const stats = await this.userService.getUserStats(userId);
            res.json({ code: 0, message: 'success', data: stats });
        } catch (error) {
            next(error);
        }
    };

    /**
     * 更新当前登录用户信息
     * PUT /api/v1/users/profile
     */
    updateProfile = async (
        req: Request,
        res: Response<ApiResponse<UserDTO>>,
        next: NextFunction
    ): Promise<void> => {
        try {
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
        } catch (error) {
            next(error);
        }
    };

    /**
     * 修改密码
     * POST /api/v1/users/change-password
     */
    changePassword = async (
        req: Request,
        res: Response<ApiResponse<null>>,
        next: NextFunction
    ): Promise<void> => {
        try {
            const userId = req.user?.id;
            if (!userId) throw new HttpException(401, '未认证');

            const dto = validateData(changePasswordSchema, req.body);
            await this.userService.changePassword(userId, dto);
            res.json({
                code: 0,
                message: '密码修改成功',
                data: null
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * 修改手机号
     * POST /api/v1/users/change-phone
     */
    changePhone = async (
        req: Request,
        res: Response<ApiResponse<null>>,
        next: NextFunction
    ): Promise<void> => {
        try {
            const userId = req.user?.id;
            if (!userId) throw new HttpException(401, '未认证');

            const dto = validateData(changePhoneSchema, req.body);
            await this.userService.changePhone(userId, dto);
            res.json({
                code: 0,
                message: '手机号修改成功',
                data: null
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * 删除用户
     * DELETE /api/v1/users/admin/:id
     */
    deleteUser = async (
        req: Request,
        res: Response<ApiResponse<null>>,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { id } = validateData(idParamSchema, req.params);
            await this.userService.deleteUser(id);
            res.json({
                code: 0,
                message: '删除用户成功',
                data: null
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * 获取用户信息
     * GET /api/v1/users/admin/:id 或 GET /api/v1/users/profile
     */
    getUser = async (
        req: Request,
        res: Response<ApiResponse<UserDTO>>,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { id } = validateData(idParamSchema, req.params);
            const user = await this.userService.getUser(id);
            res.json({
                code: 0,
                message: 'success',
                data: user
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * 获取用户列表
     * GET /api/v1/users/admin
     */
    getUsers = async (
        req: Request,
        res: Response<ApiResponse<PaginatedResponse<UserDTO>>>,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { users, total } = await this.userService.getUsers(req.pagination);
            res.pagination(users, total);
        } catch (error) {
            next(error);
        }
    };
}
