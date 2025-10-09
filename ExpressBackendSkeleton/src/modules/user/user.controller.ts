import { Request, Response, NextFunction } from 'express';
import { UserService } from '@/modules/user/user.service';
import { ApiResponse, FindByIdDto, PaginatedResponse } from '@/modules/common/common.dto';
import { CreateUserDto, UpdateUserDto, UserDTO } from '@/modules/user/user.dto';

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
            const userData = await req.validate(CreateUserDto, 'body');
            const user = await this.userService.createUser(userData);
            res.status(201).json({
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
            const { id } = await req.validate(FindByIdDto, 'params');
            const userData = await req.validate(UpdateUserDto, 'body');
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
     * 删除用户
     * DELETE /api/v1/users/admin/:id
     */
    deleteUser = async (
        req: Request,
        res: Response<ApiResponse<null>>,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { id } = await req.validate(FindByIdDto, 'params');
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
            const { id } = await req.validate(FindByIdDto, 'params');
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