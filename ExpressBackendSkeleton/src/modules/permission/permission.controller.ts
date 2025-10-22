import { Request, Response, NextFunction } from 'express';
import { PermissionService } from '@/modules/permission/permission.service';
import { ApiResponse, FindByIdDto, PaginatedResponse } from '@/modules/common/common.dto';
import { 
    CreatePermissionDto,
    UpdatePermissionDto,
} from '@/modules/permission/permission.dto';
import { HttpException } from '@/exceptions/http.exception';
import { PermissionDTO } from '@/modules/permission/permission.dto';

/**
 * 权限控制器
 * 处理权限相关的请求
 */
export class PermissionController {
    private permissionService: PermissionService;

    constructor() {
        this.permissionService = new PermissionService();
    }

    /**
     * 获取所有权限
     * GET /api/permissions
     */
    public findAllPermissions = async (
        req: Request, 
        res: Response<ApiResponse<PaginatedResponse<PermissionDTO>>>,
        next: NextFunction
    ): Promise<void> => {
        try {
            // 调用服务获取分页数据
            const { permissions, total } = await this.permissionService.findAllPermissions(req.pagination);
            // 返回分页数据
            return res.pagination(permissions, total);
        } catch (error) {
            next(error);
        }
    }

    /**
     * 根据ID获取权限
     * GET /api/permissions/:id
     */
    public findPermissionById = async (
        req: Request, 
        res: Response<ApiResponse<PermissionDTO>>,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { id } = await req.validate(FindByIdDto, 'params');
            const permission = await this.permissionService.findPermissionById(id);
            
            if (!permission) {
                throw new HttpException(404, '权限不存在');
            }
            
            res.json({
                code: 0,
                message: 'success',
                data: permission
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * 创建权限
     * POST /api/permissions
     */
    public createPermission = async (
        req: Request, 
        res: Response<ApiResponse<PermissionDTO>>,
        next: NextFunction
    ): Promise<void> => {
        try {
            const permissionData = await req.validate(CreatePermissionDto, 'body');
            const permission = await this.permissionService.createPermission(permissionData);
            res.status(200).json({
                code: 0,
                message: '权限创建成功',
                data: permission
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * 更新权限
     * PUT /api/permissions/:id
     */
    public updatePermission = async (
        req: Request, 
        res: Response<ApiResponse<PermissionDTO>>,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { id } = await req.validate(FindByIdDto, 'params');
            const permissionData = await req.validate(UpdatePermissionDto, 'body');
            const permission = await this.permissionService.updatePermission(id, permissionData);
            
            res.json({
                code: 0,
                message: '权限更新成功',
                data: permission
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * 删除权限
     * DELETE /api/permissions/:id
     */
    public deletePermission = async (
        req: Request, 
        res: Response<ApiResponse<void>>,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { id } = await req.validate(FindByIdDto, 'params');
            await this.permissionService.deletePermission(id);
            res.json({
                code: 0,
                message: '权限删除成功',
                data: undefined
            });
        } catch (error) {
            next(error);
        }
    }
} 