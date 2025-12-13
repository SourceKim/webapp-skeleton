import { Request, Response } from 'express';
import { PermissionService } from '@/modules/permission/permission.service';
import type { ApiResponse, PaginatedResponse } from '@skeleton/shared-types';
import type { PermissionResponseDto } from '@skeleton/shared-types';
import { HttpException } from '@/exceptions/http.exception';
import { 
    createPermissionSchema,
    updatePermissionSchema
} from '@skeleton/shared-types';
import { idParamSchema } from '@skeleton/shared-types';
import { validateData } from '@/utils/zod-validator';
import { asyncHandler } from '@/utils/async-handler';

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
    public findAllPermissions = asyncHandler(async (
        req: Request, 
        res: Response<ApiResponse<PaginatedResponse<PermissionResponseDto>>>
    ): Promise<void> => {
        // 调用服务获取分页数据
        const { permissions, total } = await this.permissionService.findAllPermissions(req.pagination);
        // 返回分页数据
        return res.pagination(permissions, total);
    })

    /**
     * 根据ID获取权限
     * GET /api/permissions/:id
     */
    public findPermissionById = asyncHandler(async (
        req: Request, 
        res: Response<ApiResponse<PermissionResponseDto>>
    ): Promise<void> => {
        const { id } = validateData(idParamSchema, req.params);
        const permission = await this.permissionService.findPermissionById(id);
        
        if (!permission) {
            throw new HttpException(404, '权限不存在');
        }
        
        res.json({
            code: 0,
            message: 'success',
            data: permission
        });
    })

    /**
     * 创建权限
     * POST /api/permissions
     */
    public createPermission = asyncHandler(async (
        req: Request, 
        res: Response<ApiResponse<PermissionResponseDto>>
    ): Promise<void> => {
        const permissionData = validateData(createPermissionSchema, req.body);
        const permission = await this.permissionService.createPermission(permissionData);
        res.status(200).json({
            code: 0,
            message: '权限创建成功',
            data: permission
        });
    })

    /**
     * 更新权限
     * PUT /api/permissions/:id
     */
    public updatePermission = asyncHandler(async (
        req: Request, 
        res: Response<ApiResponse<PermissionResponseDto>>
    ): Promise<void> => {
        const { id } = validateData(idParamSchema, req.params);
        const permissionData = validateData(updatePermissionSchema, req.body);
        const permission = await this.permissionService.updatePermission(id, permissionData);
        
        res.json({
            code: 0,
            message: '权限更新成功',
            data: permission
        });
    })

    /**
     * 删除权限
     * DELETE /api/permissions/:id
     */
    public deletePermission = asyncHandler(async (
        req: Request, 
        res: Response<ApiResponse<void>>
    ): Promise<void> => {
        const { id } = validateData(idParamSchema, req.params);
        await this.permissionService.deletePermission(id);
        res.json({
            code: 0,
            message: '权限删除成功',
            data: undefined
        });
    })
} 